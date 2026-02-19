using TravelAccounting.Domain.Trips;

namespace TravelAccounting.Application.Trips;

public interface ITripRepository
{
    Task<IReadOnlyList<Trip>> ListAsync(CancellationToken cancellationToken);
    Task<Trip?> GetAsync(Guid id, CancellationToken cancellationToken);
    Task AddAsync(Trip trip, CancellationToken cancellationToken);
}
