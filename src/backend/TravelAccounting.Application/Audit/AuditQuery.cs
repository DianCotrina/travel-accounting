namespace TravelAccounting.Application.Audit;

public sealed record AuditQuery(
    string? EntityType,
    Guid? EntityId,
    string UserId,
    DateTimeOffset? FromDate,
    DateTimeOffset? ToDate);
