namespace TravelAccounting.Application.ExchangeRates;

public sealed record ExchangeRateDto(
    Guid TripId,
    DateOnly Date,
    string FromCurrency,
    string ToCurrency,
    decimal Rate);
