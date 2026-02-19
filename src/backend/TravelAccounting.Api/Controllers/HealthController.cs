using Microsoft.AspNetCore.Mvc;
using TravelAccounting.Application.Health;

namespace TravelAccounting.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class HealthController(IHealthStatusService healthStatusService) : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(healthStatusService.GetStatus());
    }
}
