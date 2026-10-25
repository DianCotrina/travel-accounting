using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelAccounting.Api.Expenses;
using TravelAccounting.Application.Expenses;

namespace TravelAccounting.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/trips/{tripId:guid}/[controller]")]
public sealed class ExpensesController(IExpensesService expensesService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ExpenseDto>>> List(
        Guid tripId,
        CancellationToken cancellationToken)
    {
        var expenses = await expensesService.ListByTripAsync(tripId, cancellationToken);
        return Ok(expenses);
    }

    [HttpPost]
    public async Task<ActionResult<ExpenseDto>> Create(
        Guid tripId,
        [FromBody] UpsertExpenseRequest request,
        CancellationToken cancellationToken)
    {
        var validationError = ValidateRequest(request);
        if (validationError is not null)
        {
            return BadRequest(new { error = validationError });
        }

        try
        {
            var expense = await expensesService.CreateAsync(
                new CreateExpenseRequest(
                    tripId,
                    request.Category,
                    request.Amount,
                    request.Currency,
                    request.OccurredAtUtc,
                    request.Notes),
                cancellationToken);

            if (expense is null)
            {
                return NotFound(new { error = "Trip was not found." });
            }

            return CreatedAtAction(nameof(Get), new { tripId, id = expense.Id }, expense);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new { error = exception.Message });
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ExpenseDto>> Get(
        Guid tripId,
        Guid id,
        CancellationToken cancellationToken)
    {
        var expense = await expensesService.GetAsync(id, cancellationToken);
        if (expense is null || expense.TripId != tripId)
        {
            return NotFound();
        }

        return Ok(expense);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ExpenseDto>> Update(
        Guid tripId,
        Guid id,
        [FromBody] UpsertExpenseRequest request,
        CancellationToken cancellationToken)
    {
        var validationError = ValidateRequest(request);
        if (validationError is not null)
        {
            return BadRequest(new { error = validationError });
        }

        try
        {
            var expense = await expensesService.UpdateAsync(
                id,
                new UpdateExpenseRequest(
                    request.Category,
                    request.Amount,
                    request.Currency,
                    request.OccurredAtUtc,
                    request.Notes),
                cancellationToken);

            if (expense is null || expense.TripId != tripId)
            {
                return NotFound();
            }

            return Ok(expense);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new { error = exception.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid tripId, Guid id, CancellationToken cancellationToken)
    {
        var expense = await expensesService.GetAsync(id, cancellationToken);
        if (expense is null || expense.TripId != tripId)
        {
            return NotFound();
        }

        var deleted = await expensesService.DeleteAsync(id, cancellationToken);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }

    private static string? ValidateRequest(UpsertExpenseRequest request)
    {
        if (request.Amount <= 0)
        {
            return "Amount must be greater than zero.";
        }

        if (request.OccurredAtUtc == default)
        {
            return "Occurrence date is required.";
        }

        if (request.Currency.Length != 3)
        {
            return "Currency must use a 3-letter code.";
        }

        return null;
    }
}
