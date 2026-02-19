namespace TravelAccounting.Domain.Common;

public sealed record Money
{
    public decimal Amount { get; }
    public Currency Currency { get; }

    public Money(decimal amount, Currency currency)
    {
        Currency = currency ?? throw new ArgumentNullException(nameof(currency));
        Amount = decimal.Round(amount, 2, MidpointRounding.AwayFromZero);
    }

    public Money Add(Money other)
    {
        if (other is null)
        {
            throw new ArgumentNullException(nameof(other));
        }

        EnsureSameCurrency(other);
        return new Money(Amount + other.Amount, Currency);
    }

    public Money Subtract(Money other)
    {
        if (other is null)
        {
            throw new ArgumentNullException(nameof(other));
        }

        EnsureSameCurrency(other);
        return new Money(Amount - other.Amount, Currency);
    }

    private void EnsureSameCurrency(Money other)
    {
        if (Currency != other.Currency)
        {
            throw new InvalidOperationException(
                $"Currency mismatch. Expected {Currency.Code}, received {other.Currency.Code}.");
        }
    }
}
