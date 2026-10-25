using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelAccounting.Api.Audit;
using TravelAccounting.Application.Audit;
using TravelAccounting.Application.Auth;

namespace TravelAccounting.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public sealed class AuditController(
    IAuditService auditService,
    ICurrentUserContext currentUserContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AuditEntryApiResponse>>> List(
        [FromQuery] string? entityType,
        [FromQuery] Guid? entityId,
        [FromQuery] string? userId,
        [FromQuery] DateTimeOffset? fromDate,
        [FromQuery] DateTimeOffset? toDate,
        CancellationToken cancellationToken)
    {
        if (fromDate.HasValue && toDate.HasValue && toDate.Value < fromDate.Value)
        {
            return BadRequest(new { error = "toDate must be greater than or equal to fromDate." });
        }

        var currentUserId = currentUserContext.UserId;
        if (!string.IsNullOrWhiteSpace(userId) && userId != currentUserId)
        {
            return Forbid();
        }

        var query = new AuditQuery(
            entityType,
            entityId,
            currentUserId,
            fromDate,
            toDate);

        var entries = await auditService.ListAsync(query, cancellationToken);
        var response = entries.Select(entry => new AuditEntryApiResponse(
                entry.Id,
                entry.UserId,
                entry.Action,
                entry.EntityType,
                entry.EntityId,
                entry.Timestamp,
                JsonNode.Parse(entry.Changes)))
            .ToArray();

        return Ok(response);
    }
}
