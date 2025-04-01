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

# Build the client
npm run build

# Run the server
node dist/index.js