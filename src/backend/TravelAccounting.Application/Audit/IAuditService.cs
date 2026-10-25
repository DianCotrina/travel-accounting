using TravelAccounting.Domain.Audit;

namespace TravelAccounting.Application.Audit;

public interface IAuditService
{
    Task LogAsync(
        string userId,
        AuditAction action,
        string entityType,
        Guid entityId,
        object? before,
        object? after,
        CancellationToken cancellationToken);

    Task<IReadOnlyList<AuditEntryDto>> ListAsync(
        AuditQuery query,
        CancellationToken cancellationToken);
}
