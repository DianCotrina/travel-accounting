using TravelAccounting.Domain.Common;
using TravelAccounting.Domain.Trips;
using TravelAccounting.Application.Auth;
using TravelAccounting.Application.Audit;
using TravelAccounting.Domain.Audit;

namespace TravelAccounting.Application.Trips;

internal sealed class TripsService(
    ITripRepository tripRepository,
    ICurrentUserContext currentUserContext,
    IAuditService auditService) : ITripsService
{
    public async Task<IReadOnlyList<TripDto>> ListAsync(CancellationToken cancellationToken)
    {
        var currentUserId = currentUserContext.UserId;
        var trips = await tripRepository.ListAsync(cancellationToken);
        return trips
            .Where(trip => trip.OwnerUserId == currentUserId)
            .Select(MapToDto)
            .ToArray();
    }

    public async Task<TripDto?> GetAsync(Guid id, CancellationToken cancellationToken)
    {
        var currentUserId = currentUserContext.UserId;
        var trip = await tripRepository.GetAsync(id, cancellationToken);
        return trip is null || trip.OwnerUserId != currentUserId ? null : MapToDto(trip);
    }

    public async Task<TripDto> CreateAsync(CreateTripRequest request, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(request);

        var trip = new Trip(
            Guid.NewGuid(),
            currentUserContext.UserId,
            request.Name,
            request.DestinationCountry,
            new Currency(request.HomeCurrency),
            new Currency(request.LocalCurrency),
            new TravelDate(request.StartDate),
            new TravelDate(request.EndDate));

        await tripRepository.AddAsync(trip, cancellationToken);
        await auditService.LogAsync(
            currentUserContext.UserId,
            AuditAction.Create,
            "Trip",
            trip.Id,
            before: null,
            after: SnapshotTrip(trip),
            cancellationToken);
        return MapToDto(trip);
    }

    public async Task<TripDto?> UpdateAsync(Guid id, UpdateTripRequest request, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(request);

        var trip = await tripRepository.GetAsync(id, cancellationToken);
        if (trip is null || trip.OwnerUserId != currentUserContext.UserId)
        {
            return null;
        }

        var before = SnapshotTrip(trip);
        trip.Update(
            request.Name,
            request.DestinationCountry,
            new Currency(request.HomeCurrency),
            new Currency(request.LocalCurrency),
            new TravelDate(request.StartDate),
            new TravelDate(request.EndDate));
        await tripRepository.SaveChangesAsync(cancellationToken);

        await auditService.LogAsync(
            currentUserContext.UserId,
            AuditAction.Update,
            "Trip",
            trip.Id,
            before,
            SnapshotTrip(trip),
            cancellationToken);

        return MapToDto(trip);
    }

    public async Task<TripDto?> ArchiveAsync(Guid id, CancellationToken cancellationToken)
    {
        var trip = await tripRepository.GetAsync(id, cancellationToken);
        if (trip is null || trip.OwnerUserId != currentUserContext.UserId)
        {
            return null;
        }

        var before = SnapshotTrip(trip);
        trip.Archive();
        await tripRepository.SaveChangesAsync(cancellationToken);

        await auditService.LogAsync(
            currentUserContext.UserId,
            AuditAction.Update,
            "Trip",
            trip.Id,
            before,
            SnapshotTrip(trip),
            cancellationToken);

        return MapToDto(trip);
    }

    private static TripDto MapToDto(Trip trip)
    {
        return new TripDto(
            trip.Id,
            trip.Name,
            trip.DestinationCountry,
            trip.HomeCurrency.Code,
            trip.LocalCurrency.Code,
            trip.StartDate.Value,
            trip.EndDate.Value,
            trip.Status.ToString());
    }

    private static object SnapshotTrip(Trip trip)
    {
        return new
        {
            trip.Id,
            trip.Name,
            trip.OwnerUserId,
            trip.DestinationCountry,
            HomeCurrency = trip.HomeCurrency.Code,
            LocalCurrency = trip.LocalCurrency.Code,
            StartDate = trip.StartDate.Value,
            EndDate = trip.EndDate.Value,
            Status = trip.Status.ToString(),
        };
    }
}
