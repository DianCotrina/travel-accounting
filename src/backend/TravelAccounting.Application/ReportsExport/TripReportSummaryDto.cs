namespace TravelAccounting.Application.ReportsExport;

public sealed record TripReportSummaryDto(
    Guid TripId,
    string LocalCurrency,
    string HomeCurrency,
    DateOnly? FromDate,
    DateOnly? ToDate,
    string? Category,
    int ExpenseCount,
    decimal TotalLocalAmount,
    decimal TotalHomeAmount,
    IReadOnlyList<TripReportCategoryTotalDto> CategoryTotals);

public sealed record TripReportCategoryTotalDto(
    string Category,
    int ExpenseCount,
    decimal TotalLocalAmount,
    decimal TotalHomeAmount);

public sealed record TripReportCsvResultDto(
    string FileName,
    string Content);
