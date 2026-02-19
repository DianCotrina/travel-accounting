using TravelAccounting.Domain.Common;

namespace TravelAccounting.Domain.Expenses;

public sealed class Expense
{
    public Guid Id { get; }
    public Guid TripId { get; }
    public ExpenseCategory Category { get; private set; }
    public Money Amount { get; private set; }
    public DateTimeOffset OccurredAtUtc { get; private set; }
    public string Notes { get; private set; }

    public Expense(
        Guid id,
        Guid tripId,
        ExpenseCategory category,
        Money amount,
        DateTimeOffset occurredAtUtc,
        string notes)
    {
        if (id == Guid.Empty)
        {
            throw new ArgumentException("Expense id cannot be empty.", nameof(id));
        }

        if (tripId == Guid.Empty)
        {
            throw new ArgumentException("Trip id cannot be empty.", nameof(tripId));
        }

        if (occurredAtUtc == default)
        {
            throw new ArgumentException("Occurrence date is required.", nameof(occurredAtUtc));
        }

        if (string.IsNullOrWhiteSpace(notes))
        {
            throw new ArgumentException("Notes cannot be empty.", nameof(notes));
        }

        Id = id;
        TripId = tripId;
        Category = category;
        Amount = amount ?? throw new ArgumentNullException(nameof(amount));
        OccurredAtUtc = occurredAtUtc;
        Notes = notes.Trim();
    }

    public void Update(
        ExpenseCategory category,
        Money amount,
        DateTimeOffset occurredAtUtc,
        string notes)
    {
        if (occurredAtUtc == default)
        {
            throw new ArgumentException("Occurrence date is required.", nameof(occurredAtUtc));
        }

        if (string.IsNullOrWhiteSpace(notes))
        {
            throw new ArgumentException("Notes cannot be empty.", nameof(notes));
        }

        Category = category;
        Amount = amount ?? throw new ArgumentNullException(nameof(amount));
        OccurredAtUtc = occurredAtUtc;
        Notes = notes.Trim();
    }
}
