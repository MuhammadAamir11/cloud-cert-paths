public class Certification
{
    public string Id { get; set; } = "";
    public string Provider { get; set; } = "";
    public string Code { get; set; } = "";
    public string Name { get; set; } = "";
    public string Level { get; set; } = "";
    public List<string>? Role { get; set; }
    public List<string>? Domains { get; set; }
    public List<string>? Prerequisites { get; set; }
    public int? Duration_Minutes { get; set; }
    public int? Cost_Usd { get; set; }
    public int? Validity_Years { get; set; }
    public string? Official_Url { get; set; }
}
