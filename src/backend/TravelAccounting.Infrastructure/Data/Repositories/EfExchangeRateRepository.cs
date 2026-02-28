using Microsoft.EntityFrameworkCore;
using TravelAccounting.Application.ExchangeRates;
using TravelAccounting.Infrastructure.Data.Models;

namespace TravelAccounting.Infrastructure.Data.Repositories;

internal sealed class EfExchangeRateRepository(AppDbContext db) : IExchangeRateRepository
{
    public async Task<IReadOnlyList<ExchangeRateDto>> ListByTripAsync(Guid tripId, CancellationToken cancellationToken)
    {
        var rates = await db.ExchangeRates
            .Where(rate => rate.TripId == tripId)
            .OrderBy(rate => rate.Date)
            .ThenBy(rate => rate.FromCurrency)
            .ThenBy(rate => rate.ToCurrency)
            .ToListAsync(cancellationToken);

        return rates.Select(MapToDto).ToArray();
    }

    public async Task<ExchangeRateDto?> GetAsync(
        Guid tripId,
        DateOnly date,
        string fromCurrency,
        string toCurrency,
        CancellationToken cancellationToken)
    {
        var normalizedFrom = NormalizeCurrency(fromCurrency);
        var normalizedTo = NormalizeCurrency(toCurrency);

        var rate = await db.ExchangeRates
            .SingleOrDefaultAsync(
                entry =>
                    entry.TripId == tripId &&
                    entry.Date == date &&
                    entry.FromCurrency == normalizedFrom &&
                    entry.ToCurrency == normalizedTo,
                cancellationToken);

        return rate is null ? null : MapToDto(rate);
    }

    public async Task UpsertAsync(ExchangeRateDto rate, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(rate);

        var normalizedFrom = NormalizeCurrency(rate.FromCurrency);
        var normalizedTo = NormalizeCurrency(rate.ToCurrency);

        var existing = await db.ExchangeRates
            .SingleOrDefaultAsync(
                entry =>
                    entry.TripId == rate.TripId &&
                    entry.Date == rate.Date &&
                    entry.FromCurrency == normalizedFrom &&
                    entry.ToCurrency == normalizedTo,
                cancellationToken);

        if (existing is null)
        {
            await db.ExchangeRates.AddAsync(
                new ExchangeRateEntity
                {
                    TripId = rate.TripId,
                    Date = rate.Date,
                    FromCurrency = normalizedFrom,
                    ToCurrency = normalizedTo,
                    Rate = rate.Rate
                },
                cancellationToken);
        }
        else
        {
            existing.Rate = rate.Rate;
        }

        await db.SaveChangesAsync(cancellationToken);
    }

    private static ExchangeRateDto MapToDto(ExchangeRateEntity rate)
    {
        return new ExchangeRateDto(
            rate.TripId,
            rate.Date,
            rate.FromCurrency,
            rate.ToCurrency,
            rate.Rate);
    }

    private static string NormalizeCurrency(string currency)
    {
        return currency.Trim().ToUpperInvariant();
    }
}

