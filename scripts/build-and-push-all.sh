#!/bin/bash

# Build and Push All Services to GCR
# Usage: ./scripts/build-and-push-all.sh [GCP_PROJECT_ID] [IMAGE_TAG]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
GCP_PROJECT_ID="${1:-${GCP_PROJECT_ID}}"
IMAGE_TAG="${2:-$(git rev-parse --short HEAD)}"

if [ -z "$GCP_PROJECT_ID" ]; then
    echo -e "${RED}Error: GCP_PROJECT_ID is not set${NC}"
    echo "Usage: ./scripts/build-and-push-all.sh <GCP_PROJECT_ID> [IMAGE_TAG]"
    echo "Or set GCP_PROJECT_ID environment variable"
    exit 1
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Building and Pushing Docker Images${NC}"
echo -e "${GREEN}========================================${NC}"
echo "Project ID: $GCP_PROJECT_ID"
echo "Image Tag: $IMAGE_TAG"
echo ""

# Verify gcloud is configured
echo -e "${YELLOW}Verifying gcloud configuration...${NC}"
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" > /dev/null 2>&1; then
    echo -e "${RED}Error: Not authenticated with gcloud${NC}"
    echo "Run: gcloud auth login"
    exit 1
fi

# Configure Docker for GCR
echo -e "${YELLOW}Configuring Docker for GCR...${NC}"
gcloud auth configure-docker --quiet

# Build and push Identity Service
echo -e "${GREEN}[1/4] Building Identity Service...${NC}"
cd services/identity-svc
docker build \
    -t gcr.io/${GCP_PROJECT_ID}/identity-svc:${IMAGE_TAG} \
    -t gcr.io/${GCP_PROJECT_ID}/identity-svc:latest \
    .

echo -e "${YELLOW}Pushing Identity Service...${NC}"
docker push gcr.io/${GCP_PROJECT_ID}/identity-svc:${IMAGE_TAG}
docker push gcr.io/${GCP_PROJECT_ID}/identity-svc:latest
cd ../..

# Build and push Ticket Service
echo -e "${GREEN}[2/4] Building Ticket Service...${NC}"
cd services/ticket-svc
docker build \
    -t gcr.io/${GCP_PROJECT_ID}/ticket-svc:${IMAGE_TAG} \
    -t gcr.io/${GCP_PROJECT_ID}/ticket-svc:latest \
    .

echo -e "${YELLOW}Pushing Ticket Service...${NC}"
docker push gcr.io/${GCP_PROJECT_ID}/ticket-svc:${IMAGE_TAG}
docker push gcr.io/${GCP_PROJECT_ID}/ticket-svc:latest
cd ../..

# Build and push Asset Service
echo -e "${GREEN}[3/4] Building Asset Service...${NC}"
cd services/asset-svc
docker build \
    -t gcr.io/${GCP_PROJECT_ID}/asset-svc:${IMAGE_TAG} \
    -t gcr.io/${GCP_PROJECT_ID}/asset-svc:latest \
    .

echo -e "${YELLOW}Pushing Asset Service...${NC}"
docker push gcr.io/${GCP_PROJECT_ID}/asset-svc:${IMAGE_TAG}
docker push gcr.io/${GCP_PROJECT_ID}/asset-svc:latest
cd ../..

# Build and push Reservation Service
echo -e "${GREEN}[4/4] Building Reservation Service...${NC}"
cd services/reservation-svc
docker build \
    -t gcr.io/${GCP_PROJECT_ID}/reservation-svc:${IMAGE_TAG} \
    -t gcr.io/${GCP_PROJECT_ID}/reservation-svc:latest \
    .

echo -e "${YELLOW}Pushing Reservation Service...${NC}"
docker push gcr.io/${GCP_PROJECT_ID}/reservation-svc:${IMAGE_TAG}
docker push gcr.io/${GCP_PROJECT_ID}/reservation-svc:latest
cd ../..

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ All images built and pushed!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Images pushed:"
echo "  • gcr.io/${GCP_PROJECT_ID}/identity-svc:${IMAGE_TAG}"
echo "  • gcr.io/${GCP_PROJECT_ID}/ticket-svc:${IMAGE_TAG}"
echo "  • gcr.io/${GCP_PROJECT_ID}/asset-svc:${IMAGE_TAG}"
echo "  • gcr.io/${GCP_PROJECT_ID}/reservation-svc:${IMAGE_TAG}"
echo ""
echo "Next steps:"
echo "  1. Update Helm values with correct image repository"
echo "  2. Deploy to Kubernetes with Helm"
echo ""
echo "Example:"
echo "  helm upgrade --install identity-svc ./deploy/charts/identity-svc \\"
echo "    --set image.repository=gcr.io/${GCP_PROJECT_ID}/identity-svc \\"
echo "    --set image.tag=${IMAGE_TAG} \\"
echo "    -n saas-its-prod"

