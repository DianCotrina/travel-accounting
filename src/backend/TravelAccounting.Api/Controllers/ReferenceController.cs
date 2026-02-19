using Microsoft.AspNetCore.Mvc;
using TravelAccounting.Application.Reference;

namespace TravelAccounting.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ReferenceController(ICountryReferenceService countryReferenceService) : ControllerBase
{
    [HttpGet("countries")]
    public ActionResult<IReadOnlyList<CountryReferenceDto>> Countries()
    {
        return Ok(countryReferenceService.ListCountries());
    }
}
