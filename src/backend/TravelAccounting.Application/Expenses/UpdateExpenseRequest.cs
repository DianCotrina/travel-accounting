namespace TravelAccounting.Application.Expenses;

public sealed record UpdateExpenseRequest(
    string Category,
    decimal Amount,
    string Currency,
    DateTimeOffset OccurredAtUtc,
    string Notes);
