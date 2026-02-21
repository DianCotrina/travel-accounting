using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelAccounting.Api.Trips;
using TravelAccounting.Application.Trips;

namespace TravelAccounting.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public sealed class TripsController(ITripsService tripsService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<TripDto>>> List(CancellationToken cancellationToken)
    {
        var trips = await tripsService.ListAsync(cancellationToken);
        return Ok(trips);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TripDto>> Get(Guid id, CancellationToken cancellationToken)
    {
        var trip = await tripsService.GetAsync(id, cancellationToken);
        if (trip is null)
        {
            return NotFound();
        }

        return Ok(trip);
    }

    [HttpPost]
    public async Task<ActionResult<TripDto>> Create(
        [FromBody] UpsertTripRequest request,
        CancellationToken cancellationToken)
    {
        var validationError = ValidateRequest(request);
        if (validationError is not null)
        {
            return BadRequest(new { error = validationError });
        }

        var trip = await tripsService.CreateAsync(
            new CreateTripRequest(
                request.Name,
                request.DestinationCountry,
                request.HomeCurrency,
                request.LocalCurrency,
                request.StartDate,
                request.EndDate),
            cancellationToken);

        return CreatedAtAction(nameof(Get), new { id = trip.Id }, trip);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TripDto>> Update(
        Guid id,
        [FromBody] UpsertTripRequest request,
        CancellationToken cancellationToken)
    {
        var validationError = ValidateRequest(request);
        if (validationError is not null)
        {
            return BadRequest(new { error = validationError });
        }

        var trip = await tripsService.UpdateAsync(
            id,
            new UpdateTripRequest(
                request.Name,
                request.DestinationCountry,
                request.HomeCurrency,
                request.LocalCurrency,
                request.StartDate,
                request.EndDate),
            cancellationToken);

        if (trip is null)
        {
            return NotFound();
        }

        return Ok(trip);
    }

    [HttpPost("{id:guid}/archive")]
    public async Task<ActionResult<TripDto>> Archive(Guid id, CancellationToken cancellationToken)
    {
        var trip = await tripsService.ArchiveAsync(id, cancellationToken);
        if (trip is null)
        {
            return NotFound();
        }

        return Ok(trip);
    }

    private static string? ValidateRequest(UpsertTripRequest request)
    {
        if (request.EndDate < request.StartDate)
        {
            return "End date cannot be before start date.";
        }

        if (request.HomeCurrency.Length != 3 || request.LocalCurrency.Length != 3)
        {
            return "Currencies must use 3-letter codes.";
        }

        return null;
    }
}
