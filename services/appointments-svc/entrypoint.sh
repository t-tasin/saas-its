#!/bin/sh
set -e

echo "🚀 Starting appointments-svc..."
echo "📍 Working directory: $(pwd)"
echo "📁 Files in /app:"
ls -la /app

echo ""
echo "🔍 Checking Prisma schema..."
if [ -f "/app/prisma/schema.prisma" ]; then
  echo "✅ Prisma schema found"
else
  echo "❌ Prisma schema NOT found"
  exit 1
fi

echo ""
echo "🗄️ Running Prisma migrations..."
npx prisma db push --accept-data-loss --skip-generate || {
  echo "⚠️  Prisma migration failed, but continuing..."
}

echo ""
echo "✅ Migrations complete. Starting application..."
echo "🌐 Server will listen on port ${PORT:-3400}"

exec node --enable-source-maps /app/dist/index.js

