using System.Collections.Concurrent;
using TravelAccounting.Application.ExchangeRates;

namespace TravelAccounting.Infrastructure.ExchangeRates;

internal sealed class InMemoryExchangeRateRepository : IExchangeRateRepository
{
    private readonly ConcurrentDictionary<string, ExchangeRateDto> _rates = new();

    public Task<IReadOnlyList<ExchangeRateDto>> ListByTripAsync(Guid tripId, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        IReadOnlyList<ExchangeRateDto> rates = _rates.Values
            .Where(rate => rate.TripId == tripId)
            .OrderBy(rate => rate.Date)
            .ThenBy(rate => rate.FromCurrency)
            .ThenBy(rate => rate.ToCurrency)
            .ToArray();
        return Task.FromResult(rates);
    }

    public Task<ExchangeRateDto?> GetAsync(
        Guid tripId,
        DateOnly date,
        string fromCurrency,
        string toCurrency,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        var key = BuildKey(tripId, date, fromCurrency, toCurrency);
        _rates.TryGetValue(key, out var rate);
        return Task.FromResult(rate);
    }

    public Task UpsertAsync(ExchangeRateDto rate, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(rate);
        cancellationToken.ThrowIfCancellationRequested();

        var key = BuildKey(rate.TripId, rate.Date, rate.FromCurrency, rate.ToCurrency);
        _rates[key] = rate;
        return Task.CompletedTask;
    }

    private static string BuildKey(Guid tripId, DateOnly date, string fromCurrency, string toCurrency)
    {
        return $"{tripId:N}:{date:yyyy-MM-dd}:{fromCurrency.ToUpperInvariant()}:{toCurrency.ToUpperInvariant()}";
    }
}
