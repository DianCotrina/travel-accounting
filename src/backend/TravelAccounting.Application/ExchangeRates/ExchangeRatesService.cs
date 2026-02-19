using TravelAccounting.Application.Trips;
using TravelAccounting.Domain.Common;

namespace TravelAccounting.Application.ExchangeRates;

internal sealed class ExchangeRatesService(
    IExchangeRateRepository exchangeRateRepository,
    ITripRepository tripRepository) : IExchangeRatesService
{
    public Task<IReadOnlyList<ExchangeRateDto>> ListByTripAsync(Guid tripId, CancellationToken cancellationToken)
    {
        return exchangeRateRepository.ListByTripAsync(tripId, cancellationToken);
    }

    public async Task<ExchangeRateDto?> UpsertAsync(
        Guid tripId,
        UpsertExchangeRateRequest request,
        CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(request);

        var trip = await tripRepository.GetAsync(tripId, cancellationToken);
        if (trip is null)
        {
            return null;
        }

        var rate = new ExchangeRateDto(
            tripId,
            request.Date,
            new Currency(request.FromCurrency).Code,
            new Currency(request.ToCurrency).Code,
            request.Rate);

        await exchangeRateRepository.UpsertAsync(rate, cancellationToken);
        return rate;
    }
}
