namespace TravelAccounting.Application.Expenses;

public sealed record CreateExpenseRequest(
    Guid TripId,
    string Category,
    decimal Amount,
    string Currency,
    DateTimeOffset OccurredAtUtc,
    string Notes);
