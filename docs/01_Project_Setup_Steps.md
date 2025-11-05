
# 01 — Project Setup (Step‑by‑Step)

This is a **from zero to running** guide. It explains **what**, **how**, and **why**.

---

## 1) Create the workspace
**Why:** A clean, short path avoids quoting/port issues.

```bash
mkdir -p C:\Dev\cloud-cert-paths
cd C:\Dev\cloud-cert-paths
```

Open the folder in VS Code.

---

## 2) Create the Blazor WebAssembly frontend
**Why:** C# single‑page app in the browser; no React needed.

```bash
dotnet new blazorwasm -o web
```

**Check:**
```bash
ls -la web
```
**Expect:** `web.csproj`, `Program.cs`, `Pages/`, `wwwroot/`

**Optional run:**
```bash
cd web
dotnet watch run
# Expect: Now listening on: http://localhost:5177
cd ..
```

---

## 3) Create the Azure Functions backend (isolated, .NET 8)
**Why:** Serverless APIs; easy scaling; modern isolated worker.

```bash
func init api --worker-runtime dotnet-isolated --target-framework net8.0
func new --name GetCerts --template "HTTP trigger" --authlevel "Anonymous"
```

**Check:**
```bash
ls -la api
```
**Expect:** `api.csproj`, `Program.cs`, `host.json`, `GetCerts.cs`

**Test directly:**
```bash
cd api
func start
# Expect route: http://localhost:7071/api/GetCerts
cd ..
```

---

## 4) Create a solution and add both projects
**Why:** Build/restore/manage both projects together.

```bash
dotnet new sln -n CloudCertPaths
dotnet sln CloudCertPaths.sln add web/web.csproj
dotnet sln CloudCertPaths.sln add api/api.csproj
dotnet sln CloudCertPaths.sln list
# Expect to list both projects
```

**Build sanity:**
```bash
dotnet build CloudCertPaths.sln
# Expect: Build succeeded.
```

---

## 5) Add data and wire the API (Step 2 preview)
**Why:** Ship a working MVP quickly without a database.

1. Create `data/certs.json` at repo root.
2. Update `api/GetCerts.cs` to read that JSON and return it.
3. In `web`, call `/api/GetCerts` and render the list.
4. Run locally with SWA proxy (below).

---

## 6) Run all parts together locally (SWA proxy)
**Why:** The SWA CLI mirrors Azure Static Web Apps routing so `/api/*` is proxied to Functions.

**Three terminals:**

**A) Functions**
```bash
cd api
func start
# Expect: http://localhost:7071/api/GetCerts
```

**B) Blazor**
```bash
cd web
# optional: set a fixed port
set ASPNETCORE_URLS=http://127.0.0.1:5009
dotnet watch run
# Expect: Now listening on http://127.0.0.1:5009
```

**C) SWA proxy**
```bash
swa start http://127.0.0.1:5009 --api-location "http://127.0.0.1:7071" --port 4281 --verbose
# Expect: Listening on: http://localhost:4281
```

Open **http://localhost:4281** → UI + `/api/*` work together.
