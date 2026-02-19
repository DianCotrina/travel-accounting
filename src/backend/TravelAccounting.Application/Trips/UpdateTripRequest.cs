namespace TravelAccounting.Application.Trips;

public sealed record UpdateTripRequest(
    string Name,
    string DestinationCountry,
    string HomeCurrency,
    string LocalCurrency,
    DateOnly StartDate,
    DateOnly EndDate);
