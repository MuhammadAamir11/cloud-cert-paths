# Cloud Certification Path Finder – Step-by-Step Setup Guide

This guide walks you from an empty folder to a **working local Blazor WebAssembly frontend** + **Azure Functions backend**, both running together through the **Azure Static Web Apps (SWA) CLI**.

---

## 🧰 Step 0: Verify Tools

**Why:** Before generating code, make sure all required tools are installed and accessible.

```bash
dotnet --version
func --version
git --version
```

**Expected outputs:**
```
dotnet --version  → 9.0.306
func --version    → 4.3.0
git --version     → 2.51.0
```

✅ *Notes:*
- .NET 9 works fine, but Azure Functions aligns best with **.NET 8**. We will target `net8.0` for the backend.
- Functions Core Tools v4 is required to run APIs locally.
- Git is needed for version control and deployment to GitHub.

---

## 🗂 Step 1: Create the Project Skeleton

We will create:

```
cloud-cert-paths/
├── web/    ← Blazor WebAssembly frontend
├── api/    ← Azure Functions backend
└── CloudCertPaths.sln ← Solution file to group both
```

### 1.1 Create a Working Folder

**Why:** Keep paths short and clean (no spaces). This prevents issues with quoting and PATH handling.

```bash
mkdir -p C:\Dev\cloud-cert-paths
cd C:\Dev\cloud-cert-paths
```

Open this folder in **VS Code** (File → Open Folder… → select `cloud-cert-paths`).

---

### 1.2 Create the Blazor WebAssembly Frontend

**Command:**
```bash
dotnet new blazorwasm -o web
```

**Why:**
- Generates a complete **C# single-page application (SPA)** that runs in the browser.
- Ideal for displaying your certification visualization and chatbot later.

**What it creates:**
```
web/
  ├── web.csproj
  ├── Program.cs
  ├── Pages/
  ├── wwwroot/
  └── Properties/
```

**Check it:**
```bash
ls -la web
```

**Expected output:**
```
web.csproj
Program.cs
Pages/
wwwroot/
Properties/
```

**Optional quick run test:**
```bash
cd web
dotnet watch run
```
**Expected console output:**
```
Now listening on: http://localhost:5177
```
Open `http://localhost:5177` → you should see the default Blazor template.

Stop with **Ctrl + C**, then return to the root folder:
```bash
cd ..
```

---

### 1.3 Create the Azure Functions Backend

**Commands:**
```bash
func init api --worker-runtime dotnet-isolated --target-framework net8.0
func new --name GetCerts --template "HTTP trigger" --authlevel "Anonymous"
```

**Why:**
- Creates a **serverless backend** using the modern .NET isolated worker model.
- Adds a function named **GetCerts** accessible without authentication (easier for development).

**What it creates:**
```
api/
  ├── api.csproj
  ├── Program.cs
  ├── host.json
  ├── local.settings.json
  └── GetCerts.cs
```

**Check it:**
```bash
ls -la api
```

**Expected output:**
```
api.csproj
Program.cs
host.json
local.settings.json
GetCerts.cs
```

**Run it directly:**
```bash
cd api
func start
```

**Expected console output:**
```
Functions:
  GetCerts: [GET] http://localhost:7071/api/GetCerts
```

Open in browser → **http://localhost:7071/api/GetCerts**

You’ll see the default response:
```
This HTTP triggered function executed successfully.
```

Stop the Function with **Ctrl + C**, then go back:
```bash
cd ..
```

---

### 1.4 Add a Solution and Include Both Projects

**Commands:**
```bash
dotnet new sln -n CloudCertPaths
dotnet sln CloudCertPaths.sln add web/web.csproj
dotnet sln CloudCertPaths.sln add api/api.csproj
dotnet sln CloudCertPaths.sln list
```

**Why:** A solution (`.sln`) lets you manage and build both projects together easily.

**Expected output:**
```
Project(s)
----------
api\api.csproj
web\web.csproj
```

**Build test:**
```bash
dotnet build CloudCertPaths.sln
```

**Expected result:**
```
Build succeeded.
0 Warning(s)
0 Error(s)
```

---

## 🚀 Step 1.5: Run and Verify Both Projects Together

Now you will run everything locally using **three terminals**:
1. Azure Functions backend
2. Blazor frontend
3. SWA CLI proxy (combined local URL)

### Terminal 1: Start the Functions backend

```bash
cd api
func start
```

**Expected console output:**
```
Functions:
  GetCerts: [GET] http://localhost:7071/api/GetCerts
```
Test it: open **http://localhost:7071/api/GetCerts**

✅ You should see the default message.

Keep this terminal running.

---

### Terminal 2: Start the Blazor frontend

```bash
cd web
dotnet watch run
```

**Expected output:**
```
Now listening on: http://localhost:5177
```

Optionally, fix the port for clarity:
```bash
set ASPNETCORE_URLS=http://127.0.0.1:5009
dotnet watch run
```
Now the Blazor app runs at **http://127.0.0.1:5009**.

Keep this terminal running too.

---

### Terminal 3: Start the SWA CLI proxy

```bash
swa start http://127.0.0.1:5009 --api-location "http://127.0.0.1:7071" --port 4281 --verbose
```

**Why this step matters:**
- The **SWA CLI** simulates how Azure Static Web Apps hosts both parts together.
- It proxies **frontend** and **backend** under **one URL**, e.g. `http://localhost:4281`.
- Avoids CORS/port issues and ensures your local setup behaves like Azure.

**Explanation of flags:**
| Flag | Description |
|------|--------------|
| `http://127.0.0.1:5009` | URL where the Blazor app runs |
| `--api-location "http://127.0.0.1:7071"` | Points to local Functions backend |
| `--port 4281` | Port for the combined SWA proxy (open this) |
| `--verbose` | Prints detailed logs of requests & proxying |

**Expected SWA output:**
```
✔ Using the app dev server at: http://127.0.0.1:5009
✔ Using the API dev server at: http://127.0.0.1:7071
✔ Listening on: http://localhost:4281
```

Open **http://localhost:4281** →
- The Blazor UI loads.
- Requests to `/api/GetCerts` are proxied to the Function.

✅ Everything now runs as a single unified app.

Stop each process when done (Ctrl + C).

---

## 🧾 Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| SWA proxy hangs at 90–97% | Start both API and UI before starting SWA |
| `swa` not found | Install globally: `npm i -g @azure/static-web-apps-cli` |
| `func` not found | Reinstall Azure Functions Core Tools v4 and reopen terminal |
| Wrong ports | Make sure Blazor and Functions ports match those in your SWA command |

---

## ✅ Current Status Summary

- .NET, Functions, and Git verified.
- `web/` (Blazor) and `api/` (Functions) created.
- Solution file `CloudCertPaths.sln` connects both.
- Build succeeded with no errors.
- `GetCerts` tested directly: **http://localhost:7071/api/GetCerts**.
- Full app runs under SWA proxy: **http://localhost:4281**.

Your project now has a working foundation for Step 2 — adding real data and connecting the frontend to display certification paths!

