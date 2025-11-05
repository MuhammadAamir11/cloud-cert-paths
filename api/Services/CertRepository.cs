using System.Text.Json;

namespace Api.Services;

public class CertRepository
{
    private readonly string _path;
    private List<Certification>? _cache;

    public CertRepository()
    {
        // The Functions host runs from the build output directory.
       // We copied certs.json to: <output>/data/certs.json
      var baseDir = AppContext.BaseDirectory;
       _path = Path.Combine(baseDir, "data", "certs.json");
    }

    public async Task<List<Certification>> GetAllAsync()
    {
        if (_cache is not null) return _cache;

        if (!File.Exists(_path))
            throw new FileNotFoundException($"certs.json not found at {_path}");

        var json = await File.ReadAllTextAsync(_path);
        var certs = JsonSerializer.Deserialize<List<Certification>>(json, new JsonSerializerOptions {
            PropertyNameCaseInsensitive = true
        }) ?? new List<Certification>();

        _cache = certs;
        return certs;
    }

    public async Task<Certification?> FindByIdAsync(string id)
    {
        var all = await GetAllAsync();
        return all.FirstOrDefault(c => string.Equals(c.Id, id, StringComparison.OrdinalIgnoreCase));
    }
}

public class Certification
{
    public string Id { get; set; } = "";
    public string Provider { get; set; } = "";
    public string Code { get; set; } = "";
    public string Name { get; set; } = "";
    public string Level { get; set; } = "";
    public List<string> Role { get; set; } = new();
    public List<string> Domains { get; set; } = new();
    public List<string> Prerequisites { get; set; } = new();
    public int? Duration_Minutes { get; set; }
    public int? Cost_Usd { get; set; }
    public int? Validity_Years { get; set; }
    public string Official_Url { get; set; } = "";
}
