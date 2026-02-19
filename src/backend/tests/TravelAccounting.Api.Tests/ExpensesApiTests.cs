using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace TravelAccounting.Api.Tests;

public sealed class ExpensesApiTests(CustomWebApplicationFactory factory)
    : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client = factory.CreateClient(
        new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost"),
        });

    [Fact]
    public async Task CreateExpense_ReturnsCreated_ForExistingTrip()
    {
        var tripResponse = await _client.PostAsJsonAsync("/api/trips", new
        {
            name = "Argentina Work Trip",
            destinationCountry = "Argentina",
            homeCurrency = "USD",
            localCurrency = "ARS",
            startDate = "2026-03-10",
            endDate = "2026-03-20",
        });
        tripResponse.EnsureSuccessStatusCode();

        var trip = await tripResponse.Content.ReadFromJsonAsync<TripResult>();
        Assert.NotNull(trip);

        var expenseResponse = await _client.PostAsJsonAsync(
            $"/api/trips/{trip!.Id}/expenses",
            new
            {
                category = "Meal",
                amount = 35.5m,
                currency = "ARS",
                occurredAtUtc = "2026-03-11T12:30:00Z",
                notes = "Lunch at Palermo",
            });

        Assert.Equal(HttpStatusCode.Created, expenseResponse.StatusCode);
    }

    [Fact]
    public async Task CountriesReference_ReturnsOk()
    {
        var response = await _client.GetAsync("/api/reference/countries");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    private sealed record TripResult(Guid Id);
}
