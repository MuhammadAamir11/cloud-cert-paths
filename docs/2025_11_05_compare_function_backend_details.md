# ⚖️ Compare Function — Backend Implementation Details

## 🧭 Purpose
The **Compare Function** is a backend API endpoint that allows users to compare two cloud certifications side-by-side. It forms the foundation for the future frontend feature where users can select any two certifications and visualize their similarities and differences.

This function uses data stored in `data/certs.json` and computes differences in levels, roles, domains, costs, and durations.

---

## 🧱 Why We Built This
When learners explore cloud certifications (Azure, AWS, GCP), they often wonder:
- Which certification corresponds to which level?
- How do two certifications compare (e.g., AZ-900 vs AWS Cloud Practitioner)?
- What should I do next after completing one certification?

The **Compare Function** solves this by providing a structured comparison response that the Blazor frontend can visualize dynamically.

---

## ⚙️ Architecture Overview

### Folder & File Structure
```
api/
 ├── CompareFunction.cs     # Function logic (API endpoint)
 ├── Services/
 │    └── CertRepository.cs # Loads and caches certifications from certs.json
 ├── data/                  # JSON data folder (copied into output)
 │    └── certs.json
 ├── api.csproj             # Function configuration
 └── Program.cs             # Host setup (classic isolated model)
```

### Why Use the Isolated Model
- Cleaner separation between backend logic and Azure runtime.
- Easier dependency injection (DI) support.
- Full control over serialization and configuration.
- Future migration to Azure Functions v5 or container deployments is seamless.

---

## 🧩 Implementation Details

### 1️⃣ Dependency Setup (`Program.cs`)
We use the classic **isolated worker model** (`Microsoft.Azure.Functions.Worker`).

```csharp
var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(services =>
    {
        services.AddSingleton<CertRepository>();
    })
    .Build();

host.Run();
```

**Why:**
- Ensures `CertRepository` is registered as a singleton (cached data).
- Keeps startup lightweight and testable.

---

### 2️⃣ Data Handling (`CertRepository.cs`)
This class loads all certifications from the JSON file and provides search methods.

```csharp
public async Task<List<Certification>> GetAllAsync()
{
    if (_cache is not null) return _cache;
    var json = await File.ReadAllTextAsync(_path);
    _cache = JsonSerializer.Deserialize<List<Certification>>(json)!;
    return _cache;
}

public async Task<Certification?> FindByIdAsync(string id)
{
    var all = await GetAllAsync();
    return all.FirstOrDefault(c => c.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
}
```

**Why:**
- JSON data is cached after the first load.
- Decoupled from Function logic — can be reused or replaced with a DB later.

---

### 3️⃣ API Logic (`CompareFunction.cs`)
Handles GET requests:
```
/api/compare?left=101&right=102
```

#### Function Definition
```csharp
[Function("Compare")]
public async Task<HttpResponseData> Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "compare")] HttpRequestData req)
{
    var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);
    var leftId = query.Get("left");
    var rightId = query.Get("right");

    if (string.IsNullOrWhiteSpace(leftId) || string.IsNullOrWhiteSpace(rightId))
    {
        var bad = req.CreateResponse(HttpStatusCode.BadRequest);
        await bad.WriteStringAsync("Query params required: left, right (e.g. /api/compare?left=101&right=102)");
        return bad;
    }

    var left = await _repo.FindByIdAsync(leftId);
    var right = await _repo.FindByIdAsync(rightId);

    if (left is null || right is null)
    {
        var nf = req.CreateResponse(HttpStatusCode.NotFound);
        await nf.WriteStringAsync($"Not found: {(left is null ? leftId : rightId)}");
        return nf;
    }

    var result = BuildComparison(left, right);
    var ok = req.CreateResponse(HttpStatusCode.OK);
    await ok.WriteAsJsonAsync(result);
    return ok;
}
```

**Why:**
- Keeps endpoints stateless and simple.
- Uses `HttpRequestData` / `HttpResponseData` for clean isolated function handling.
- Responds gracefully with 400 (Bad Request) or 404 (Not Found) if IDs are missing or invalid.

---

### 4️⃣ Comparison Algorithm
The helper method compares key attributes.

```csharp
private static ComparisonResult BuildComparison(Certification a, Certification b)
{
    var levelRank = new Dictionary<string,int>(StringComparer.OrdinalIgnoreCase)
    {
        ["Fundamental"] = 1, ["Associate"] = 2, ["Professional"] = 3, ["Expert"] = 3
    };
    int Rank(string? lvl) => (lvl != null && levelRank.TryGetValue(lvl, out var r)) ? r : 0;

    static double Overlap(IEnumerable<string> x, IEnumerable<string> y)
    {
        var xs = x.Select(s => s.Trim().ToLowerInvariant()).ToHashSet();
        var ys = y.Select(s => s.Trim().ToLowerInvariant()).ToHashSet();
        if (xs.Count == 0 && ys.Count == 0) return 1.0;
        var inter = xs.Intersect(ys).Count();
        var union = xs.Union(ys).Count();
        return union == 0 ? 0 : (double)inter / union;
    }

    return new ComparisonResult
    {
        Left = a,
        Right = b,
        Summary = new ComparisonSummary
        {
            LevelDifference = Rank(a.Level) - Rank(b.Level),
            RoleOverlap = Math.Round(Overlap(a.Role, b.Role) * 100, 1),
            DomainOverlap = Math.Round(Overlap(a.Domains, b.Domains) * 100, 1),
            CostDeltaUsd = (a.Cost_Usd ?? 0) - (b.Cost_Usd ?? 0),
            DurationDelta = (a.Duration_Minutes ?? 0) - (b.Duration_Minutes ?? 0)
        }
    };
}
```

**Why:**
- Defines a numeric scale for levels (Fundamental → Expert).
- Calculates overlap for Roles and Domains.
- Provides percentage-based insights.
- Future-ready for AI-driven weighting or recommendation logic.

---

## ✅ Example Output
Request:
```
GET http://localhost:7071/api/compare?left=101&right=102
```

Response:
```json
{
  "left": { "id": "101", "provider": "Azure", "name": "Microsoft Certified: Azure Fundamentals (AZ-900)" },
  "right": { "id": "102", "provider": "Azure", "name": "Azure Administrator Associate (AZ-104)" },
  "summary": {
    "levelDifference": 1,
    "roleOverlap": 50.0,
    "domainOverlap": 33.3,
    "costDeltaUsd": 0,
    "durationDelta": 0
  }
}
```

---

## 🧠 Key Design Choices
| Design Aspect | Reason |
|----------------|--------|
| **C# isolated model** | Easier debugging, testability, and DI support. |
| **`certs.json` as seed data** | Keeps project lightweight; no database setup yet. |
| **Clear HTTP responses** | Enables frontend to handle 400/404 gracefully. |
| **Reusable repository layer** | Decouples data access logic from functions. |
| **Comparison algorithm modularity** | Can evolve later with AI (e.g., GPT-assisted similarity scoring). |

---

## 🚀 Future Enhancements
- 🔹 Integrate **AI scoring** to give dynamic similarity recommendations.
- 🔹 Add **n8n email workflow**: user submits email → receives personalized certification path.
- 🔹 Migrate `certs.json` → real **database** (CosmosDB or Azure Table Storage).
- 🔹 Add **logging and telemetry** for comparison usage.

---

### ✅ Summary
The Compare Function is the first dynamic feature of the Cloud Certification Path Visualizer. It combines C# backend logic, JSON-based data, and clear architecture to prepare for frontend integration and AI-driven expansion.

