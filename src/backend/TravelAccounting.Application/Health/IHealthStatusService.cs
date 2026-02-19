namespace TravelAccounting.Application.Health;

public interface IHealthStatusService
{
    HealthStatusResponse GetStatus();
}
