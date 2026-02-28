using System.Text.Json.Nodes;

namespace TravelAccounting.Api.Audit;

public sealed record AuditEntryApiResponse(
    Guid Id,
    string UserId,
    string Action,
    string EntityType,
    Guid EntityId,
    DateTimeOffset Timestamp,
    JsonNode? Changes);
