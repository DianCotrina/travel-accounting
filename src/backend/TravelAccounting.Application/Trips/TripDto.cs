namespace TravelAccounting.Application.Trips;

public sealed record TripDto(
    Guid Id,
    string Name,
    string DestinationCountry,
    string HomeCurrency,
    string LocalCurrency,
    DateOnly StartDate,
    DateOnly EndDate,
    string Status);
