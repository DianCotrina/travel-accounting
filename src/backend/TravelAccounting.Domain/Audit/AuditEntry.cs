namespace TravelAccounting.Domain.Audit;

public sealed class AuditEntry
{
    public Guid Id { get; private set; }
    public string UserId { get; private set; }
    public AuditAction Action { get; private set; }
    public string EntityType { get; private set; }
    public Guid EntityId { get; private set; }
    public DateTimeOffset Timestamp { get; private set; }
    public string Changes { get; private set; }

    public AuditEntry(
        Guid id,
        string userId,
        AuditAction action,
        string entityType,
        Guid entityId,
        DateTimeOffset timestamp,
        string changes)
    {
        if (id == Guid.Empty)
        {
            throw new ArgumentException("Audit entry id cannot be empty.", nameof(id));
        }

        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new ArgumentException("User id cannot be empty.", nameof(userId));
        }

        if (string.IsNullOrWhiteSpace(entityType))
        {
            throw new ArgumentException("Entity type cannot be empty.", nameof(entityType));
        }

        if (entityId == Guid.Empty)
        {
            throw new ArgumentException("Entity id cannot be empty.", nameof(entityId));
        }

        if (timestamp == default)
        {
            throw new ArgumentException("Timestamp is required.", nameof(timestamp));
        }

        if (string.IsNullOrWhiteSpace(changes))
        {
            throw new ArgumentException("Changes payload cannot be empty.", nameof(changes));
        }

        Id = id;
        UserId = userId.Trim();
        Action = action;
        EntityType = entityType.Trim().ToUpperInvariant();
        EntityId = entityId;
        Timestamp = timestamp;
        Changes = changes;
    }

    private AuditEntry()
    {
        UserId = string.Empty;
        EntityType = string.Empty;
        Changes = "{}";
    }
}
