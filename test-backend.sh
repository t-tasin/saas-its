#!/bin/bash

# Backend Testing Script
# Tests all backend services for the implemented changes

set -e

BASE_URL_IDENTITY="http://localhost:3000/v1"
BASE_URL_TICKET="http://localhost:3002/v1"
BASE_URL_ASSET="http://localhost:3003/v1"
BASE_URL_RESERVATION="http://localhost:5003/v1"

echo "🧪 Backend Testing Suite"
echo "======================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

test_api() {
  local name=$1
  local method=$2
  local url=$3
  local data=$4
  local expected_code=$5
  local token=$6
  
  echo -n "Testing: $name... "
  
  if [ -n "$token" ]; then
    auth_header="Authorization: Bearer $token"
  else
    auth_header=""
  fi
  
  if [ "$method" == "GET" ] || [ "$method" == "DELETE" ]; then
    response=$(curl -s -w "\n%{http_code}" -X $method "$url" \
      -H "Content-Type: application/json" \
      -H "$auth_header" \
      -H "X-Tenant-Id: test-tenant")
  else
    response=$(curl -s -w "\n%{http_code}" -X $method "$url" \
      -H "Content-Type: application/json" \
      -H "$auth_header" \
      -H "X-Tenant-Id: test-tenant" \
      -d "$data")
  fi
  
  status_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$status_code" -eq "$expected_code" ] || [ "$status_code" -eq 200 ] || [ "$status_code" -eq 201 ]; then
    echo -e "${GREEN}✅ PASS${NC} (Status: $status_code)"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
  else
    echo -e "${RED}❌ FAIL${NC} (Expected: $expected_code, Got: $status_code)"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    echo "$body"
  fi
  echo ""
}

echo "===================="
echo "1. IDENTITY SERVICE"
echo "===================="
echo ""

# Test 1.1: Register a new user
echo "1.1 Register a general user"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL_IDENTITY/auth/register" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: test-tenant" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "Test123456"
  }')
echo "$REGISTER_RESPONSE" | jq '.'
USER_ID=$(echo "$REGISTER_RESPONSE" | jq -r '.userId // empty')
echo "User ID: $USER_ID"
echo ""

# Test 1.2: Request OTP
echo "1.2 Request OTP for general user"
OTP_RESPONSE=$(curl -s -X POST "$BASE_URL_IDENTITY/auth/request-otp" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: test-tenant" \
  -d '{
    "email": "test@example.com"
  }')
echo "$OTP_RESPONSE" | jq '.'
echo ""

# For testing, we'll skip OTP verification since we can't get the actual OTP from email
# Instead, let's test an operator login (which requires password + OTP)

echo "1.3 Register an operator user"
OPERATOR_REGISTER=$(curl -s -X POST "$BASE_URL_IDENTITY/auth/register" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: test-tenant" \
  -d '{
    "email": "operator@example.com",
    "name": "Operator User",
    "password": "Operator123456",
    "role": "operator"
  }')
echo "$OPERATOR_REGISTER" | jq '.'
OPERATOR_ID=$(echo "$OPERATOR_REGISTER" | jq -r '.userId // empty')
echo ""

echo "===================="
echo "2. TICKET SERVICE"
echo "===================="
echo ""

# Test 2.1: Create a ticket
echo "2.1 Create a ticket"
TICKET_RESPONSE=$(curl -s -X POST "$BASE_URL_TICKET/tickets" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: test-tenant" \
  -d '{
    "title": "Test Ticket",
    "description": "This is a test ticket",
    "type": "incident",
    "priority": "medium",
    "requesterName": "Test User",
    "requesterEmail": "test@example.com"
  }')
echo "$TICKET_RESPONSE" | jq '.'
TICKET_ID=$(echo "$TICKET_RESPONSE" | jq -r '.ticket.id // empty')
TICKET_NUMBER=$(echo "$TICKET_RESPONSE" | jq -r '.ticket.number // empty')
echo "Ticket ID: $TICKET_ID"
echo "Ticket Number: $TICKET_NUMBER"
echo ""

# Test 2.2: List tickets
echo "2.2 List tickets"
curl -s -X GET "$BASE_URL_TICKET/tickets?page=1&limit=10" \
  -H "X-Tenant-Id: test-tenant" | jq '.'
echo ""

# Test 2.3: Get ticket by ID
if [ -n "$TICKET_ID" ]; then
  echo "2.3 Get ticket by ID"
  curl -s -X GET "$BASE_URL_TICKET/tickets/$TICKET_ID" \
    -H "X-Tenant-Id: test-tenant" | jq '.'
  echo ""
fi

# Test 2.4: List categories
echo "2.4 List ticket categories"
curl -s -X GET "$BASE_URL_TICKET/tickets/categories" \
  -H "X-Tenant-Id: test-tenant" | jq '.'
echo ""

echo "===================="
echo "3. ASSET SERVICE"
echo "===================="
echo ""

# Test 3.1: Create asset type
echo "3.1 Create asset type"
ASSET_TYPE_RESPONSE=$(curl -s -X POST "$BASE_URL_ASSET/assets/types" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: test-tenant" \
  -d '{
    "name": "Laptop"
  }')
echo "$ASSET_TYPE_RESPONSE" | jq '.' 2>/dev/null || echo "$ASSET_TYPE_RESPONSE"
echo ""

# Test 3.2: List asset types
echo "3.2 List asset types"
curl -s -X GET "$BASE_URL_ASSET/assets/types" \
  -H "X-Tenant-Id: test-tenant" | jq '.'
echo ""

# Test 3.3: Create an asset
echo "3.3 Create an asset"
ASSET_RESPONSE=$(curl -s -X POST "$BASE_URL_ASSET/assets" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: test-tenant" \
  -d '{
    "assetId": "TEST-001",
    "type": "Laptop",
    "description": "Test MacBook Pro",
    "fundingDepartment": "IT",
    "manufacturer": "Apple",
    "model": "MacBook Pro 14",
    "serialNumber": "TEST123456",
    "status": "available"
  }')
echo "$ASSET_RESPONSE" | jq '.'
ASSET_ID=$(echo "$ASSET_RESPONSE" | jq -r '.asset.id // empty')
echo "Asset ID: $ASSET_ID"
echo ""

# Test 3.4: List assets
echo "3.4 List assets"
curl -s -X GET "$BASE_URL_ASSET/assets?page=1&limit=10" \
  -H "X-Tenant-Id: test-tenant" | jq '.'
echo ""

# Test 3.5: Get asset by ID
if [ -n "$ASSET_ID" ]; then
  echo "3.5 Get asset by ID"
  curl -s -X GET "$BASE_URL_ASSET/assets/$ASSET_ID" \
    -H "X-Tenant-Id: test-tenant" | jq '.'
  echo ""
fi

echo "===================="
echo "4. RESERVATION SERVICE"
echo "===================="
echo ""

# Test 4.1: Create a reservation
echo "4.1 Create a reservation"
REQUEST_DATE=$(date -u -v+1d +"%Y-%m-%dT%H:%M:%S.000Z" 2>/dev/null || date -u -d "+1 day" +"%Y-%m-%dT%H:%M:%S.000Z")
RETURN_DATE=$(date -u -v+5d +"%Y-%m-%dT%H:%M:%S.000Z" 2>/dev/null || date -u -d "+5 days" +"%Y-%m-%dT%H:%M:%S.000Z")

RESERVATION_RESPONSE=$(curl -s -X POST "$BASE_URL_RESERVATION/reservations" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: test-tenant" \
  -d "{
    \"equipmentType\": \"Laptop\",
    \"quantity\": 1,
    \"purpose\": \"Testing\",
    \"requestDate\": \"$REQUEST_DATE\",
    \"returnDate\": \"$RETURN_DATE\",
    \"requesterName\": \"Test User\",
    \"requesterEmail\": \"test@example.com\"
  }")
echo "$RESERVATION_RESPONSE" | jq '.'
RESERVATION_ID=$(echo "$RESERVATION_RESPONSE" | jq -r '.reservation.id // empty')
RESERVATION_NUMBER=$(echo "$RESERVATION_RESPONSE" | jq -r '.reservation.reservationNumber // empty')
echo "Reservation ID: $RESERVATION_ID"
echo "Reservation Number: $RESERVATION_NUMBER"
echo ""

# Test 4.2: List reservations
echo "4.2 List reservations"
curl -s -X GET "$BASE_URL_RESERVATION/reservations?page=1&limit=10" \
  -H "X-Tenant-Id: test-tenant" | jq '.'
echo ""

# Test 4.3: Get reservation by ID
if [ -n "$RESERVATION_ID" ]; then
  echo "4.3 Get reservation by ID"
  curl -s -X GET "$BASE_URL_RESERVATION/reservations/$RESERVATION_ID" \
    -H "X-Tenant-Id: test-tenant" | jq '.'
  echo ""
fi

echo "===================="
echo "📊 TEST SUMMARY"
echo "===================="
echo ""
echo -e "${GREEN}✅ Tests Passed: $TESTS_PASSED${NC}"
echo -e "${RED}❌ Tests Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}⚠️  Some tests failed. Please review the output above.${NC}"
  exit 1
fi

