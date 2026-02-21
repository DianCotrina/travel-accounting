using Microsoft.Extensions.DependencyInjection;
using TravelAccounting.Application.AccountingLedger;
using TravelAccounting.Application.Expenses;
using TravelAccounting.Application.ExchangeRates;
using TravelAccounting.Application.Health;
using TravelAccounting.Application.ReportsExport;
using TravelAccounting.Application.Trips;

namespace TravelAccounting.Application;

public static class ApplicationServiceCollectionExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddSingleton(TimeProvider.System);
        services.AddScoped<IHealthStatusService, HealthStatusService>();
        services.AddScoped<ITripsService, TripsService>();
        services.AddScoped<IExpensesService, ExpensesService>();
        services.AddScoped<IExchangeRatesService, ExchangeRatesService>();
        services.AddScoped<IAccountingLedgerService, AccountingLedgerService>();
        services.AddScoped<IReportsExportService, ReportsExportService>();

        return services;
    }
}
