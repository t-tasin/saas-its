#!/bin/bash

# Start NL Gateway locally for development

echo "🚀 Starting NL Gateway locally..."

# Check if .env exists
if [ ! -f .env ]; then
  echo "⚠️  No .env file found. Creating from template..."
  cp env-template.txt .env
  echo "✅ Created .env file. Please edit it with your configuration."
  echo ""
  echo "Required changes:"
  echo "  - Verify GROQ_API_KEY"
  echo "  - Set TICKET_BASE to your ticket-svc URL (e.g., http://localhost:3002/v1)"
  echo ""
  read -p "Press enter after editing .env to continue..."
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Load environment variables
export $(grep -v '^#' .env | xargs)

# Check if TICKET_BASE is set
if [ -z "$TICKET_BASE" ]; then
  echo "❌ TICKET_BASE is not set in .env"
  exit 1
fi

# Check if GROQ_API_KEY is set
if [ -z "$GROQ_API_KEY" ]; then
  echo "❌ GROQ_API_KEY is not set in .env"
  exit 1
fi

echo "✅ Configuration loaded"
echo "   Provider: $LLM_PROVIDER"
echo "   Model: $GROQ_MODEL"
echo "   Ticket Service: $TICKET_BASE"
echo "   Port: $PORT"
echo ""

# Start the service
echo "🎯 Starting service on http://localhost:${PORT:-3100}"
echo ""
npm run dev

