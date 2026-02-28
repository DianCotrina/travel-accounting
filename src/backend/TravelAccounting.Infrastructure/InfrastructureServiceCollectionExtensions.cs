using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TravelAccounting.Application.Audit;
using TravelAccounting.Application.Expenses;
using TravelAccounting.Application.ExchangeRates;
using TravelAccounting.Application.Reference;
using TravelAccounting.Application.Trips;
using TravelAccounting.Infrastructure.Audit;
using TravelAccounting.Infrastructure.Data;
using TravelAccounting.Infrastructure.Data.Repositories;
using TravelAccounting.Infrastructure.ExchangeRates;
using TravelAccounting.Infrastructure.Reference;

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

        var connectionString = configuration.GetConnectionString("DefaultConnection");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                "Connection string 'DefaultConnection' is required for persistence.");
        }

        services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

        services.AddScoped<IAuditService, EfAuditService>();
        services.AddScoped<ITripRepository, EfTripRepository>();
        services.AddScoped<IExpenseRepository, EfExpenseRepository>();
        services.AddScoped<IExchangeRateRepository, EfExchangeRateRepository>();
        services.AddSingleton<ICountryReferenceService, InMemoryCountryReferenceService>();

        return services;
    }
}
