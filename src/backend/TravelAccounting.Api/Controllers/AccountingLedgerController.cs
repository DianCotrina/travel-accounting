using Microsoft.AspNetCore.Mvc;
using TravelAccounting.Application.AccountingLedger;

namespace TravelAccounting.Api.Controllers;

[ApiController]
[Route("api/trips/{tripId:guid}/ledger")]
public sealed class AccountingLedgerController(IAccountingLedgerService accountingLedgerService) : ControllerBase
{
    [HttpGet("summary")]
    public async Task<ActionResult<AccountingLedgerSummaryDto>> Summary(
        Guid tripId,
        CancellationToken cancellationToken)
    {
        var summary = await accountingLedgerService.GetTripSummaryAsync(tripId, cancellationToken);
        if (summary is null)
        {
            return NotFound();
        }

        return Ok(summary);
    }
}
