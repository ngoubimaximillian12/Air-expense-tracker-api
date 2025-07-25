#!/bin/bash

BASE_URL=http://localhost:5000
EMAIL="max@example.com"
PASSWORD="secure123"
NAME="Max"

echo "🔐 Registering user..."
curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"$NAME\", \"email\":\"$EMAIL\", \"password\":\"$PASSWORD\"}"
echo -e "\n✅ User registered (or already exists)"

echo "🔐 Logging in..."
RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\", \"password\":\"$PASSWORD\"}")

TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d':' -f2 | tr -d '"')
if [ -z "$TOKEN" ]; then
  echo "❌ Failed to extract token from login response"
  echo "$RESPONSE"
  exit 1
fi

echo "✅ Logged in. Token acquired."

echo "💸 Creating an expense..."
curl -s -X POST $BASE_URL/api/expenses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Groceries",
    "amount": 45.99,
    "date": "2025-06-19"
  }'
echo -e "\n✅ Expense created"

echo "📊 Fetching all expenses..."
curl -s -X GET $BASE_URL/api/expenses \
  -H "Authorization: Bearer $TOKEN"
echo -e "\n✅ Done"
