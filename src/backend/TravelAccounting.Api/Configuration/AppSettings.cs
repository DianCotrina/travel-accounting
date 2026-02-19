using System.ComponentModel.DataAnnotations;

namespace TravelAccounting.Api.Configuration;

public sealed class AppSettings
{
    public const string SectionName = "App";

    [Required]
    [RegularExpression("^[A-Z]{3}$")]
    public string HomeCurrency { get; init; } = "USD";

    [MinLength(1)]
    public IReadOnlyList<string> SupportedCurrencies { get; init; } = ["USD", "ARS"];
}
