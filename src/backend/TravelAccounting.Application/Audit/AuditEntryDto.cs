namespace TravelAccounting.Application.Audit;

public sealed record AuditEntryDto(
    Guid Id,
    string UserId,
    string Action,
    string EntityType,
    Guid EntityId,
    DateTimeOffset Timestamp,
    string Changes);
