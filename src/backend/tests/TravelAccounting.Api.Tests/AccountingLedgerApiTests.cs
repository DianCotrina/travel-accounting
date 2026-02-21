using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace TravelAccounting.Api.Tests;

public sealed class AccountingLedgerApiTests(CustomWebApplicationFactory factory)
    : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client = factory.CreateClient(
        new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost"),
        });

    [Fact]
    public async Task Summary_ReturnsAggregates_ByCategoryAndDay()
    {
        var tripResponse = await _client.PostAsJsonAsync("/api/trips", new
        {
            name = "Argentina Ledger Trip",
            destinationCountry = "Argentina",
            homeCurrency = "USD",
            localCurrency = "ARS",
            startDate = "2026-03-10",
            endDate = "2026-03-20",
        });
        tripResponse.EnsureSuccessStatusCode();
        var trip = await tripResponse.Content.ReadFromJsonAsync<TripResult>();
        Assert.NotNull(trip);

        var firstExpenseResponse = await _client.PostAsJsonAsync(
            $"/api/trips/{trip!.Id}/expenses",
            new
            {
                category = "Meal",
                amount = 1000m,
                currency = "ARS",
                occurredAtUtc = "2026-03-11T12:30:00Z",
                notes = "Lunch",
            });
        firstExpenseResponse.EnsureSuccessStatusCode();

        var secondExpenseResponse = await _client.PostAsJsonAsync(
            $"/api/trips/{trip.Id}/expenses",
            new
            {
                category = "Transport",
                amount = 500m,
                currency = "ARS",
                occurredAtUtc = "2026-03-12T08:00:00Z",
                notes = "Taxi",
            });
        secondExpenseResponse.EnsureSuccessStatusCode();

        var response = await _client.GetAsync($"/api/trips/{trip.Id}/ledger/summary");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var summary = await response.Content.ReadFromJsonAsync<LedgerSummaryResult>();
        Assert.NotNull(summary);
        Assert.Equal(trip.Id, summary!.TripId);
        Assert.Equal("ARS", summary.LocalCurrency);
        Assert.Equal("USD", summary.HomeCurrency);
        Assert.Equal(1500m, summary.TotalLocalAmount);
        Assert.Equal(1.5m, summary.ConvertedHomeAmount);
        Assert.Equal(2, summary.ExpenseCount);
        Assert.Equal(2, summary.ConvertedExpenseCount);
        Assert.Equal(0, summary.MissingHomeConversionCount);
        Assert.Equal(2, summary.CategoryTotals.Count);
        Assert.Equal(2, summary.DayTotals.Count);
    }

    private sealed record TripResult(Guid Id);

    private sealed record LedgerSummaryResult(
        Guid TripId,
        string LocalCurrency,
        string HomeCurrency,
        decimal TotalLocalAmount,
        decimal ConvertedHomeAmount,
        int ExpenseCount,
        int ConvertedExpenseCount,
        int MissingHomeConversionCount,
        IReadOnlyList<LedgerCategoryTotalResult> CategoryTotals,
        IReadOnlyList<LedgerDayTotalResult> DayTotals);

    private sealed record LedgerCategoryTotalResult(
        string Category,
        decimal TotalLocalAmount,
        decimal ConvertedHomeAmount,
        int ExpenseCount,
        int ConvertedExpenseCount,
        int MissingHomeConversionCount);

    private sealed record LedgerDayTotalResult(
        string Date,
        decimal TotalLocalAmount,
        decimal ConvertedHomeAmount,
        int ExpenseCount,
        int ConvertedExpenseCount,
        int MissingHomeConversionCount);
}
