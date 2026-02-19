using Microsoft.AspNetCore.Mvc;
using TravelAccounting.Api.ExchangeRates;
using TravelAccounting.Application.ExchangeRates;

namespace TravelAccounting.Api.Controllers;

[ApiController]
[Route("api/trips/{tripId:guid}/exchange-rates")]
public sealed class ExchangeRatesController(IExchangeRatesService exchangeRatesService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ExchangeRateDto>>> List(
        Guid tripId,
        CancellationToken cancellationToken)
    {
        var rates = await exchangeRatesService.ListByTripAsync(tripId, cancellationToken);
        return Ok(rates);
    }

    [HttpPut]
    public async Task<ActionResult<ExchangeRateDto>> Upsert(
        Guid tripId,
        [FromBody] UpsertExchangeRateApiRequest request,
        CancellationToken cancellationToken)
    {
        var validationError = ValidateRequest(request);
        if (validationError is not null)
        {
            return BadRequest(new { error = validationError });
        }

        try
        {
            var rate = await exchangeRatesService.UpsertAsync(
                tripId,
                new UpsertExchangeRateRequest(
                    request.Date,
                    request.FromCurrency,
                    request.ToCurrency,
                    request.Rate),
                cancellationToken);

            if (rate is null)
            {
                return NotFound(new { error = "Trip was not found." });
            }

            return Ok(rate);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new { error = exception.Message });
        }
    }

    private static string? ValidateRequest(UpsertExchangeRateApiRequest request)
    {
        if (request.Rate <= 0)
        {
            return "Rate must be greater than zero.";
        }

        if (request.FromCurrency.Length != 3 || request.ToCurrency.Length != 3)
        {
            return "Currencies must use 3-letter codes.";
        }

        return null;
    }
}
