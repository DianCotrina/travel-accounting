using System.ComponentModel.DataAnnotations;

namespace TravelAccounting.Api.ExchangeRates;

public sealed class UpsertExchangeRateApiRequest
{
    public DateOnly Date { get; init; }

    [Required]
    public string FromCurrency { get; init; } = string.Empty;

    [Required]
    public string ToCurrency { get; init; } = string.Empty;

    [Range(typeof(decimal), "0.0000001", "9999999")]
    public decimal Rate { get; init; }
}
