using System.Net;
using System.Text.Json;
using System.Linq;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Api.Services; // for CertRepository and Certification

namespace Api;

public class CompareFunction
{
    private readonly ILogger<CompareFunction> _log;
    private readonly CertRepository _repo;

    public CompareFunction(ILogger<CompareFunction> log, CertRepository repo)
    {
        _log = log;
        _repo = repo;
    }

    [Function("Compare")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "compare")] HttpRequestData req)
    {
        try
        {
            // Parse query without extra packages
            var q = ParseQuery(req.Url.Query);
            q.TryGetValue("left", out var leftId);
            q.TryGetValue("right", out var rightId);

            if (string.IsNullOrWhiteSpace(leftId) || string.IsNullOrWhiteSpace(rightId))
                return await BadRequest(req, "Query params 'left' and 'right' are required.");

            if (string.Equals(leftId, rightId, StringComparison.OrdinalIgnoreCase))
                return await BadRequest(req, "Left and right must be different certifications.");

            var all = await _repo.GetAllAsync();

            var left  = all.FirstOrDefault(c => string.Equals(c.Id, leftId,  StringComparison.OrdinalIgnoreCase));
            var right = all.FirstOrDefault(c => string.Equals(c.Id, rightId, StringComparison.OrdinalIgnoreCase));

            if (left is null)  return await NotFound(req, $"Certification with id '{leftId}' was not found.");
            if (right is null) return await NotFound(req, $"Certification with id '{rightId}' was not found.");

            var summary = BuildSummary(left, right);

            var result = new ComparisonResult
            {
                Left = left,
                Right = right,
                Summary = summary
            };

            var res = req.CreateResponse(HttpStatusCode.OK);
            // Manual JSON write to avoid WriteAsJsonAsync overload mismatch
            var json = JsonSerializer.Serialize(result, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
            });
            res.Headers.Add("Content-Type", "application/json; charset=utf-8");
            await res.WriteStringAsync(json);
            return res;
        }
        catch (Exception ex)
        {
            _log.LogError(ex, "Compare failed.");
            var err = req.CreateResponse(HttpStatusCode.InternalServerError);
            await err.WriteStringAsync("Compare failed.");
            return err;
        }
    }

    // ---- Helpers ----

    // Minimal query parser (avoids Microsoft.AspNetCore.WebUtilities)
    private static Dictionary<string, string> ParseQuery(string query)
    {
        var dict = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        if (string.IsNullOrEmpty(query)) return dict;
        if (query.StartsWith("?")) query = query[1..];

        foreach (var part in query.Split('&', StringSplitOptions.RemoveEmptyEntries))
        {
            var kv = part.Split('=', 2);
            var k = Uri.UnescapeDataString(kv[0] ?? "");
            var v = kv.Length > 1 ? Uri.UnescapeDataString(kv[1]) : "";
            if (!string.IsNullOrWhiteSpace(k)) dict[k] = v;
        }
        return dict;
    }

    private static ComparisonSummary BuildSummary(Api.Services.Certification left, Api.Services.Certification right)
    {
        static int LevelRank(string? s)
        {
            if (string.IsNullOrWhiteSpace(s)) return 0;
            return s.Trim().ToLowerInvariant() switch
            {
                "fundamentals" or "foundation"                          => 1,
                "associate"                                             => 2,
                "professional" or "expert" or "specialty" or "special" => 3,
                _                                                        => 0
            };
        }

        static double Jaccard(IEnumerable<string>? a, IEnumerable<string>? b)
        {
            var A = new HashSet<string>((a ?? Array.Empty<string>()).Where(s => !string.IsNullOrWhiteSpace(s)),
                                        StringComparer.OrdinalIgnoreCase);
            var B = new HashSet<string>((b ?? Array.Empty<string>()).Where(s => !string.IsNullOrWhiteSpace(s)),
                                        StringComparer.OrdinalIgnoreCase);
            if (A.Count == 0 && B.Count == 0) return 0.0;
            var inter = A.Intersect(B, StringComparer.OrdinalIgnoreCase).Count();
            var union = A.Union(B,   StringComparer.OrdinalIgnoreCase).Count();
            if (union == 0) return 0.0;
            return Math.Round(100.0 * inter / union, 1);
        }

        static int Delta(int? l, int? r) => (l ?? 0) - (r ?? 0);

        return new ComparisonSummary
        {
            // + = Left higher, - = Right higher
            LevelDifference = LevelRank(left.Level) - LevelRank(right.Level),
            RoleOverlap     = Jaccard(left.Role,    right.Role),
            DomainOverlap   = Jaccard(left.Domains, right.Domains),
            // + = Left more expensive/longer
            CostDeltaUsd    = Delta(left.Cost_Usd, right.Cost_Usd),
            DurationDelta   = Delta(left.Duration_Minutes, right.Duration_Minutes)
        };
    }

    // Response model (explicitly use fully-qualified types)
    public class ComparisonResult
    {
        public Api.Services.Certification Left { get; set; } = default!;
        public Api.Services.Certification Right { get; set; } = default!;
        public ComparisonSummary Summary { get; set; } = new();
    }

    public class ComparisonSummary
    {
        public int    LevelDifference { get; set; }
        public double RoleOverlap     { get; set; }
        public double DomainOverlap   { get; set; }
        public int    CostDeltaUsd    { get; set; }
        public int    DurationDelta   { get; set; }
    }

    private static Task<HttpResponseData> BadRequest(HttpRequestData req, string msg) =>
        CreateText(req, HttpStatusCode.BadRequest, msg);
    private static Task<HttpResponseData> NotFound(HttpRequestData req, string msg) =>
        CreateText(req, HttpStatusCode.NotFound, msg);

    private static async Task<HttpResponseData> CreateText(HttpRequestData req, HttpStatusCode code, string msg)
    {
        var r = req.CreateResponse(code);
        await r.WriteStringAsync(msg);
        return r;
    }
}
