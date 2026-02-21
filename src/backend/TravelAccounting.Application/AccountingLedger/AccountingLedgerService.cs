using TravelAccounting.Application.Expenses;
using TravelAccounting.Application.Trips;

namespace TravelAccounting.Application.AccountingLedger;

internal sealed class AccountingLedgerService(
    ITripsService tripsService,
    IExpensesService expensesService) : IAccountingLedgerService
{
    public async Task<AccountingLedgerSummaryDto?> GetTripSummaryAsync(
        Guid tripId,
        CancellationToken cancellationToken)
    {
        var trip = await tripsService.GetAsync(tripId, cancellationToken);
        if (trip is null)
        {
            return null;
        }

        var expenses = await expensesService.ListByTripAsync(tripId, cancellationToken);
        var totalLocal = RoundCurrency(expenses.Sum(expense => expense.Amount));
        var convertedHome = RoundCurrency(expenses.Sum(expense => expense.HomeAmount ?? 0m));
        var convertedCount = expenses.Count(expense => expense.HomeAmount.HasValue);
        var missingCount = expenses.Count - convertedCount;

        var byCategory = expenses
            .GroupBy(expense => expense.Category)
            .Select(group =>
            {
                var categoryConvertedCount = group.Count(expense => expense.HomeAmount.HasValue);
                return new LedgerCategoryTotalDto(
                    group.Key,
                    RoundCurrency(group.Sum(expense => expense.Amount)),
                    RoundCurrency(group.Sum(expense => expense.HomeAmount ?? 0m)),
                    group.Count(),
                    categoryConvertedCount,
                    group.Count() - categoryConvertedCount);
            })
            .OrderBy(item => item.Category)
            .ToArray();

        var byDay = expenses
            .GroupBy(expense => DateOnly.FromDateTime(expense.OccurredAtUtc.UtcDateTime))
            .Select(group =>
            {
                var dayConvertedCount = group.Count(expense => expense.HomeAmount.HasValue);
                return new LedgerDayTotalDto(
                    group.Key,
                    RoundCurrency(group.Sum(expense => expense.Amount)),
                    RoundCurrency(group.Sum(expense => expense.HomeAmount ?? 0m)),
                    group.Count(),
                    dayConvertedCount,
                    group.Count() - dayConvertedCount);
            })
            .OrderBy(item => item.Date)
            .ToArray();

        return new AccountingLedgerSummaryDto(
            trip.Id,
            trip.LocalCurrency,
            trip.HomeCurrency,
            totalLocal,
            convertedHome,
            expenses.Count,
            convertedCount,
            missingCount,
            byCategory,
            byDay);
    }

    private static decimal RoundCurrency(decimal amount)
    {
        return decimal.Round(amount, 2, MidpointRounding.AwayFromZero);
    }
}
