using System.ComponentModel.DataAnnotations;

namespace TravelAccounting.Api.Expenses;

public sealed class UpsertExpenseRequest
{
    [Required]
    public string Category { get; init; } = string.Empty;

    [Range(typeof(decimal), "0.01", "999999999")]
    public decimal Amount { get; init; }

    [Required]
    public string Currency { get; init; } = string.Empty;

    public DateTimeOffset OccurredAtUtc { get; init; }

    [Required]
    public string Notes { get; init; } = string.Empty;
}
