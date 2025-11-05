using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace api;

public class GetCerts
{
    private readonly ILogger<GetCerts> _logger;

    public GetCerts(ILogger<GetCerts> logger)
    {
        _logger = logger;
    }

    // Define a simple model for the JSON structure
    public class Cert
    {
        public int Id { get; set; }
        public string? Provider { get; set; }
        public string? Name { get; set; }
    }

    [Function("GetCerts")]
    public IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req)
    {
        _logger.LogInformation("Returning list of certifications...");

        try
        {
            // Resolve file path inside the Functions app directory
            var path = Path.Combine(AppContext.BaseDirectory, "certs.json");

            if (!File.Exists(path))
            {
                _logger.LogWarning($"certs.json not found at: {path}");
                return new NotFoundObjectResult(new { error = "certs.json file missing" });
            }

            // Read and parse the JSON file
            var json = File.ReadAllText(path);
            var certs = JsonSerializer.Deserialize<List<Cert>>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            // If parsing failed
            if (certs == null || certs.Count == 0)
                return new OkObjectResult(Array.Empty<Cert>());

            // Return the data as JSON
            return new OkObjectResult(certs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error reading certs.json");
            return new ObjectResult(new { error = ex.Message }) { StatusCode = 500 };
        }
    }
}
