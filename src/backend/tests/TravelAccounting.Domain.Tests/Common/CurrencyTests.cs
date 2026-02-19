using TravelAccounting.Domain.Common;

namespace TravelAccounting.Domain.Tests.Common;

public sealed class CurrencyTests
{
    [Fact]
    public void Constructor_Normalizes_Code_To_Uppercase()
    {
        var currency = new Currency("ars");

        Assert.Equal("ARS", currency.Code);
    }

    [Fact]
    public void Constructor_Throws_When_Code_Is_Invalid_Length()
    {
        var action = () => _ = new Currency("US");

        Assert.Throws<ArgumentException>(action);
    }
}
