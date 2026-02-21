using System.Globalization;
using System.Text;
using TravelAccounting.Application.Expenses;
using TravelAccounting.Application.Trips;

namespace TravelAccounting.Application.ReportsExport;

internal sealed class ReportsExportService(
    ITripsService tripsService,
    IExpensesService expensesService) : IReportsExportService
{
    public async Task<TripReportSummaryDto?> GetSummaryAsync(
        Guid tripId,
        DateOnly? fromDate,
        DateOnly? toDate,
        string? category,
        CancellationToken cancellationToken)
    {
        var trip = await tripsService.GetAsync(tripId, cancellationToken);
        if (trip is null)
        {
            return null;
        }

        var filteredExpenses = await GetFilteredExpenses(
            tripId,
            fromDate,
            toDate,
            category,
            cancellationToken);

        var categoryTotals = filteredExpenses
            .GroupBy(expense => expense.Category)
            .Select(group => new TripReportCategoryTotalDto(
                group.Key,
                group.Count(),
                RoundCurrency(group.Sum(expense => expense.Amount)),
                RoundCurrency(group.Sum(expense => expense.HomeAmount ?? 0m))))
            .OrderBy(item => item.Category)
            .ToArray();

        return new TripReportSummaryDto(
            tripId,
            trip.LocalCurrency,
            trip.HomeCurrency,
            fromDate,
            toDate,
            NormalizeCategory(category),
            filteredExpenses.Count,
            RoundCurrency(filteredExpenses.Sum(expense => expense.Amount)),
            RoundCurrency(filteredExpenses.Sum(expense => expense.HomeAmount ?? 0m)),
            categoryTotals);
    }

    public async Task<TripReportCsvResultDto?> ExportCsvAsync(
        Guid tripId,
        DateOnly? fromDate,
        DateOnly? toDate,
        string? category,
        CancellationToken cancellationToken)
    {
        var trip = await tripsService.GetAsync(tripId, cancellationToken);
        if (trip is null)
        {
            return null;
        }

        var filteredExpenses = await GetFilteredExpenses(
            tripId,
            fromDate,
            toDate,
            category,
            cancellationToken);

        var csvBuilder = new StringBuilder();
        csvBuilder.AppendLine(
            "TripId,OccurredAtUtc,Category,Notes,Amount,Currency,HomeAmount,HomeCurrency,ExchangeRateUsed");

        foreach (var expense in filteredExpenses.OrderBy(expense => expense.OccurredAtUtc))
        {
            csvBuilder
                .Append(tripId.ToString())
                .Append(',')
                .Append(expense.OccurredAtUtc.ToString("O", CultureInfo.InvariantCulture))
                .Append(',')
                .Append(EscapeCsv(expense.Category))
                .Append(',')
                .Append(EscapeCsv(expense.Notes))
                .Append(',')
                .Append(expense.Amount.ToString(CultureInfo.InvariantCulture))
                .Append(',')
                .Append(expense.Currency)
                .Append(',')
                .Append(expense.HomeAmount?.ToString(CultureInfo.InvariantCulture) ?? string.Empty)
                .Append(',')
                .Append(expense.HomeCurrency ?? string.Empty)
                .Append(',')
                .Append(expense.ExchangeRateUsed?.ToString(CultureInfo.InvariantCulture) ?? string.Empty)
                .AppendLine();
        }

        var categoryLabel = string.IsNullOrWhiteSpace(category)
            ? "all"
            : NormalizeCategory(category)!.ToLowerInvariant();
        var fromLabel = fromDate?.ToString("yyyyMMdd", CultureInfo.InvariantCulture) ?? "start";
        var toLabel = toDate?.ToString("yyyyMMdd", CultureInfo.InvariantCulture) ?? "end";
        var fileName = $"trip-report-{tripId}-{fromLabel}-{toLabel}-{categoryLabel}.csv";

        return new TripReportCsvResultDto(fileName, csvBuilder.ToString());
    }

    private async Task<IReadOnlyList<ExpenseDto>> GetFilteredExpenses(
        Guid tripId,
        DateOnly? fromDate,
        DateOnly? toDate,
        string? category,
        CancellationToken cancellationToken)
    {
        var expenses = await expensesService.ListByTripAsync(tripId, cancellationToken);
        var normalizedCategory = NormalizeCategory(category);

        return expenses
            .Where(expense => MatchesFilters(expense, fromDate, toDate, normalizedCategory))
            .ToArray();
    }

    private static bool MatchesFilters(
        ExpenseDto expense,
        DateOnly? fromDate,
        DateOnly? toDate,
        string? category)
    {
        var expenseDate = DateOnly.FromDateTime(expense.OccurredAtUtc.UtcDateTime);
        if (fromDate.HasValue && expenseDate < fromDate.Value)
        {
            return false;
        }

        if (toDate.HasValue && expenseDate > toDate.Value)
        {
            return false;
        }

        if (!string.IsNullOrWhiteSpace(category) &&
            !expense.Category.Equals(category, StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        return true;
    }

    private static string? NormalizeCategory(string? category)
    {
        return string.IsNullOrWhiteSpace(category) ? null : category.Trim();
    }

    private static string EscapeCsv(string value)
    {
        var escaped = value.Replace("\"", "\"\"", StringComparison.Ordinal);
        return $"\"{escaped}\"";
    }

    private static decimal RoundCurrency(decimal amount)
    {
        return decimal.Round(amount, 2, MidpointRounding.AwayFromZero);
    }
}
