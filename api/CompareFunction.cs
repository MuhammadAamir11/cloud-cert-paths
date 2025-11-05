using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Api.Services;

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
        var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);
        var leftId  = query.Get("left");
        var rightId = query.Get("right");

        if (string.IsNullOrWhiteSpace(leftId) || string.IsNullOrWhiteSpace(rightId))
        {
            var bad = req.CreateResponse(HttpStatusCode.BadRequest);
            await bad.WriteStringAsync("Query params required: left, right (e.g. /api/compare?left=az-900&right=az-104)");
            return bad;
        }

        var left  = await _repo.FindByIdAsync(leftId);
        var right = await _repo.FindByIdAsync(rightId);

        if (left is null || right is null)
        {
            var nf = req.CreateResponse(HttpStatusCode.NotFound);
            await nf.WriteStringAsync($"Not found: {(left is null ? leftId : rightId)}");
            return nf;
        }

        var result = BuildComparison(left, right);

        var ok = req.CreateResponse(HttpStatusCode.OK);
        ok.Headers.Add("Content-Type", "application/json; charset=utf-8");
        await ok.WriteAsJsonAsync(result);
        return ok;
    }

    private static ComparisonResult BuildComparison(Certification a, Certification b)
    {
        var levelRank = new Dictionary<string,int>(StringComparer.OrdinalIgnoreCase)
        {
            ["Fundamental"] = 1, ["Associate"] = 2, ["Professional"] = 3, ["Expert"] = 3
        };
        int Rank(string? lvl) => (lvl != null && levelRank.TryGetValue(lvl, out var r)) ? r : 0;

        static double Overlap(IEnumerable<string> x, IEnumerable<string> y)
        {
            var xs = x.Select(s => s.Trim().ToLowerInvariant()).Where(s => !string.IsNullOrWhiteSpace(s)).ToHashSet();
            var ys = y.Select(s => s.Trim().ToLowerInvariant()).Where(s => !string.IsNullOrWhiteSpace(s)).ToHashSet();
            if (xs.Count == 0 && ys.Count == 0) return 1.0;
            var inter = xs.Intersect(ys).Count();
            var union = xs.Union(ys).Count();
            return union == 0 ? 0 : (double)inter / union;
        }

        return new ComparisonResult
        {
            Left  = a,
            Right = b,
            Summary = new ComparisonSummary
            {
                LevelDifference = Rank(a.Level) - Rank(b.Level),
                RoleOverlap     = Math.Round(Overlap(a.Role, b.Role) * 100, 1),
                DomainOverlap   = Math.Round(Overlap(a.Domains, b.Domains) * 100, 1),
                CostDeltaUsd    = (a.Cost_Usd ?? 0) - (b.Cost_Usd ?? 0),
                DurationDelta   = (a.Duration_Minutes ?? 0) - (b.Duration_Minutes ?? 0)
            }
        };
    }

    public class ComparisonResult
    {
        public Certification Left { get; set; } = default!;
        public Certification Right { get; set; } = default!;
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
}
