using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace TravelAccounting.Api.Tests;

public sealed class TripsApiTests(CustomWebApplicationFactory factory)
    : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client = factory.CreateClient(
        new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost"),
        });

    [Fact]
    public async Task CreateTrip_ReturnsCreated_ForValidRequest()
    {
        var payload = new
        {
            name = "Argentina Work Trip",
            destinationCountry = "Argentina",
            homeCurrency = "USD",
            localCurrency = "ARS",
            startDate = "2026-03-10",
            endDate = "2026-03-20",
        };

        var response = await _client.PostAsJsonAsync("/api/trips", payload);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task CreateTrip_ReturnsBadRequest_ForInvalidCurrencyLength()
    {
        var payload = new
        {
            name = "Argentina Work Trip",
            destinationCountry = "Argentina",
            homeCurrency = "US",
            localCurrency = "ARS",
            startDate = "2026-03-10",
            endDate = "2026-03-20",
        };

        var response = await _client.PostAsJsonAsync("/api/trips", payload);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.NotEqual(HttpStatusCode.InternalServerError, response.StatusCode);
    }
}
