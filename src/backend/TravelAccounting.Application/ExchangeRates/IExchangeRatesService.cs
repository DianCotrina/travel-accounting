namespace TravelAccounting.Application.ExchangeRates;

public interface IExchangeRatesService
{
    Task<IReadOnlyList<ExchangeRateDto>> ListByTripAsync(Guid tripId, CancellationToken cancellationToken);
    Task<ExchangeRateDto?> UpsertAsync(
        Guid tripId,
        UpsertExchangeRateRequest request,
        CancellationToken cancellationToken);
}
