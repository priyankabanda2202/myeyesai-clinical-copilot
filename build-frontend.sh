#!/usr/bin/env bash
set -o errexit

echo "=== VisionFlow frontend build ==="
cd web
npm install

if [ -n "$NEXT_PUBLIC_API_URL" ]; then
  echo "API URL: $NEXT_PUBLIC_API_URL"
else
  echo "WARN: NEXT_PUBLIC_API_URL not set — production API calls may fail on static hosting"
fi

npm run build
cd ..

if [ ! -f web/out/index.html ]; then
  echo "ERROR: web/out/index.html not found"
  exit 1
fi

echo "=== Frontend build OK ==="
