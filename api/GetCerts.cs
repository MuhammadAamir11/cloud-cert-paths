using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Api.Services;

namespace Api;

public class GetCerts
{
    private readonly ILogger<GetCerts> _logger;
    private readonly CertRepository _repo;

    public GetCerts(ILogger<GetCerts> logger, CertRepository repo)
    {
        _logger = logger;
        _repo = repo;
    }

    [Function("GetCerts")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "certifications")] HttpRequestData req)
    {
        try
        {
            var certs = await _repo.GetAllAsync();
            var res = req.CreateResponse(HttpStatusCode.OK);
            await res.WriteAsJsonAsync(certs);
            return res;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to read certs.json");
            var err = req.CreateResponse(HttpStatusCode.InternalServerError);
            await err.WriteStringAsync("Failed to read certs.json");
            return err;
        }
    }
}
