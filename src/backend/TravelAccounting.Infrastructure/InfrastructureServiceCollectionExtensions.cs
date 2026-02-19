using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TravelAccounting.Application.Expenses;
using TravelAccounting.Application.ExchangeRates;
using TravelAccounting.Application.Reference;
using TravelAccounting.Application.Trips;
using TravelAccounting.Infrastructure.Expenses;
using TravelAccounting.Infrastructure.ExchangeRates;
using TravelAccounting.Infrastructure.Reference;
using TravelAccounting.Infrastructure.Trips;

namespace TravelAccounting.Infrastructure;

public static class InfrastructureServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        ArgumentNullException.ThrowIfNull(configuration);
        services
            .AddOptions<ExchangeRateProviderOptions>()
            .Bind(configuration.GetSection(ExchangeRateProviderOptions.SectionName))
            .Validate(options => Uri.TryCreate(options.BaseUrl, UriKind.Absolute, out _),
                "Exchange rate provider BaseUrl must be a valid absolute URI.")
            .ValidateOnStart();

        services.AddHttpClient<IExchangeRateProvider, ExchangeRateHostProvider>(
            (serviceProvider, httpClient) =>
            {
                var options = serviceProvider
                    .GetRequiredService<Microsoft.Extensions.Options.IOptions<ExchangeRateProviderOptions>>()
                    .Value;
                httpClient.BaseAddress = new Uri(options.BaseUrl);
            });

        services.AddSingleton<ITripRepository, InMemoryTripRepository>();
        services.AddSingleton<IExpenseRepository, InMemoryExpenseRepository>();
        services.AddSingleton<IExchangeRateRepository, InMemoryExchangeRateRepository>();
        services.AddSingleton<ICountryReferenceService, InMemoryCountryReferenceService>();

        return services;
    }
}
