#!/bin/bash
set -e

# 1. Vite frontend build
npx vite build

# 2. Create Vercel Build Output API v3 structure
mkdir -p .vercel/output/static
mkdir -p ".vercel/output/functions/api/index.func"

# 3. Copy frontend static files
cp -r dist/. .vercel/output/static/

# 4. Bundle Express API into a single CJS file
npx esbuild server.ts \
  --bundle \
  --platform=node \
  --format=cjs \
  --outfile=".vercel/output/functions/api/index.func/index.js"

# 5. Vercel function config
cat > ".vercel/output/functions/api/index.func/.vc-config.json" << 'EOF'
{
  "runtime": "nodejs20.x",
  "handler": "index.js",
  "maxDuration": 30,
  "launcherType": "Nodejs",
  "shouldAddHelpers": false,
  "shouldAddSourcemapSupport": false
}
EOF

# 6. Vercel routing config
cat > ".vercel/output/config.json" << 'EOF'
{
  "version": 3,
  "routes": [
    { "src": "^/api(/.*)?$", "dest": "/api/index" },
    { "src": "^/sitemap\\.xml$", "dest": "/api/index" },
    { "handle": "filesystem" },
    { "src": "^/(.*)$", "dest": "/index.html" }
  ]
}
EOF

echo "Build Output API structure created successfully."
