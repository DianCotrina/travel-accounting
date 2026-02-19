using System.Collections.Concurrent;
using TravelAccounting.Application.Expenses;
using TravelAccounting.Domain.Expenses;

namespace TravelAccounting.Infrastructure.Expenses;

internal sealed class InMemoryExpenseRepository : IExpenseRepository
{
    private readonly ConcurrentDictionary<Guid, Expense> _expenses = new();

    public Task<IReadOnlyList<Expense>> ListByTripAsync(Guid tripId, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        IReadOnlyList<Expense> expenses = _expenses.Values
            .Where(expense => expense.TripId == tripId)
            .OrderBy(expense => expense.OccurredAtUtc)
            .ToArray();
        return Task.FromResult(expenses);
    }

    public Task<Expense?> GetAsync(Guid id, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        _expenses.TryGetValue(id, out var expense);
        return Task.FromResult(expense);
    }

    public Task AddAsync(Expense expense, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(expense);
        cancellationToken.ThrowIfCancellationRequested();

        if (!_expenses.TryAdd(expense.Id, expense))
        {
            throw new InvalidOperationException($"Expense with id {expense.Id} already exists.");
        }

        return Task.CompletedTask;
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        var removed = _expenses.TryRemove(id, out _);
        return Task.FromResult(removed);
    }
}
