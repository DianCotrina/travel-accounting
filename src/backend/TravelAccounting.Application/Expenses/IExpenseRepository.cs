using TravelAccounting.Domain.Expenses;

namespace TravelAccounting.Application.Expenses;

public interface IExpenseRepository
{
    Task<IReadOnlyList<Expense>> ListByTripAsync(Guid tripId, CancellationToken cancellationToken);
    Task<Expense?> GetAsync(Guid id, CancellationToken cancellationToken);
    Task AddAsync(Expense expense, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
