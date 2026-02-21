using System.Net;
using System.Net.Http;
using System.Text;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using TravelAccounting.Infrastructure.ExchangeRates;

namespace TravelAccounting.Api.Tests;

public sealed class ExchangeRateHostProviderTests
{
    [Fact]
    public async Task GetRateAsync_ParsesQuotePayload_ByInvertingSourcePair()
    {
        var responseJson = """
                           {
                             "success": true,
                             "source": "USD",
                             "quotes": {
                               "USDARS": 1375.750402
                             }
                           }
                           """;

        var httpClient = new HttpClient(new StubHttpMessageHandler(responseJson))
        {
            BaseAddress = new Uri("https://api.exchangerate.host"),
        };
        var options = Options.Create(new ExchangeRateProviderOptions
        {
            BaseUrl = "https://api.exchangerate.host",
            AccessKey = "test-key",
        });
        var provider = new ExchangeRateHostProvider(
            httpClient,
            options,
            NullLogger<ExchangeRateHostProvider>.Instance);

        var rate = await provider.GetRateAsync(
            new DateOnly(2026, 2, 21),
            "ARS",
            "USD",
            CancellationToken.None);

        Assert.NotNull(rate);
        Assert.Equal(decimal.Round(1m / 1375.750402m, 10), decimal.Round(rate!.Value, 10));
    }

    private sealed class StubHttpMessageHandler(string responseJson) : HttpMessageHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            var response = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(responseJson, Encoding.UTF8, "application/json"),
            };
            return Task.FromResult(response);
        }
    }
}
