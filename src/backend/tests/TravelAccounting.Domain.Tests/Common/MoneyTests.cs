using TravelAccounting.Domain.Common;

namespace TravelAccounting.Domain.Tests.Common;

public sealed class MoneyTests
{
    [Fact]
    public void Add_Throws_When_Currencies_Differ()
    {
        var usd = new Money(10m, new Currency("USD"));
        var ars = new Money(20m, new Currency("ARS"));

        var action = () => usd.Add(ars);

        Assert.Throws<InvalidOperationException>(action);
    }

    [Fact]
    public void Add_Returns_Sum_When_Currencies_Match()
    {
        var left = new Money(10.25m, new Currency("USD"));
        var right = new Money(5.10m, new Currency("USD"));

        var result = left.Add(right);

        Assert.Equal(15.35m, result.Amount);
        Assert.Equal("USD", result.Currency.Code);
    }
}
