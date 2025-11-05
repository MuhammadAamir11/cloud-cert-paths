# 🌩️ Cloud Certification Path Visualizer — Progress Summary (Step 0 → Step 3)

## 🧭 Project Vision
This project aims to help learners understand **cloud certification paths** across major providers (Azure, AWS, GCP).  
It visualizes how certifications connect, lets users compare them, and later will include AI-assisted guidance.

---

## ⚙️ Step 0 — Environment & Tooling Setup

### ✅ Tools Installed
| Tool | Purpose | Verified By |
|------|----------|-------------|
| **.NET SDK 9.0.306** | Builds and runs Blazor & Azure Functions apps | `dotnet --version` |
| **Azure Functions Core Tools v4.3.0** | Runs serverless functions locally | `func --version` |
| **Git 2.51.0** | Version control / GitHub sync | `git --version` |
| **VS Code** | Lightweight IDE + terminal | — |

### 🤩 Why this matters
These tools form the foundation for the **C# + Blazor WebAssembly + Azure Functions (Isolated)** stack that will later deploy to Azure Static Web Apps.

---

## 🏷️️ Step 1 — Project Skeleton & Solution Setup

### Folder Structure
```
cloud-cert-paths/
 ├─ api/        ← Azure Functions backend (.NET 8 isolated)
 ├─ web/        ← Blazor WebAssembly frontend
 ├─ data/       ← Shared JSON data (certifications)
 └─ CloudCertPaths.sln
```

### Commands Run & Purpose
```bash
dotnet new blazorwasm -o web          # create frontend UI
dotnet new func --name api --worker-runtime dotnet-isolated  # create backend
dotnet new sln -n CloudCertPaths      # create solution
dotnet sln add web/web.csproj api/api.csproj  # add projects
```

### ✅ Why
- A **.sln** keeps both projects buildable together.  
- This mirrors the **Azure Static Web Apps** folder convention (`api/` + `web/`).  
- Easy to host & deploy together.

### ✅ Build Test
```bash
dotnet build CloudCertPaths.sln
```
✅ Output — “Build succeeded”

---

## 🔧 Step 1.5 — Local Run Automation (Script)

Created a helper script to run everything together:

```bash
#!/bin/bash
(cd api && func start --port 7071) &
(cd web && dotnet run) &
sleep 10
(cd . && swa start http://127.0.0.1:5009 --api-location "http://127.0.0.1:7071" --port 4281 --verbose)
```

### Why
Starts the **API**, **Blazor frontend**, and **Static Web Apps emulator** in one go for local end-to-end testing.

---

## 🧱 Step 2 — API Foundation (“GetCerts” Function)

### ✅ Added `data/certs.json`
Example contents (shortened):
```json
[
  { "id": "101", "provider": "Azure", "name": "Microsoft Certified: Azure Fundamentals (AZ-900)" },
  { "id": "201", "provider": "AWS", "name": "AWS Certified Cloud Practitioner" },
  { "id": "301", "provider": "GCP", "name": "Google Cloud Digital Leader" }
]
```

### ✅ Added Service `CertRepository.cs`
- Reads `data/certs.json`
- Caches the result in memory
- Provides lookup methods for future comparison

```csharp
var baseDir = AppContext.BaseDirectory;
_path = Path.Combine(baseDir, "data", "certs.json");
```

`api.csproj` includes:
```xml
<None Include="..\data\certs.json" Link="data\certs.json">
  <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
</None>
```

➡ Ensures `certs.json` is copied to the output folder on build so Functions can find it at runtime.

### ✅ Function `GetCerts.cs`
Returns the entire certification list as JSON:

```csharp
[Function("GetCerts")]
public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData req)
{
    var certs = await _repo.GetAllAsync();
    var res = req.CreateResponse(HttpStatusCode.OK);
    await res.WriteAsJsonAsync(certs);
    return res;
}
```

### 🔍 Test
```
http://localhost:7071/api/GetCerts
```
**Output:** JSON array of certifications ✅

---

## ⚖️ Step 3 — Compare Feature (API)

### Added `CompareFunction.cs`
Compares two certifications by ID and returns a summary object:

```csharp
/api/compare?left=101&right=102
```

Produces a response like:
```json
{
  "left": { "id": "101", "provider": "Azure", "name": "Microsoft Certified: Azure Fundamentals (AZ-900)" },
  "right": { "id": "102", "provider": "Azure", "name": "Azure Administrator Associate (AZ-104)" },
  "summary": {
    "levelDifference": 1,
    "roleOverlap": 50.0,
    "domainOverlap": 33.3
  }
}
```

### ✅ Why
Enables the core comparison logic that will feed the frontend UI.  
Currently static (from `certs.json`), later will be data-driven and AI-assisted.

---

## 🥉 Current Working Endpoints
| Endpoint | Description | Example |
|-----------|--------------|----------|
| `/api/GetCerts` | Returns all certifications | [localhost:7071/api/GetCerts](http://localhost:7071/api/GetCerts) |
| `/api/compare?left=101&right=102` | Compares two certs | [localhost:7071/api/compare?left=101&right=102](http://localhost:7071/api/compare?left=101&right=102) |

---

## 🧠 Next Steps
1. **Step 4** → Build the Blazor `/compare` UI page.  
2. Add search/filter on frontend using `GetCerts`.  
3. Integrate basic AI (Q&A bot + recommendations).  
4. Later: Email automation via n8n for personalized cert guides.

---

### ✅ Status Summary
- ✅ Toolchain ready  
- ✅ Frontend + backend created and linked  
- ✅ API reads real data  
- ✅ Comparison endpoint works  
- 🕸️ Next up → Frontend integration (UI)

