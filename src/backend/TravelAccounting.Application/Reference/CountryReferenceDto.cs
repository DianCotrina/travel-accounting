namespace TravelAccounting.Application.Reference;

public sealed record CountryReferenceDto(
    string CountryCode,
    string CountryName,
    string CurrencyCode,
    string CurrencyName);
