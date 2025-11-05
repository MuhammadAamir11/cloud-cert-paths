
# 00 — Prerequisites & Environment

## Why this page?
Environment reproducibility is critical. These prerequisites ensure anyone can run the app from scratch without surprises.

## Required Tools
- **.NET SDK**: 9.x installed (the web app can target net9), and **.NET 8** is recommended for Azure Functions
- **Azure Functions Core Tools v4**
- **Git**
- **Node.js 20+** (for SWA CLI)
- **Azure Static Web Apps CLI**: `npm i -g @azure/static-web-apps-cli`

## Verify
```bash
dotnet --version
func --version
git --version
node -v
swa --version
```

## Folder Hygiene
Use a **short, space‑free path**, e.g. `C:\Dev\cloud-cert-paths`. This avoids quoting/PATH issues on Windows and CI.
