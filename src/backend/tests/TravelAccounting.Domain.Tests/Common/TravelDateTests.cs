using TravelAccounting.Domain.Common;

namespace TravelAccounting.Domain.Tests.Common;

public sealed class TravelDateTests
{
    [Fact]
    public void From_Returns_DateOnly_Portion()
    {
        var source = new DateTime(2026, 2, 18, 21, 30, 0, DateTimeKind.Utc);

        var travelDate = TravelDate.From(source);

        Assert.Equal(new DateOnly(2026, 2, 18), travelDate.Value);
    }
}
