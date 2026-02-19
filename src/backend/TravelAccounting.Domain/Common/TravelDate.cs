namespace TravelAccounting.Domain.Common;

public readonly record struct TravelDate
{
    public DateOnly Value { get; }

    public TravelDate(DateOnly value)
    {
        Value = value;
    }

    public static TravelDate From(DateTime dateTime) => new(DateOnly.FromDateTime(dateTime));

    public override string ToString() => Value.ToString("yyyy-MM-dd");
}
