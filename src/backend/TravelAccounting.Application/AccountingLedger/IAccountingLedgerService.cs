namespace TravelAccounting.Application.AccountingLedger;

public interface IAccountingLedgerService
{
    Task<AccountingLedgerSummaryDto?> GetTripSummaryAsync(Guid tripId, CancellationToken cancellationToken);
}
