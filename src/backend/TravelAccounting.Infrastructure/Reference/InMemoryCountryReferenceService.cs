using TravelAccounting.Application.Reference;

namespace TravelAccounting.Infrastructure.Reference;

internal sealed class InMemoryCountryReferenceService : ICountryReferenceService
{
    private static readonly IReadOnlyList<CountryReferenceDto> Countries =
    [
        new("AR", "Argentina", "ARS", "Argentine Peso"),
        new("US", "United States", "USD", "US Dollar"),
        new("BR", "Brazil", "BRL", "Brazilian Real"),
        new("CL", "Chile", "CLP", "Chilean Peso"),
        new("MX", "Mexico", "MXN", "Mexican Peso"),
        new("CO", "Colombia", "COP", "Colombian Peso"),
    ];

    public IReadOnlyList<CountryReferenceDto> ListCountries() => Countries;
}
