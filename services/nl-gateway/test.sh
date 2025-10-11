#!/bin/bash

# Test script for NL Gateway

BASE_URL="${BASE_URL:-http://localhost:3100}"

echo "🧪 Testing NL Gateway at $BASE_URL"
echo ""

# Test 1: Health Check
echo "1️⃣  Testing health check..."
HEALTH=$(curl -s "$BASE_URL/healthz")
if echo "$HEALTH" | grep -q '"ok":true'; then
  echo "   ✅ Health check passed"
else
  echo "   ❌ Health check failed: $HEALTH"
  exit 1
fi
echo ""

# Test 2: Urgent Incident
echo "2️⃣  Testing urgent incident creation..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/nl/tickets" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "URGENT: Production server is down! All users are affected. Need immediate help!",
    "fallback": {
      "name": "Test User",
      "email": "test@example.com"
    }
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "201" ]; then
  echo "   ✅ Ticket created successfully (HTTP 201)"
  echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
  echo "   ❌ Failed with HTTP $HTTP_CODE"
  echo "$BODY"
fi
echo ""

# Test 3: Access Request
echo "3️⃣  Testing access request creation..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/nl/tickets" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I need access to the SharePoint site for the Marketing team",
    "fallback": {
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "201" ]; then
  echo "   ✅ Ticket created successfully (HTTP 201)"
  echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
  echo "   ❌ Failed with HTTP $HTTP_CODE"
  echo "$BODY"
fi
echo ""

# Test 4: Hardware Issue
echo "4️⃣  Testing hardware issue creation..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/nl/tickets" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "My laptop keyboard keys are sticking. The spacebar and enter key are not working properly.",
    "fallback": {
      "name": "John Smith",
      "email": "john@example.com"
    }
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "201" ]; then
  echo "   ✅ Ticket created successfully (HTTP 201)"
  echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
  echo "   ❌ Failed with HTTP $HTTP_CODE"
  echo "$BODY"
fi
echo ""

# Test 5: Error case - Missing text
echo "5️⃣  Testing error handling (missing text)..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/nl/tickets" \
  -H "Content-Type: application/json" \
  -d '{}')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "400" ]; then
  echo "   ✅ Correctly returned 400 for missing text"
else
  echo "   ⚠️  Expected 400, got HTTP $HTTP_CODE"
fi
echo ""

echo "✅ All tests completed!"

