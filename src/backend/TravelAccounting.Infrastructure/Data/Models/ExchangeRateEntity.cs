namespace TravelAccounting.Infrastructure.Data.Models;

public sealed class ExchangeRateEntity
{
    public Guid TripId { get; set; }
    public DateOnly Date { get; set; }
    public string FromCurrency { get; set; } = string.Empty;
    public string ToCurrency { get; set; } = string.Empty;
    public decimal Rate { get; set; }
}

