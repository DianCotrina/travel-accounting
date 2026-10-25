using Microsoft.EntityFrameworkCore;
using TravelAccounting.Application.Trips;
using TravelAccounting.Domain.Trips;

namespace TravelAccounting.Infrastructure.Data.Repositories;

internal sealed class EfTripRepository(AppDbContext db) : ITripRepository
{
    public async Task<IReadOnlyList<Trip>> ListAsync(CancellationToken cancellationToken)
    {
        return await db.Trips
            .OrderBy(trip => trip.StartDate)
            .ToListAsync(cancellationToken);
    }

    public Task<Trip?> GetAsync(Guid id, CancellationToken cancellationToken)
    {
        return db.Trips
            .SingleOrDefaultAsync(trip => trip.Id == id, cancellationToken);
    }

    public async Task AddAsync(Trip trip, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(trip);

        await db.Trips.AddAsync(trip, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        return db.SaveChangesAsync(cancellationToken);
    }
}

