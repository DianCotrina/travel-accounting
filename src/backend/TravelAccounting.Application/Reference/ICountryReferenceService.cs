namespace TravelAccounting.Application.Reference;

public interface ICountryReferenceService
{
    IReadOnlyList<CountryReferenceDto> ListCountries();
}
