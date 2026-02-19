namespace TravelAccounting.Application.Expenses;

public sealed record ExpenseDto(
    Guid Id,
    Guid TripId,
    string Category,
    decimal Amount,
    string Currency,
    decimal? HomeAmount,
    string? HomeCurrency,
    decimal? ExchangeRateUsed,
    DateTimeOffset OccurredAtUtc,
    string Notes);
