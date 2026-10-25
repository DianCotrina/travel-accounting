using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System.Net.Http.Headers;
using TravelAccounting.Application.ExchangeRates;
using TravelAccounting.Infrastructure.Data;

namespace TravelAccounting.Api.Tests;

public sealed class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    public const string DefaultTestUserId = "test-user";

    protected override void ConfigureWebHost(Microsoft.AspNetCore.Hosting.IWebHostBuilder builder)
    {
        builder.ConfigureAppConfiguration((_, configBuilder) =>
        {
            configBuilder.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Authentication:Jwt:Issuer"] = JwtTestTokenFactory.Issuer,
                ["Authentication:Jwt:Audience"] = JwtTestTokenFactory.Audience,
                ["Authentication:Jwt:SigningKey"] = JwtTestTokenFactory.SigningKey,
                ["Authentication:Jwt:Authority"] = string.Empty,
                ["Authentication:Jwt:RequireHttpsMetadata"] = "false",
            });
        });

        builder.ConfigureServices(services =>
        {
            var databaseName = $"travel-accounting-tests-{Guid.NewGuid():N}";

            services.RemoveAll<IExchangeRateProvider>();
            services.AddSingleton<IExchangeRateProvider, FakeExchangeRateProvider>();

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
            JwtTestTokenFactory.CreateToken(DefaultTestUserId));
    }

    private sealed class FakeExchangeRateProvider : IExchangeRateProvider
    {
        public Task<decimal?> GetRateAsync(
            DateOnly date,
            string fromCurrency,
            string toCurrency,
            CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            if (fromCurrency == "ARS" && toCurrency == "USD")
            {
                return Task.FromResult<decimal?>(0.001m);
            }

            return Task.FromResult<decimal?>(null);
        }
    }
}
