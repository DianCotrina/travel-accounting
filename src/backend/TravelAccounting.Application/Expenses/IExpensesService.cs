namespace TravelAccounting.Application.Expenses;

public interface IExpensesService
{
    Task<IReadOnlyList<ExpenseDto>> ListByTripAsync(Guid tripId, CancellationToken cancellationToken);
    Task<ExpenseDto?> GetAsync(Guid id, CancellationToken cancellationToken);
    Task<ExpenseDto?> CreateAsync(CreateExpenseRequest request, CancellationToken cancellationToken);
    Task<ExpenseDto?> UpdateAsync(Guid id, UpdateExpenseRequest request, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}
