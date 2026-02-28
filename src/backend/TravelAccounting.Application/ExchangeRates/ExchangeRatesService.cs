using System.Security.Cryptography;
using System.Text;
using TravelAccounting.Application.Audit;
using TravelAccounting.Application.Trips;
using TravelAccounting.Application.Auth;
using TravelAccounting.Domain.Audit;
using TravelAccounting.Domain.Common;

namespace TravelAccounting.Application.ExchangeRates;

internal sealed class ExchangeRatesService(
    IExchangeRateRepository exchangeRateRepository,
    ITripRepository tripRepository,
    ICurrentUserContext currentUserContext,
    IAuditService auditService) : IExchangeRatesService
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

        var existing = await exchangeRateRepository.GetAsync(
            tripId,
            rate.Date,
            rate.FromCurrency,
            rate.ToCurrency,
            cancellationToken);

        await exchangeRateRepository.UpsertAsync(rate, cancellationToken);

        await auditService.LogAsync(
            currentUserContext.UserId,
            existing is null ? AuditAction.Create : AuditAction.Update,
            "ExchangeRate",
            BuildExchangeRateEntityId(rate),
            existing is null ? null : SnapshotExchangeRate(existing),
            SnapshotExchangeRate(rate),
            cancellationToken);

        return rate;
    }

    private static object SnapshotExchangeRate(ExchangeRateDto rate)
    {
        return new
        {
            rate.TripId,
            rate.Date,
            rate.FromCurrency,
            rate.ToCurrency,
            rate.Rate,
        };
    }

    private static Guid BuildExchangeRateEntityId(ExchangeRateDto rate)
    {
        var key = $"{rate.TripId:N}|{rate.Date:yyyy-MM-dd}|{rate.FromCurrency}|{rate.ToCurrency}";
        var hash = SHA256.HashData(Encoding.UTF8.GetBytes(key));
        var guidBytes = hash[..16];
        return new Guid(guidBytes);
    }
}
