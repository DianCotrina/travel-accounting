using System.Collections.Concurrent;
using TravelAccounting.Application.Trips;
using TravelAccounting.Domain.Trips;

namespace TravelAccounting.Infrastructure.Trips;

internal sealed class InMemoryTripRepository : ITripRepository
{
    private readonly ConcurrentDictionary<Guid, Trip> _trips = new();

    public Task<IReadOnlyList<Trip>> ListAsync(CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        IReadOnlyList<Trip> values = _trips.Values.OrderBy(t => t.StartDate.Value).ToArray();
        return Task.FromResult(values);
    }

    public Task<Trip?> GetAsync(Guid id, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        _trips.TryGetValue(id, out var trip);
        return Task.FromResult(trip);
    }

    public Task AddAsync(Trip trip, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(trip);
        cancellationToken.ThrowIfCancellationRequested();

        if (!_trips.TryAdd(trip.Id, trip))
        {
            throw new InvalidOperationException($"Trip with id {trip.Id} already exists.");
        }

        return Task.CompletedTask;
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        return Task.CompletedTask;
    }
}
