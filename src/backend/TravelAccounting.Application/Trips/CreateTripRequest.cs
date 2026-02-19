namespace TravelAccounting.Application.Trips;

public sealed record CreateTripRequest(
    string Name,
    string DestinationCountry,
    string HomeCurrency,
    string LocalCurrency,
    DateOnly StartDate,
    DateOnly EndDate);
