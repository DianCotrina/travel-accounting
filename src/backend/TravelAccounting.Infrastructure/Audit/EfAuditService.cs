using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.EntityFrameworkCore;
using TravelAccounting.Application.Audit;
using TravelAccounting.Domain.Audit;
using TravelAccounting.Infrastructure.Data;

namespace TravelAccounting.Infrastructure.Audit;

internal sealed class EfAuditService(AppDbContext db, TimeProvider timeProvider) : IAuditService
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    public async Task LogAsync(
        string userId,
        AuditAction action,
        string entityType,
        Guid entityId,
        object? before,
        object? after,
        CancellationToken cancellationToken)
    {
        var entry = new AuditEntry(
            Guid.NewGuid(),
            userId,
            action,
            NormalizeEntityType(entityType),
            entityId,
            timeProvider.GetUtcNow(),
            BuildChangesPayload(before, after));

        await db.AuditEntries.AddAsync(entry, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<AuditEntryDto>> ListAsync(
        AuditQuery query,
        CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(query);

        var normalizedUserId = query.UserId.Trim();
        if (string.IsNullOrWhiteSpace(normalizedUserId))
        {
            throw new ArgumentException("User id cannot be empty.", nameof(query));
        }

        var auditEntries = db.AuditEntries.AsNoTracking()
            .Where(entry => entry.UserId == normalizedUserId);

        if (!string.IsNullOrWhiteSpace(query.EntityType))
        {
            var normalizedEntityType = NormalizeEntityType(query.EntityType);
            auditEntries = auditEntries.Where(entry => entry.EntityType == normalizedEntityType);
        }

        if (query.EntityId.HasValue)
        {
            auditEntries = auditEntries.Where(entry => entry.EntityId == query.EntityId.Value);
        }

        if (query.FromDate.HasValue)
        {
            auditEntries = auditEntries.Where(entry => entry.Timestamp >= query.FromDate.Value);
        }

        if (query.ToDate.HasValue)
        {
            auditEntries = auditEntries.Where(entry => entry.Timestamp <= query.ToDate.Value);
        }

        return await auditEntries
            .OrderByDescending(entry => entry.Timestamp)
            .Select(entry => new AuditEntryDto(
                entry.Id,
                entry.UserId,
                entry.Action.ToString(),
                entry.EntityType,
                entry.EntityId,
                entry.Timestamp,
                entry.Changes))
            .ToListAsync(cancellationToken);
    }

    private static string BuildChangesPayload(object? before, object? after)
    {
        var beforeNode = ToObject(before);
        var afterNode = ToObject(after);

        var keys = beforeNode.Select(property => property.Key)
            .Union(afterNode.Select(property => property.Key), StringComparer.Ordinal)
            .OrderBy(key => key, StringComparer.Ordinal);

        var diff = new JsonObject();
        foreach (var key in keys)
        {
            var beforeValue = beforeNode[key];
            var afterValue = afterNode[key];

            if (JsonNode.DeepEquals(beforeValue, afterValue))
            {
                continue;
            }

            diff[key] = new JsonObject
            {
                ["before"] = beforeValue?.DeepClone(),
                ["after"] = afterValue?.DeepClone(),
            };
        }

        return diff.ToJsonString(JsonOptions);
    }

    private static JsonObject ToObject(object? source)
    {
        if (source is null)
        {
            return new JsonObject();
        }

        var node = JsonSerializer.SerializeToNode(source, JsonOptions);
        return node as JsonObject
               ?? throw new InvalidOperationException(
                   $"Audit snapshot must serialize to a JSON object. Received '{source.GetType().Name}'.");
    }

    private static string NormalizeEntityType(string entityType)
    {
        if (string.IsNullOrWhiteSpace(entityType))
        {
            throw new ArgumentException("Entity type cannot be empty.", nameof(entityType));
        }

        return entityType.Trim().ToUpperInvariant();
    }
}
