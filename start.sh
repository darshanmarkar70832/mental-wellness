#!/bin/bash
set -e  # Exit on error

echo "🚀 Starting Deployment Process..."

# Install dependencies (including devDependencies for the build)
npm install

# Set up database schema
echo "🔄 Pushing database schema..."
npm run db:push

# Run build process
echo "🏗️ Building project..."
npm run build

# Ensure the public directory exists
if [ ! -d "server/public" ]; then
  echo "⚠️ server/public directory missing, creating it now..."
  mkdir -p server/public
fi

# Verify that the build exists
if [ ! -f "server/public/index.html" ]; then
  echo "❌ Error: Build failed! No index.html found in server/public"
  exit 1
fi

echo "✅ Build completed successfully!"

# Start the server
echo "🚀 Starting server..."
node dist/index.js
