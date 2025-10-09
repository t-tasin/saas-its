#!/bin/bash

# Test script for Identity Service Authentication

BASE_URL="http://localhost:3000/v1"

echo "=================================="
echo "Identity Service Authentication Tests"
echo "=================================="
echo ""

# Test 1: Register General User
echo "📝 Test 1: Register General User"
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user1@example.com",
    "password": "UserPass123!",
    "name": "Test User 1",
    "role": "general"
  }')
echo "$REGISTER_RESPONSE" | jq '.user | {email, role, name}'
echo ""

# Test 2: Login
echo "🔐 Test 2: Login"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user1@example.com",
    "password": "UserPass123!"
  }')
echo "$LOGIN_RESPONSE" | jq '.user | {email, role}'
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
echo "Token received: ${TOKEN:0:50}..."
echo ""

# Test 3: Register Admin
echo "👑 Test 3: Register Admin User"
ADMIN_REGISTER=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "AdminPass123!",
    "name": "Test Admin",
    "role": "admin"
  }')
echo "$ADMIN_REGISTER" | jq '.user | {email, role}'
ADMIN_TOKEN=$(echo "$ADMIN_REGISTER" | jq -r '.token')
echo ""

# Test 4: List Users (without token - should use default dev user with admin role)
echo "📋 Test 4: List Users (DEV mode - no token)"
curl -s $BASE_URL/users | jq 'length'
echo " users found"
echo ""

# Test 5: Create Operator (as default dev admin)
echo "➕ Test 5: Create Operator User (as dev admin)"
curl -s -X POST $BASE_URL/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "operator@test.com",
    "password": "OpPass123!",
    "name": "Test Operator",
    "role": "operator"
  }' | jq '{email, role, name}'
echo ""

# Test 6: Get all users
echo "👥 Test 6: List All Users"
curl -s $BASE_URL/users | jq '.[] | {email, role, isActive}'
echo ""

# Test 7: Login as wrong password
echo "❌ Test 7: Login with Wrong Password (should fail)"
curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user1@example.com",
    "password": "WrongPassword"
  }' | jq '.error'
echo ""

echo "=================================="
echo "✅ All tests completed!"
echo "=================================="

