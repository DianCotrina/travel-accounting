using TravelAccounting.Domain.Common;
using TravelAccounting.Domain.Trips;
using TravelAccounting.Application.Auth;

namespace TravelAccounting.Application.Trips;

internal sealed class TripsService(
    ITripRepository tripRepository,
    ICurrentUserContext currentUserContext) : ITripsService
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

        trip.Update(
            request.Name,
            request.DestinationCountry,
            new Currency(request.HomeCurrency),
            new Currency(request.LocalCurrency),
            new TravelDate(request.StartDate),
            new TravelDate(request.EndDate));
        await tripRepository.SaveChangesAsync(cancellationToken);

        return MapToDto(trip);
    }

    public async Task<TripDto?> ArchiveAsync(Guid id, CancellationToken cancellationToken)
    {
        var trip = await tripRepository.GetAsync(id, cancellationToken);
        if (trip is null || trip.OwnerUserId != currentUserContext.UserId)
        {
            return null;
        }

        trip.Archive();
        await tripRepository.SaveChangesAsync(cancellationToken);
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
}
