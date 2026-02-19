using TravelAccounting.Application.Trips;
using TravelAccounting.Application.ExchangeRates;
using TravelAccounting.Domain.Common;
using TravelAccounting.Domain.Expenses;

namespace TravelAccounting.Application.Expenses;

internal sealed class ExpensesService(
    IExpenseRepository expenseRepository,
    ITripRepository tripRepository,
    IExchangeRateRepository exchangeRateRepository,
    IExchangeRateProvider exchangeRateProvider) : IExpensesService
{
    public async Task<IReadOnlyList<ExpenseDto>> ListByTripAsync(Guid tripId, CancellationToken cancellationToken)
    {
        var trip = await tripRepository.GetAsync(tripId, cancellationToken);
        if (trip is null)
        {
            return [];
        }

        var expenses = await expenseRepository.ListByTripAsync(tripId, cancellationToken);
        return await MapListToDto(expenses, trip, cancellationToken);
    }

    public async Task<ExpenseDto?> GetAsync(Guid id, CancellationToken cancellationToken)
    {
        var expense = await expenseRepository.GetAsync(id, cancellationToken);
        if (expense is null)
        {
            return null;
        }

        var trip = await tripRepository.GetAsync(expense.TripId, cancellationToken);
        if (trip is null)
        {
            return null;
        }

        return await MapToDto(expense, trip, cancellationToken);
    }

    public async Task<ExpenseDto?> CreateAsync(CreateExpenseRequest request, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(request);

        var trip = await tripRepository.GetAsync(request.TripId, cancellationToken);
        if (trip is null)
        {
            return null;
        }

        if (!Enum.TryParse<ExpenseCategory>(request.Category, true, out var category))
        {
            throw new ArgumentException("Invalid expense category.", nameof(request));
        }

        var expense = new Expense(
            Guid.NewGuid(),
            request.TripId,
            category,
            new Money(request.Amount, new Currency(request.Currency)),
            request.OccurredAtUtc,
            request.Notes);

        await expenseRepository.AddAsync(expense, cancellationToken);
        return await MapToDto(expense, trip, cancellationToken);
    }

    public async Task<ExpenseDto?> UpdateAsync(Guid id, UpdateExpenseRequest request, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(request);

        var expense = await expenseRepository.GetAsync(id, cancellationToken);
        if (expense is null)
        {
            return null;
        }

        if (!Enum.TryParse<ExpenseCategory>(request.Category, true, out var category))
        {
            throw new ArgumentException("Invalid expense category.", nameof(request));
        }

        expense.Update(
            category,
            new Money(request.Amount, new Currency(request.Currency)),
            request.OccurredAtUtc,
            request.Notes);

        var trip = await tripRepository.GetAsync(expense.TripId, cancellationToken);
        if (trip is null)
        {
            return null;
        }

        return await MapToDto(expense, trip, cancellationToken);
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        return expenseRepository.DeleteAsync(id, cancellationToken);
    }

    private async Task<IReadOnlyList<ExpenseDto>> MapListToDto(
        IReadOnlyList<Expense> expenses,
        Domain.Trips.Trip trip,
        CancellationToken cancellationToken)
    {
        var result = new List<ExpenseDto>(expenses.Count);
        foreach (var expense in expenses)
        {
            result.Add(await MapToDto(expense, trip, cancellationToken));
        }

        return result;
    }

    private async Task<ExpenseDto> MapToDto(
        Expense expense,
        Domain.Trips.Trip trip,
        CancellationToken cancellationToken)
    {
        var conversion = await ConvertToHomeCurrency(expense, trip, cancellationToken);

        return new ExpenseDto(
            expense.Id,
            expense.TripId,
            expense.Category.ToString(),
            expense.Amount.Amount,
            expense.Amount.Currency.Code,
            conversion.HomeAmount,
            conversion.HomeCurrency,
            conversion.ExchangeRateUsed,
            expense.OccurredAtUtc,
            expense.Notes);
    }

    private async Task<(decimal? HomeAmount, string? HomeCurrency, decimal? ExchangeRateUsed)>
        ConvertToHomeCurrency(
            Expense expense,
            Domain.Trips.Trip trip,
            CancellationToken cancellationToken)
    {
        var homeCurrency = trip.HomeCurrency.Code;
        if (expense.Amount.Currency.Code == homeCurrency)
        {
            return (expense.Amount.Amount, homeCurrency, 1m);
        }

        var rateDate = DateOnly.FromDateTime(expense.OccurredAtUtc.UtcDateTime);
        var rate = await exchangeRateRepository.GetAsync(
            trip.Id,
            rateDate,
            expense.Amount.Currency.Code,
            homeCurrency,
            cancellationToken);

        if (rate is null)
        {
            decimal? providerRate;
            try
            {
                providerRate = await exchangeRateProvider.GetRateAsync(
                    rateDate,
                    expense.Amount.Currency.Code,
                    homeCurrency,
                    cancellationToken);
            }
            catch (HttpRequestException)
            {
                return (null, homeCurrency, null);
            }
            catch (TaskCanceledException)
            {
                return (null, homeCurrency, null);
            }

            if (providerRate is null)
            {
                return (null, homeCurrency, null);
            }

            rate = new ExchangeRateDto(
                trip.Id,
                rateDate,
                expense.Amount.Currency.Code,
                homeCurrency,
                providerRate.Value);
            await exchangeRateRepository.UpsertAsync(rate, cancellationToken);
        }

        var converted = decimal.Round(expense.Amount.Amount * rate.Rate, 2, MidpointRounding.AwayFromZero);
        return (converted, homeCurrency, rate.Rate);
    }
}
