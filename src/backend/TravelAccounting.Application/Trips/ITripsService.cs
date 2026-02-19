namespace TravelAccounting.Application.Trips;

public interface ITripsService
{
    Task<IReadOnlyList<TripDto>> ListAsync(CancellationToken cancellationToken);
    Task<TripDto?> GetAsync(Guid id, CancellationToken cancellationToken);
    Task<TripDto> CreateAsync(CreateTripRequest request, CancellationToken cancellationToken);
    Task<TripDto?> UpdateAsync(Guid id, UpdateTripRequest request, CancellationToken cancellationToken);
    Task<TripDto?> ArchiveAsync(Guid id, CancellationToken cancellationToken);
}
