namespace TravelAccounting.Application.ExchangeRates;

public interface IExchangeRateProvider
{
    Task<decimal?> GetRateAsync(
        DateOnly date,
        string fromCurrency,
        string toCurrency,
        CancellationToken cancellationToken);
}
