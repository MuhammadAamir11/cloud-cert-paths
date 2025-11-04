#!/bin/bash

echo "🚀 Starting Azure Functions API..."
(cd api && func start --port 7071) &

echo "🚀 Starting Blazor frontend..."
(cd web && dotnet run) &

sleep 10  # give API & frontend a few seconds to start

echo "🚀 Starting Static Web Apps emulator..."
(cd . && swa start http://127.0.0.1:5009 --api-location "http://127.0.0.1:7071" --port 4281 --verbose)
