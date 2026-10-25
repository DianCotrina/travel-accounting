using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelAccounting.Application.ReportsExport;

namespace TravelAccounting.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/trips/{tripId:guid}/reports")]
public sealed class ReportsController(IReportsExportService reportsExportService) : ControllerBase
{
    [HttpGet("summary")]
    public async Task<ActionResult<TripReportSummaryDto>> Summary(
        Guid tripId,
        [FromQuery] DateOnly? fromDate,
        [FromQuery] DateOnly? toDate,
        [FromQuery] string? category,
        CancellationToken cancellationToken)
    {
        var validationError = ValidateDateRange(fromDate, toDate);
        if (validationError is not null)
        {
            return BadRequest(new { error = validationError });
        }

        var summary = await reportsExportService.GetSummaryAsync(
            tripId,
            fromDate,
            toDate,
            category,
            cancellationToken);

        if (summary is null)
        {
            return NotFound();
        }

        return Ok(summary);
    }

    [HttpGet("export/csv")]
    public async Task<IActionResult> ExportCsv(
        Guid tripId,
        [FromQuery] DateOnly? fromDate,
        [FromQuery] DateOnly? toDate,
        [FromQuery] string? category,
        CancellationToken cancellationToken)
    {
        var validationError = ValidateDateRange(fromDate, toDate);
        if (validationError is not null)
        {
            return BadRequest(new { error = validationError });
        }

        var result = await reportsExportService.ExportCsvAsync(
            tripId,
            fromDate,
            toDate,
            category,
            cancellationToken);
        if (result is null)
        {
            return NotFound();
        }

        return File(
            Encoding.UTF8.GetBytes(result.Content),
            "text/csv; charset=utf-8",
            result.FileName);
    }

    private static string? ValidateDateRange(DateOnly? fromDate, DateOnly? toDate)
    {
        if (fromDate.HasValue && toDate.HasValue && toDate.Value < fromDate.Value)
        {
            return "toDate cannot be before fromDate.";
        }

        return null;
    }
}
