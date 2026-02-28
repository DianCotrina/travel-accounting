using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TravelAccounting.Domain.Trips;
using TravelAccounting.Infrastructure.Data.Models;

namespace TravelAccounting.Infrastructure.Data.Configurations;

internal sealed class ExchangeRateConfiguration : IEntityTypeConfiguration<ExchangeRateEntity>
{
    public void Configure(EntityTypeBuilder<ExchangeRateEntity> builder)
    {
        builder.ToTable("exchange_rates");

        builder.HasKey(rate => new
        {
            rate.TripId,
            rate.Date,
            rate.FromCurrency,
            rate.ToCurrency
        });

        builder.Property(rate => rate.TripId)
            .HasColumnName("trip_id")
            .IsRequired();

        builder.Property(rate => rate.Date)
            .HasColumnName("date")
            .HasColumnType("date")
            .IsRequired();

        builder.Property(rate => rate.FromCurrency)
            .HasColumnName("from_currency")
            .HasMaxLength(3)
            .IsRequired();

        builder.Property(rate => rate.ToCurrency)
            .HasColumnName("to_currency")
            .HasMaxLength(3)
            .IsRequired();

        builder.Property(rate => rate.Rate)
            .HasColumnName("rate")
            .HasPrecision(18, 8)
            .IsRequired();

        builder.HasOne<Trip>()
            .WithMany()
            .HasForeignKey(rate => rate.TripId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(rate => rate.TripId)
            .HasDatabaseName("ix_exchange_rates_trip_id");
    }
}

