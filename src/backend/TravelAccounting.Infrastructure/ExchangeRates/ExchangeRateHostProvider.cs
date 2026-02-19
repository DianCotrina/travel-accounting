using System.Net.Http.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using TravelAccounting.Application.ExchangeRates;

namespace TravelAccounting.Infrastructure.ExchangeRates;

internal sealed class ExchangeRateHostProvider(
    HttpClient httpClient,
    IOptions<ExchangeRateProviderOptions> optionsAccessor,
    ILogger<ExchangeRateHostProvider> logger) : IExchangeRateProvider
{
    private readonly ExchangeRateProviderOptions _options = optionsAccessor.Value;

    public async Task<decimal?> GetRateAsync(
        DateOnly date,
        string fromCurrency,
        string toCurrency,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(_options.AccessKey))
        {
            logger.LogWarning(
                "Exchange rate provider access key is missing. Configure {Section}:{Field}.",
                ExchangeRateProviderOptions.SectionName,
                nameof(ExchangeRateProviderOptions.AccessKey));
            return null;
        }

        var from = fromCurrency.ToUpperInvariant();
        var to = toCurrency.ToUpperInvariant();
        var endpoint =
            $"/historical?date={date:yyyy-MM-dd}&base={Uri.EscapeDataString(from)}&symbols={Uri.EscapeDataString(to)}&access_key={Uri.EscapeDataString(_options.AccessKey)}";

        try
        {
            using var response = await httpClient.GetAsync(endpoint, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                logger.LogWarning(
                    "Exchange rate provider returned {StatusCode} for {Endpoint}.",
                    (int)response.StatusCode,
                    endpoint);
                return null;
            }

            var payload = await response.Content.ReadFromJsonAsync<ExchangeRateHostResponse>(cancellationToken);
            if (payload?.Success != true || payload.Rates is null)
            {
                logger.LogWarning(
                    "Exchange rate provider returned unsuccessful payload for {Endpoint}. Error: {Error}",
                    endpoint,
                    payload?.Error?.Info ?? "unknown");
                return null;
            }

            return payload.Rates.TryGetValue(to, out var rate) ? rate : null;
        }
        catch (HttpRequestException exception)
        {
            logger.LogWarning(
                exception,
                "Exchange rate provider request failed for {Endpoint}.",
                endpoint);
            return null;
        }
        catch (TaskCanceledException exception)
        {
            logger.LogWarning(
                exception,
                "Exchange rate provider request timed out for {Endpoint}.",
                endpoint);
            return null;
        }
    }

    private sealed class ExchangeRateHostResponse
    {
        public bool Success { get; init; }
        public Dictionary<string, decimal>? Rates { get; init; }
        public ErrorResponse? Error { get; init; }
    }

    private sealed class ErrorResponse
    {
        public string? Info { get; init; }
    }
}
