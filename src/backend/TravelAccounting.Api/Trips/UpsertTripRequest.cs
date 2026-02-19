using System.ComponentModel.DataAnnotations;

namespace TravelAccounting.Api.Trips;

public sealed class UpsertTripRequest
{
    [Required]
    public string Name { get; init; } = string.Empty;

    [Required]
    public string DestinationCountry { get; init; } = string.Empty;

    [Required]
    public string HomeCurrency { get; init; } = string.Empty;

    [Required]
    public string LocalCurrency { get; init; } = string.Empty;

    public DateOnly StartDate { get; init; }

    public DateOnly EndDate { get; init; }
}
