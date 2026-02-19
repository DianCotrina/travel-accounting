namespace TravelAccounting.Infrastructure.ExchangeRates;

public sealed class ExchangeRateProviderOptions
{
    public const string SectionName = "ExternalServices:ExchangeRates";

    public string BaseUrl { get; init; } = "https://api.exchangerate.host";

    public string AccessKey { get; init; } = string.Empty;
}
