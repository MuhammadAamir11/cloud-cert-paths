using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api;

public class GetCerts
{
    private readonly ILogger<GetCerts> _logger;

    public GetCerts(ILogger<GetCerts> logger)
    {
        _logger = logger;
    }

    [Function("GetCerts")]
    public IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req)
    {
        _logger.LogInformation("Returning list of certifications...");

        var certs = new[]
        {
            new { Id = 1, Name = "AZ-900: Azure Fundamentals" },
            new { Id = 2, Name = "AZ-104: Azure Administrator" },
            new { Id = 3, Name = "AZ-204: Azure Developer" }
        };

        return new OkObjectResult(certs);
    }
}
