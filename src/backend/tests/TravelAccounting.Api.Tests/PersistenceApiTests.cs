using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace TravelAccounting.Api.Tests;

public sealed class PersistenceApiTests(CustomWebApplicationFactory factory)
    : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client = factory.CreateClient(
        new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost"),
        });

    [Fact]
    public async Task UpdateTrip_PersistsChanges_ForSubsequentReads()
    {
        var createResponse = await _client.PostAsJsonAsync("/api/trips", new
        {
            name = "Initial Name",
            destinationCountry = "Argentina",
            homeCurrency = "USD",
            localCurrency = "ARS",
            startDate = "2026-03-10",
            endDate = "2026-03-20",
        });
        createResponse.EnsureSuccessStatusCode();
        var trip = await createResponse.Content.ReadFromJsonAsync<TripResult>();
        Assert.NotNull(trip);

        var updateResponse = await _client.PutAsJsonAsync($"/api/trips/{trip!.Id}", new
        {
            name = "Updated Name",
            destinationCountry = "Chile",
            homeCurrency = "USD",
            localCurrency = "CLP",
            startDate = "2026-03-11",
            endDate = "2026-03-21",
        });
        updateResponse.EnsureSuccessStatusCode();

        var getResponse = await _client.GetAsync($"/api/trips/{trip.Id}");
        getResponse.EnsureSuccessStatusCode();
        var updated = await getResponse.Content.ReadFromJsonAsync<TripResult>();
        Assert.NotNull(updated);

        Assert.Equal("Updated Name", updated!.Name);
        Assert.Equal("Chile", updated.DestinationCountry);
        Assert.Equal("CLP", updated.LocalCurrency);
        Assert.Equal(new DateOnly(2026, 3, 11), updated.StartDate);
        Assert.Equal(new DateOnly(2026, 3, 21), updated.EndDate);
    }

    [Fact]
    public async Task UpdateExpense_PersistsChanges_ForSubsequentReads()
    {
        var createTripResponse = await _client.PostAsJsonAsync("/api/trips", new
        {
            name = "Expense Trip",
            destinationCountry = "Argentina",
            homeCurrency = "USD",
            localCurrency = "ARS",
            startDate = "2026-03-10",
            endDate = "2026-03-20",
        });
        createTripResponse.EnsureSuccessStatusCode();
        var trip = await createTripResponse.Content.ReadFromJsonAsync<TripResult>();
        Assert.NotNull(trip);

        var createExpenseResponse = await _client.PostAsJsonAsync(
            $"/api/trips/{trip!.Id}/expenses",
            new
            {
                category = "Meal",
                amount = 10000m,
                currency = "ARS",
                occurredAtUtc = "2026-03-11T18:00:00Z",
                notes = "Dinner",
            });
        createExpenseResponse.EnsureSuccessStatusCode();
        var expense = await createExpenseResponse.Content.ReadFromJsonAsync<ExpenseResult>();
        Assert.NotNull(expense);

        var updateExpenseResponse = await _client.PutAsJsonAsync(
            $"/api/trips/{trip.Id}/expenses/{expense!.Id}",
            new
            {
                category = "Transport",
                amount = 12500m,
                currency = "ARS",
                occurredAtUtc = "2026-03-11T20:30:00Z",
                notes = "Airport transfer",
            });
        updateExpenseResponse.EnsureSuccessStatusCode();

        var getExpenseResponse = await _client.GetAsync($"/api/trips/{trip.Id}/expenses/{expense.Id}");
        getExpenseResponse.EnsureSuccessStatusCode();
        var updated = await getExpenseResponse.Content.ReadFromJsonAsync<ExpenseResult>();
        Assert.NotNull(updated);

        Assert.Equal("Transport", updated!.Category);
        Assert.Equal(12500m, updated.Amount);
        Assert.Equal("Airport transfer", updated.Notes);
        Assert.Equal(DateTimeOffset.Parse("2026-03-11T20:30:00Z"), updated.OccurredAtUtc);
    }

    private sealed record TripResult(
        Guid Id,
        string Name,
        string DestinationCountry,
        string HomeCurrency,
        string LocalCurrency,
        DateOnly StartDate,
        DateOnly EndDate,
        string Status);

    private sealed record ExpenseResult(
        Guid Id,
        string Category,
        decimal Amount,
        string Currency,
        DateTimeOffset OccurredAtUtc,
        string Notes);
}
