#!/bin/bash

# This script fixes build directory issues for Render deployment

# Run the normal build
npm run build

# Make sure server/public exists
mkdir -p server/public

# Copy the built files to where the server expects them
if [ -d "dist/client" ]; then
  cp -r dist/client/* server/public/
  echo "Copied dist/client to server/public"
elif [ -d "dist" ]; then
  cp -r dist/* server/public/
  echo "Copied dist to server/public"
else
  echo "Error: No build directory found"
  exit 1
fi

# Create an empty index.html if it doesn't exist
if [ ! -f "server/public/index.html" ]; then
  echo "Creating empty index.html"
  echo "<html><body><h1>App is loading...</h1></body></html>" > server/public/index.html
fi

echo "Build directory fix complete"