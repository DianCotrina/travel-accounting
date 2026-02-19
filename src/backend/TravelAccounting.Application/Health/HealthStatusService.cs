namespace TravelAccounting.Application.Health;

internal sealed class HealthStatusService(TimeProvider timeProvider) : IHealthStatusService
{
    public HealthStatusResponse GetStatus()
    {
        return new HealthStatusResponse("ok", timeProvider.GetUtcNow());
    }
}
