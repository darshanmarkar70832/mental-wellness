#!/bin/bash
set -e

# Temporarily set NODE_ENV to development to install devDependencies
NODE_ENV=development npm install

# Install vite globally to ensure it's available at runtime
npm install -g vite

# Now set NODE_ENV to production for the build and runtime
export NODE_ENV=production

# Push the database schema to ensure tables exist
echo "Setting up database schema..."
npm run db:push

# Build the client and ensure proper directory structure
npm run build
# Make sure public directory exists for the server
mkdir -p server/public
# Copy build files to the expected location
cp -r dist/* server/public/ || echo "Warning: Could not copy build files, trying to continue anyway"

# Run the server
node dist/index.js