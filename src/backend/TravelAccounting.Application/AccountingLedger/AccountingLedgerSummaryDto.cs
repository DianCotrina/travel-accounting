namespace TravelAccounting.Application.AccountingLedger;

public sealed record AccountingLedgerSummaryDto(
    Guid TripId,
    string LocalCurrency,
    string HomeCurrency,
    decimal TotalLocalAmount,
    decimal ConvertedHomeAmount,
    int ExpenseCount,
    int ConvertedExpenseCount,
    int MissingHomeConversionCount,
    IReadOnlyList<LedgerCategoryTotalDto> CategoryTotals,
    IReadOnlyList<LedgerDayTotalDto> DayTotals);

public sealed record LedgerCategoryTotalDto(
    string Category,
    decimal TotalLocalAmount,
    decimal ConvertedHomeAmount,
    int ExpenseCount,
    int ConvertedExpenseCount,
    int MissingHomeConversionCount);

public sealed record LedgerDayTotalDto(
    DateOnly Date,
    decimal TotalLocalAmount,
    decimal ConvertedHomeAmount,
    int ExpenseCount,
    int ConvertedExpenseCount,
    int MissingHomeConversionCount);
