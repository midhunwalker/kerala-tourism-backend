#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Backend API Testing${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Test 1: Health Check
echo -e "${BLUE}[1] Testing Root Endpoint (Health Check)${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✓ Response: $BODY${NC}"
  echo -e "${GREEN}✓ Status Code: $HTTP_CODE${NC}\n"
else
  echo -e "${RED}✗ Failed with status code: $HTTP_CODE${NC}\n"
fi

# Test 2: Sign Up (Create User)
echo -e "${BLUE}[2] Testing Sign Up Endpoint${NC}"
SIGNUP_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123"
  }')

HTTP_CODE=$(echo "$SIGNUP_RESPONSE" | tail -n1)
BODY=$(echo "$SIGNUP_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✓ Status Code: $HTTP_CODE${NC}"
  echo -e "${GREEN}✓ Response: $BODY${NC}\n"
else
  echo -e "${RED}✗ Status Code: $HTTP_CODE${NC}"
  echo -e "${RED}Response: $BODY${NC}\n"
fi

# Test 3: Login
echo -e "${BLUE}[3] Testing Login Endpoint${NC}"
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -n1)
BODY=$(echo "$LOGIN_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✓ Status Code: $HTTP_CODE${NC}"
  echo -e "${GREEN}✓ Response: $BODY${NC}\n"
  TOKEN=$(echo "$BODY" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
else
  echo -e "${RED}✗ Status Code: $HTTP_CODE${NC}"
  echo -e "${RED}Response: $BODY${NC}\n"
fi

# Test 4: Protected Route (if token obtained)
if [ ! -z "$TOKEN" ]; then
  echo -e "${BLUE}[4] Testing Protected Route (Using JWT Token)${NC}"
  PROTECTED_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/users/profile" \
    -H "Authorization: Bearer $TOKEN")
  
  HTTP_CODE=$(echo "$PROTECTED_RESPONSE" | tail -n1)
  BODY=$(echo "$PROTECTED_RESPONSE" | head -n-1)
  
  if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Status Code: $HTTP_CODE${NC}"
    echo -e "${GREEN}✓ Response: $BODY${NC}\n"
  else
    echo -e "${RED}✗ Status Code: $HTTP_CODE${NC}"
    echo -e "${RED}Response: $BODY${NC}\n"
  fi
else
  echo -e "${RED}[4] Skipped (No token available)${NC}\n"
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Testing Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
