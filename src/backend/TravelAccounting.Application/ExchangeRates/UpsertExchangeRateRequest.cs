namespace TravelAccounting.Application.ExchangeRates;

public sealed record UpsertExchangeRateRequest(
    DateOnly Date,
    string FromCurrency,
    string ToCurrency,
    decimal Rate);
