#!/bin/bash

# Deploy All Services to GKE
# Usage: ./scripts/deploy-all-to-gke.sh [GCP_PROJECT_ID] [IMAGE_TAG] [NAMESPACE]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
GCP_PROJECT_ID="${1:-${GCP_PROJECT_ID}}"
IMAGE_TAG="${2:-latest}"
NAMESPACE="${3:-saas-its-prod}"

if [ -z "$GCP_PROJECT_ID" ]; then
    echo -e "${RED}Error: GCP_PROJECT_ID is not set${NC}"
    echo "Usage: ./scripts/deploy-all-to-gke.sh <GCP_PROJECT_ID> [IMAGE_TAG] [NAMESPACE]"
    echo "Or set GCP_PROJECT_ID environment variable"
    exit 1
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deploying Services to GKE${NC}"
echo -e "${GREEN}========================================${NC}"
echo "Project ID: $GCP_PROJECT_ID"
echo "Image Tag: $IMAGE_TAG"
echo "Namespace: $NAMESPACE"
echo ""

# Verify kubectl is configured
echo -e "${YELLOW}Verifying kubectl configuration...${NC}"
if ! kubectl cluster-info > /dev/null 2>&1; then
    echo -e "${RED}Error: kubectl is not connected to a cluster${NC}"
    echo "Run: gcloud container clusters get-credentials CLUSTER_NAME --region REGION"
    exit 1
fi

# Create namespace if it doesn't exist
echo -e "${YELLOW}Ensuring namespace exists...${NC}"
kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -

# Deploy Identity Service
echo -e "${GREEN}[1/4] Deploying Identity Service...${NC}"
helm upgrade --install identity-svc ./deploy/charts/identity-svc \
    -f ./deploy/charts/identity-svc/values-prod.yaml \
    --set image.repository=gcr.io/${GCP_PROJECT_ID}/identity-svc \
    --set image.tag=${IMAGE_TAG} \
    -n ${NAMESPACE} \
    --wait \
    --timeout 5m

# Deploy Ticket Service
echo -e "${GREEN}[2/4] Deploying Ticket Service...${NC}"
helm upgrade --install ticket-svc ./deploy/charts/ticket-svc \
    -f ./deploy/charts/ticket-svc/values-prod.yaml \
    --set image.repository=gcr.io/${GCP_PROJECT_ID}/ticket-svc \
    --set image.tag=${IMAGE_TAG} \
    -n ${NAMESPACE} \
    --wait \
    --timeout 5m

# Deploy Asset Service
echo -e "${GREEN}[3/4] Deploying Asset Service...${NC}"
helm upgrade --install asset-svc ./deploy/charts/asset-svc \
    -f ./deploy/charts/asset-svc/values-prod.yaml \
    --set image.repository=gcr.io/${GCP_PROJECT_ID}/asset-svc \
    --set image.tag=${IMAGE_TAG} \
    -n ${NAMESPACE} \
    --wait \
    --timeout 5m

# Deploy Reservation Service
echo -e "${GREEN}[4/4] Deploying Reservation Service...${NC}"
helm upgrade --install reservation-svc ./deploy/charts/reservation-svc \
    -f ./deploy/charts/reservation-svc/values-prod.yaml \
    --set image.repository=gcr.io/${GCP_PROJECT_ID}/reservation-svc \
    --set image.tag=${IMAGE_TAG} \
    -n ${NAMESPACE} \
    --wait \
    --timeout 5m

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ All services deployed!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Show deployment status
echo -e "${BLUE}Deployment Status:${NC}"
kubectl get deployments -n ${NAMESPACE}
echo ""

echo -e "${BLUE}Pods:${NC}"
kubectl get pods -n ${NAMESPACE}
echo ""

echo -e "${BLUE}Services:${NC}"
kubectl get services -n ${NAMESPACE}
echo ""

# Check if ingress exists
if kubectl get ingress -n ${NAMESPACE} > /dev/null 2>&1; then
    echo -e "${BLUE}Ingress:${NC}"
    kubectl get ingress -n ${NAMESPACE}
    echo ""
fi

echo "Next steps:"
echo "  1. Check pod logs: kubectl logs -f deployment/SERVICE_NAME -n ${NAMESPACE}"
echo "  2. Apply ingress: kubectl apply -f deploy/k8s/prod-ingress.yaml"
echo "  3. Get external IP: kubectl get ingress -n ${NAMESPACE}"
echo "  4. Update DNS to point to external IP"

