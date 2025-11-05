
# 02 — Technical Explanation (Why / How)

## Architecture (Why these components)
- **Blazor WebAssembly** — UI in C#, strongly‑typed, no JS framework required. Ideal for a Cloud Development student leveraging .NET.
- **Azure Functions (isolated)** — modern serverless backend; small, focused HTTP endpoints; easy to add compare/mapping/AI.
- **Azure Static Web Apps** — host both together; built‑in proxy `/api/*` → Functions; free HTTPS; CI/CD from GitHub.

## Data flow (How it works)
1. Browser requests the SPA (Blazor) from Static Web Apps.
2. SPA calls `/api/GetCerts` (SWA proxies to Functions).
3. Function reads `data/certs.json` and returns JSON.
4. Blazor renders certs, search, filters.

## Design principles
- **MVP first**: JSON → API → UI (migrate to Cosmos DB later if needed).
- **Type‑safe**: C# models for certs; validation during load.
- **Separation**: `web` and `api` isolated but deployed together.
- **Reusability**: endpoints designed for catalog, compare, mapping, AI.
