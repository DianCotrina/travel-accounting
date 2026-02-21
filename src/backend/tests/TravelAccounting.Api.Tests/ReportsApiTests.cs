using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace TravelAccounting.Api.Tests;

public sealed class ReportsApiTests(CustomWebApplicationFactory factory)
    : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client = factory.CreateClient(
        new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost"),
        });

    [Fact]
    public async Task Summary_AppliesDateAndCategoryFilters()
    {
        var tripResponse = await _client.PostAsJsonAsync("/api/trips", new
        {
            name = "Reports Test Trip",
            destinationCountry = "Argentina",
            homeCurrency = "USD",
            localCurrency = "ARS",
            startDate = "2026-03-10",
            endDate = "2026-03-20",
        });
        tripResponse.EnsureSuccessStatusCode();
        var trip = await tripResponse.Content.ReadFromJsonAsync<TripResult>();
        Assert.NotNull(trip);

        await CreateExpense(trip!.Id, "Meal", 1000m, "2026-03-11T12:00:00Z", "Lunch");
        await CreateExpense(trip.Id, "Transport", 500m, "2026-03-11T18:00:00Z", "Taxi");
        await CreateExpense(trip.Id, "Meal", 600m, "2026-03-12T13:00:00Z", "Dinner");

        var response = await _client.GetAsync(
            $"/api/trips/{trip.Id}/reports/summary?fromDate=2026-03-11&toDate=2026-03-11&category=Meal");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var summary = await response.Content.ReadFromJsonAsync<ReportSummaryResult>();
        Assert.NotNull(summary);
        Assert.Equal(1, summary!.ExpenseCount);
        Assert.Equal(1000m, summary.TotalLocalAmount);
        Assert.Equal(1m, summary.TotalHomeAmount);
        Assert.Single(summary.CategoryTotals);
        Assert.Equal("Meal", summary.CategoryTotals[0].Category);
    }

    [Fact]
    public async Task ExportCsv_ReturnsCsvFile()
    {
        var tripResponse = await _client.PostAsJsonAsync("/api/trips", new
        {
            name = "CSV Test Trip",
            destinationCountry = "Argentina",
            homeCurrency = "USD",
            localCurrency = "ARS",
            startDate = "2026-03-10",
            endDate = "2026-03-20",
        });
        tripResponse.EnsureSuccessStatusCode();
        var trip = await tripResponse.Content.ReadFromJsonAsync<TripResult>();
        Assert.NotNull(trip);

        await CreateExpense(trip!.Id, "Meal", 1200m, "2026-03-11T12:00:00Z", "Lunch report");

        var response = await _client.GetAsync($"/api/trips/{trip.Id}/reports/export/csv");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("text/csv", response.Content.Headers.ContentType?.MediaType);
        Assert.NotNull(response.Content.Headers.ContentDisposition?.FileName);

        var content = await response.Content.ReadAsStringAsync();
        Assert.Contains("TripId,OccurredAtUtc,Category,Notes,Amount,Currency,HomeAmount,HomeCurrency,ExchangeRateUsed", content);
        Assert.Contains("Lunch report", content);
    }

    [Fact]
    public async Task Summary_ReturnsBadRequest_WhenDateRangeIsInvalid()
    {
        var response = await _client.GetAsync(
            $"/api/trips/{Guid.NewGuid()}/reports/summary?fromDate=2026-03-12&toDate=2026-03-11");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task ExportCsv_ReturnsBadRequest_WhenDateRangeIsInvalid()
    {
        var response = await _client.GetAsync(
            $"/api/trips/{Guid.NewGuid()}/reports/export/csv?fromDate=2026-03-12&toDate=2026-03-11");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    private async Task CreateExpense(
        Guid tripId,
        string category,
        decimal amount,
        string occurredAtUtc,
        string notes)
    {
        var expenseResponse = await _client.PostAsJsonAsync(
            $"/api/trips/{tripId}/expenses",
            new
            {
                category,
                amount,
                currency = "ARS",
                occurredAtUtc,
                notes,
            });
        expenseResponse.EnsureSuccessStatusCode();
    }

    private sealed record TripResult(Guid Id);

    private sealed record ReportSummaryResult(
        int ExpenseCount,
        decimal TotalLocalAmount,
        decimal TotalHomeAmount,
        IReadOnlyList<ReportCategoryTotalResult> CategoryTotals);

    private sealed record ReportCategoryTotalResult(
        string Category,
        int ExpenseCount,
        decimal TotalLocalAmount,
        decimal TotalHomeAmount);
}
