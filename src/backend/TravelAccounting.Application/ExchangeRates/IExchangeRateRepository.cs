namespace TravelAccounting.Application.ExchangeRates;

public interface IExchangeRateRepository
{
    Task<IReadOnlyList<ExchangeRateDto>> ListByTripAsync(Guid tripId, CancellationToken cancellationToken);
    Task<ExchangeRateDto?> GetAsync(
        Guid tripId,
        DateOnly date,
        string fromCurrency,
        string toCurrency,
        CancellationToken cancellationToken);
    Task UpsertAsync(ExchangeRateDto rate, CancellationToken cancellationToken);
}
