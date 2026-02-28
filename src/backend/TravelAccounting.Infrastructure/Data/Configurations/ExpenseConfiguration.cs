using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TravelAccounting.Domain.Common;
using TravelAccounting.Domain.Expenses;
using TravelAccounting.Domain.Trips;

namespace TravelAccounting.Infrastructure.Data.Configurations;

internal sealed class ExpenseConfiguration : IEntityTypeConfiguration<Expense>
{
    public void Configure(EntityTypeBuilder<Expense> builder)
    {
        builder.ToTable("expenses");

        builder.HasKey(expense => expense.Id);

        builder.Property(expense => expense.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(expense => expense.TripId)
            .HasColumnName("trip_id")
            .IsRequired();

        builder.Property(expense => expense.Category)
            .HasColumnName("category")
            .HasConversion<short>()
            .IsRequired();

        builder.OwnsOne(expense => expense.Amount, money =>
        {
            money.Property(value => value.Amount)
                .HasColumnName("amount")
                .HasPrecision(18, 2)
                .IsRequired();

            money.Property(value => value.Currency)
                .HasColumnName("currency_code")
                .HasMaxLength(3)
                .IsRequired()
                .HasConversion(currency => currency.Code, code => new Currency(code));
        });
        builder.Navigation(expense => expense.Amount).IsRequired();

        builder.Property(expense => expense.OccurredAtUtc)
            .HasColumnName("occurred_at_utc")
            .IsRequired();

        builder.Property(expense => expense.Notes)
            .HasColumnName("notes")
            .HasMaxLength(2000)
            .IsRequired();

        builder.HasOne<Trip>()
            .WithMany()
            .HasForeignKey(expense => expense.TripId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(expense => expense.TripId)
            .HasDatabaseName("ix_expenses_trip_id");
    }
}

