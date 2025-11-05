
Azure Static Web Apps (Blazor + Azure Functions) — Local Development on Windows
==============================================================================

Overview
--------
This document explains the full setup of Azure Static Web Apps (SWA) with Blazor WebAssembly frontend and Azure Functions backend on Windows. It includes all troubleshooting steps and configuration notes tested successfully on Muhammad's system.

Tools & Versions
----------------
- Node.js: v20.17.0
- npm: v10.8.2
- NVM for Windows: v1.2.2
- Azure Functions Core Tools: v4.3.0
- Azure Static Web Apps CLI: v2.0.7
- PowerShell (recommended shell)

Step-by-Step Setup
------------------

1. Install NVM for Windows
   - Download `nvm-setup.exe` from https://github.com/coreybutler/nvm-windows/releases
   - Choose:
     - Root path: C:\nvm
     - Node path: C:\Program Files\nodejs
   - Verify installation with: `nvm version`

2. Install Node.js 20 and Switch to It
   ```powershell
   nvm install 20.17.0
   nvm use 20.17.0
   node -v
   npm -v
   ```

3. Allow PowerShell Scripts
   ```powershell
   Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force
   ```

4. Install Global Tools
   ```powershell
   npm i -g @azure/static-web-apps-cli@latest
   npm i -g azure-functions-core-tools@4 --unsafe-perm true
   ```

5. Verify PATH
   ```powershell
   $env:PATH = "C:\Program Files\nodejs;$env:APPDATA\npm;$env:PATH"
   Get-Command node
   Get-Command swa
   Get-Command func
   ```

6. Verify if everything is installed and running correctly
   ```powershell
   node -v
   npm -v
   swa --version
   func --version
   dotnet --version
   ```
7. Check PATH entries
   ```powershell
   $env:PATH -split ';' | Select-String -SimpleMatch 'nodejs','npm','nvm','azure-functions-core-tools'



Running the Local Environment
-----------------------------
**Goal: Reproduce Azure Static Web Apps locally with separate UI (Blazor) and API (Azure Functions) processes, unified by the SWA CLI proxy.**

1. Start the API in separate terminal-A
   ```Bash
   cd /c/Dev/cloud-cert-paths/api
   func start --port 7071
   ```
   output: Functions:
  GetCerts: [GET] http://localhost:7071/api/GetCerts

2. Start the Blazor Frontend in separate terminal-B
   ```Bash
      cd /c/Dev/cloud-cert-paths/web
   dotnet run
   ```
   output: http://localhost:5009

3. Start the SWA Emulator
   ```Bash
   cd /c/Dev/cloud-cert-paths
   swa start http://127.0.0.1:5009 --api-location "http://127.0.0.1:7071" --port 4281 --verbose
   ```

expected output:
✔ Using the app dev server at: http://127.0.0.1:5009
✔ Using the API dev server at: http://127.0.0.1:7071
CLick on following: 
Visit http://localhost:4281 to view the app.



Browser (http://localhost:4281)
           |
           v
     SWA CLI Proxy (4281)
      ├── /           → http://127.0.0.1:5009  (Blazor dev server)
      └── /api/*      → http://127.0.0.1:7071  (Functions runtime)





4. i have created a shell script  in main folder to run from terminal in one go (run-all.sh)
chmod +x run-all.sh
./run-all.sh

5. Now making one click solution




Common Pitfalls & Fixes
-----------------------
- `exec: node: not found`: use PowerShell, not Git Bash.
- `unknown option --api-host`: use `--api-location` instead.
- `Core Tools incompatible`: downgrade Node to v20 or v18.
- Script blocked: run `Set-ExecutionPolicy RemoteSigned`.
- Stuck at 90–97%: API not responding; start API first.

Summary of Commands
-------------------
| Task | Command |
|------|----------|
| Start API | `func start --port 7071` |
| Start Blazor | `dotnet run` |
| Start SWA | `swa start http://127.0.0.1:5009 --api-location "http://127.0.0.1:7071" --port 4281 --verbose` |
| Open site | `http://localhost:4281` |

Architecture Summary
--------------------
SWA CLI proxies between frontend and API for full local simulation:

Frontend (5009) ← SWA Proxy (4281) → API (7071)

Tips
----
- Add permanent PATH entries for:
  - C:\Program Files\nodejs
  - %APPDATA%\npm
  - C:\nvm
- Keep Node 20 active with `nvm use 20.17.0`
- Use PowerShell for consistent PATH handling.
