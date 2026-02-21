using TravelAccounting.Application.Trips;
using TravelAccounting.Application.Auth;
using TravelAccounting.Domain.Common;

namespace TravelAccounting.Application.ExchangeRates;

internal sealed class ExchangeRatesService(
    IExchangeRateRepository exchangeRateRepository,
    ITripRepository tripRepository,
    ICurrentUserContext currentUserContext) : IExchangeRatesService
{
    public async Task<IReadOnlyList<ExchangeRateDto>> ListByTripAsync(Guid tripId, CancellationToken cancellationToken)
    {
        var trip = await tripRepository.GetAsync(tripId, cancellationToken);
        if (trip is null || trip.OwnerUserId != currentUserContext.UserId)
        {
            return [];
        }

        return await exchangeRateRepository.ListByTripAsync(tripId, cancellationToken);
    }

    public async Task<ExchangeRateDto?> UpsertAsync(
        Guid tripId,
        UpsertExchangeRateRequest request,
        CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(request);

        var trip = await tripRepository.GetAsync(tripId, cancellationToken);
        if (trip is null || trip.OwnerUserId != currentUserContext.UserId)
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
