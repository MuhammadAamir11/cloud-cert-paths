
# 03 — Current Status & Demo Notes

## What is working now
- **web/** Blazor app boots, shows a certifications list and search.
- **api/** Azure Functions has **GetCerts** that reads and returns `data/certs.json`.
- **One‑command dev**: a Bash script starts API → web → SWA proxy in order.

### Dev script (local convenience)
```bash
#!/bin/bash
set -euo pipefail

cleanup() { echo "🧹 Stopping background processes..."; jobs -p | xargs -r kill; }
trap cleanup EXIT

echo "🚀 Starting Azure Functions API..."
( cd api && func start --port 7071 ) &

echo "🚀 Starting Blazor frontend..."
( cd web && ASPNETCORE_URLS=http://127.0.0.1:5009 dotnet run ) &

sleep 8

echo "🚀 Starting Static Web Apps emulator..."
swa start http://127.0.0.1:5009 --api-location "http://127.0.0.1:7071" --port 4281 --verbose
```

**Why this order?** SWA needs both servers up to proxy correctly.

## Demo URLs (local)
- API direct: `http://localhost:7071/api/GetCerts`
- Unified local URL (proxy): `http://localhost:4281`
