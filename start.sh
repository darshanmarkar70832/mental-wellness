#!/bin/bash
set -e

# Running in production mode
export NODE_ENV=production

# Install vite globally to ensure it's available at runtime
npm install -g vite

# Build the client
npm run build

# Run the server
node dist/index.js