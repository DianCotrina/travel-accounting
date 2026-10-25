using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace TravelAccounting.Api.Tests;

public sealed class AuthApiTests(CustomWebApplicationFactory factory)
    : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory = factory;

    [Fact]
    public async Task TripsEndpoints_ReturnUnauthorized_WhenBearerTokenMissing()
    {
        var client = _factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost"),
        });
        client.DefaultRequestHeaders.Authorization = null;

        var response = await client.GetAsync("/api/trips");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task User_CannotRead_TripOwnedByAnotherUser()
    {
        var ownerClient = _factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost"),
        });
        ownerClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            JwtTestTokenFactory.CreateToken("owner-user"));

        var createResponse = await ownerClient.PostAsJsonAsync("/api/trips", new
        {
            name = "Private Trip",
            destinationCountry = "Argentina",
            homeCurrency = "USD",
            localCurrency = "ARS",
            startDate = "2026-03-10",
            endDate = "2026-03-20",
        });
        createResponse.EnsureSuccessStatusCode();
        var createdTrip = await createResponse.Content.ReadFromJsonAsync<TripResult>();
        Assert.NotNull(createdTrip);

        var anotherClient = _factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost"),
        });
        anotherClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            JwtTestTokenFactory.CreateToken("another-user"));

        var getResponse = await anotherClient.GetAsync($"/api/trips/{createdTrip!.Id}");

        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }

    private sealed record TripResult(Guid Id);
}
