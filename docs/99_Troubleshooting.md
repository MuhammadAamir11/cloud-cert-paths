
# 99 — Troubleshooting

## SWA proxy stalls at 90–97%
Start **both** API and Blazor before SWA. Verify ports match the `swa start` command.

## `/api/GetCerts` returns not found
Ensure `data/certs.json` exists at repo root and the Function builds the path with `.., "data", "certs.json"`.

## CORS errors when opening Blazor directly
Use the SWA proxy URL (e.g., `http://localhost:4281`) so `/api/*` is proxied to Functions.

## `swa` or `func` not recognized
Reinstall tools (`npm i -g @azure/static-web-apps-cli`, Functions Core Tools v4) and open a new terminal.

## Paths with spaces cause odd errors
Use `C:\Dev\cloud-cert-paths` or similar short, space‑free paths.
