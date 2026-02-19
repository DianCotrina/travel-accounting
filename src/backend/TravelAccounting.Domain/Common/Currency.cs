namespace TravelAccounting.Domain.Common;

public sealed record Currency
{
    public string Code { get; }

    public Currency(string code)
    {
        if (string.IsNullOrWhiteSpace(code))
        {
            throw new ArgumentException("Currency code cannot be empty.", nameof(code));
        }

        var normalizedCode = code.Trim().ToUpperInvariant();

        if (normalizedCode.Length != 3)
        {
            throw new ArgumentException("Currency code must have 3 characters.", nameof(code));
        }

        Code = normalizedCode;
    }

    public override string ToString() => Code;
}
