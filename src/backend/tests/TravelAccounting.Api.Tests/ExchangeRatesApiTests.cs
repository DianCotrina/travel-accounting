using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using TravelAccounting.Application.ExchangeRates;
using TravelAccounting.Infrastructure.Data;

namespace TravelAccounting.Api.Tests;

public sealed class ExchangeRatesApiTests(CustomWebApplicationFactory factory)
    : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client = factory.CreateClient(
        new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost"),
        });

    [Fact]
    public async Task ExpenseList_ReturnsConvertedHomeAmount_WhenRateExists()
    {
        var tripResponse = await _client.PostAsJsonAsync("/api/trips", new
        {
            name = "Argentina Vacation",
            destinationCountry = "Argentina",
            homeCurrency = "USD",
            localCurrency = "ARS",
            startDate = "2026-03-10",
            endDate = "2026-03-20",
        });
        tripResponse.EnsureSuccessStatusCode();
        var trip = await tripResponse.Content.ReadFromJsonAsync<TripResult>();
        Assert.NotNull(trip);

        var rateResponse = await _client.PutAsJsonAsync(
            $"/api/trips/{trip!.Id}/exchange-rates",
            new
            {
                date = "2026-03-11",
                fromCurrency = "ARS",
                toCurrency = "USD",
                rate = 0.001m,
            });
        rateResponse.EnsureSuccessStatusCode();

        var expenseResponse = await _client.PostAsJsonAsync(
            $"/api/trips/{trip.Id}/expenses",
            new
            {
                category = "Meal",
                amount = 10000m,
                currency = "ARS",
                occurredAtUtc = "2026-03-11T18:00:00Z",
                notes = "Dinner",
            });
        expenseResponse.EnsureSuccessStatusCode();

        var listResponse = await _client.GetAsync($"/api/trips/{trip.Id}/expenses");
        listResponse.EnsureSuccessStatusCode();
        var expenses = await listResponse.Content.ReadFromJsonAsync<List<ExpenseResult>>();

        Assert.NotNull(expenses);
        Assert.Single(expenses);
        Assert.Equal(10m, expenses[0].HomeAmount);
        Assert.Equal("USD", expenses[0].HomeCurrency);
        Assert.Equal(0.001m, expenses[0].ExchangeRateUsed);
    }

    [Fact]
    public async Task UpsertRate_ReturnsBadRequest_ForInvalidCurrencyLength()
    {
        var response = await _client.PutAsJsonAsync(
            $"/api/trips/{Guid.NewGuid()}/exchange-rates",
            new
            {
                date = "2026-03-11",
                fromCurrency = "AR",
                toCurrency = "USD",
                rate = 0.001m,
            });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateExpense_DoesNotFail_WhenProviderIsUnavailable()
    {
        using var failingFactory = new FailingProviderWebApplicationFactory();
        using var client = failingFactory.CreateClient(
            new WebApplicationFactoryClientOptions
            {
                BaseAddress = new Uri("https://localhost"),
            });

        var tripResponse = await client.PostAsJsonAsync("/api/trips", new
        {
            name = "Argentina Vacation",
            destinationCountry = "Argentina",
            homeCurrency = "USD",
            localCurrency = "ARS",
            startDate = "2026-03-10",
            endDate = "2026-03-20",
        });
        tripResponse.EnsureSuccessStatusCode();
        var trip = await tripResponse.Content.ReadFromJsonAsync<TripResult>();
        Assert.NotNull(trip);

        var expenseResponse = await client.PostAsJsonAsync(
            $"/api/trips/{trip!.Id}/expenses",
            new
            {
                category = "Meal",
                amount = 10000m,
                currency = "ARS",
                occurredAtUtc = "2026-03-11T18:00:00Z",
                notes = "Dinner",
            });

        Assert.Equal(HttpStatusCode.Created, expenseResponse.StatusCode);
        var created = await expenseResponse.Content.ReadFromJsonAsync<ExpenseResult>();
        Assert.NotNull(created);
        Assert.Null(created!.HomeAmount);
        Assert.Equal("USD", created.HomeCurrency);
        Assert.Null(created.ExchangeRateUsed);
    }

    private sealed record TripResult(Guid Id);

    private sealed record ExpenseResult(
        Guid Id,
        decimal Amount,
        string Currency,
        decimal? HomeAmount,
        string? HomeCurrency,
        decimal? ExchangeRateUsed);

    private sealed class FailingProviderWebApplicationFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(Microsoft.AspNetCore.Hosting.IWebHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {
                var databaseName = $"travel-accounting-tests-failing-provider-{Guid.NewGuid():N}";

                services.RemoveAll<IExchangeRateProvider>();
                services.AddSingleton<IExchangeRateProvider, ThrowingProvider>();

                services.RemoveAll<DbContextOptions<AppDbContext>>();
                services.RemoveAll<IDbContextOptionsConfiguration<AppDbContext>>();
                services.AddDbContext<AppDbContext>((_, options) =>
                    options.UseInMemoryDatabase(databaseName));

                using var scope = services.BuildServiceProvider().CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                db.Database.EnsureCreated();
            });
        }

        protected override void ConfigureClient(HttpClient client)
        {
            base.ConfigureClient(client);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                "Bearer",
                JwtTestTokenFactory.CreateToken(CustomWebApplicationFactory.DefaultTestUserId));
        }
    }

    private sealed class ThrowingProvider : IExchangeRateProvider
    {
        public Task<decimal?> GetRateAsync(
            DateOnly date,
            string fromCurrency,
            string toCurrency,
            CancellationToken cancellationToken)
        {
            throw new HttpRequestException("Provider unavailable.");
        }
    }
}
