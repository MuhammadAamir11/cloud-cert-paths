#!/bin/bash
set -e

echo "🚀 Starting Azure Functions API..."
(cd api && func start --port 7071) &

echo "🚀 Starting Blazor frontend..."
(cd web && dotnet run --urls "http://127.0.0.1:5009") &

# Give both a moment to boot
sleep 10

echo "🚀 Starting Azure Static Web Apps emulator..."
swa start http://127.0.0.1:5009 \
  --api-location "http://127.0.0.1:7071" \
  --port 4281 \
  --verbose
