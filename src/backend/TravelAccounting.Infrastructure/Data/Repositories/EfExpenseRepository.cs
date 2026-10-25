using Microsoft.EntityFrameworkCore;
using TravelAccounting.Application.Expenses;
using TravelAccounting.Domain.Expenses;

namespace TravelAccounting.Infrastructure.Data.Repositories;

internal sealed class EfExpenseRepository(AppDbContext db) : IExpenseRepository
{
    public async Task<IReadOnlyList<Expense>> ListByTripAsync(Guid tripId, CancellationToken cancellationToken)
    {
        return await db.Expenses
            .Where(expense => expense.TripId == tripId)
            .OrderBy(expense => expense.OccurredAtUtc)
            .ToListAsync(cancellationToken);
    }

    public Task<Expense?> GetAsync(Guid id, CancellationToken cancellationToken)
    {
        return db.Expenses
            .SingleOrDefaultAsync(expense => expense.Id == id, cancellationToken);
    }

    public async Task AddAsync(Expense expense, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(expense);

        await db.Expenses.AddAsync(expense, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var expense = await GetAsync(id, cancellationToken);
        if (expense is null)
        {
            return false;
        }

        db.Expenses.Remove(expense);
        await db.SaveChangesAsync(cancellationToken);
        return true;
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        return db.SaveChangesAsync(cancellationToken);
    }
}

