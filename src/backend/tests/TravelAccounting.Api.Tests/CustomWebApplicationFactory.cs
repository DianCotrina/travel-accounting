using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using TravelAccounting.Application.ExchangeRates;

namespace TravelAccounting.Api.Tests;

public sealed class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(Microsoft.AspNetCore.Hosting.IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            services.RemoveAll<IExchangeRateProvider>();
            services.AddSingleton<IExchangeRateProvider, FakeExchangeRateProvider>();
        });
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
