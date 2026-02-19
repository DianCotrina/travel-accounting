namespace TravelAccounting.Application.Health;

public sealed record HealthStatusResponse(string Status, DateTimeOffset UtcNow);
