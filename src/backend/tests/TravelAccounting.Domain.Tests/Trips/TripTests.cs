using TravelAccounting.Domain.Common;
using TravelAccounting.Domain.Trips;

namespace TravelAccounting.Domain.Tests.Trips;

public sealed class TripTests
{
    [Fact]
    public void Constructor_Throws_When_EndDate_Is_Before_StartDate()
    {
        var action = () => _ = new Trip(
            Guid.NewGuid(),
            "test-user",
            "Argentina Vacation",
            "Argentina",
            new Currency("USD"),
            new Currency("ARS"),
            new TravelDate(new DateOnly(2026, 3, 10)),
            new TravelDate(new DateOnly(2026, 3, 9)));

        Assert.Throws<ArgumentException>(action);
    }

    [Fact]
    public void Archive_Changes_Status_To_Archived()
    {
        var trip = new Trip(
            Guid.NewGuid(),
            "test-user",
            "Argentina Vacation",
            "Argentina",
            new Currency("USD"),
            new Currency("ARS"),
            new TravelDate(new DateOnly(2026, 3, 10)),
            new TravelDate(new DateOnly(2026, 3, 20)));

        trip.Archive();

        Assert.Equal(TripStatus.Archived, trip.Status);
    }
}
