using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TravelAccounting.Domain.Common;
using TravelAccounting.Domain.Trips;

namespace TravelAccounting.Infrastructure.Data.Configurations;

internal sealed class TripConfiguration : IEntityTypeConfiguration<Trip>
{
    public void Configure(EntityTypeBuilder<Trip> builder)
    {
        builder.ToTable("trips");

        builder.HasKey(trip => trip.Id);

        builder.Property(trip => trip.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(trip => trip.OwnerUserId)
            .HasColumnName("owner_user_id")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(trip => trip.Name)
            .HasColumnName("name")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(trip => trip.DestinationCountry)
            .HasColumnName("destination_country")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(trip => trip.HomeCurrency)
            .HasColumnName("home_currency")
            .HasMaxLength(3)
            .IsRequired()
            .HasConversion(currency => currency.Code, code => new Currency(code));

        builder.Property(trip => trip.LocalCurrency)
            .HasColumnName("local_currency")
            .HasMaxLength(3)
            .IsRequired()
            .HasConversion(currency => currency.Code, code => new Currency(code));

        builder.Property(trip => trip.StartDate)
            .HasColumnName("start_date")
            .HasColumnType("date")
            .IsRequired()
            .HasConversion(date => date.Value, value => new TravelDate(value));

        builder.Property(trip => trip.EndDate)
            .HasColumnName("end_date")
            .HasColumnType("date")
            .IsRequired()
            .HasConversion(date => date.Value, value => new TravelDate(value));

        builder.Property(trip => trip.Status)
            .HasColumnName("status")
            .HasConversion<short>()
            .IsRequired();

        builder.HasIndex(trip => trip.OwnerUserId)
            .HasDatabaseName("ix_trips_owner_user_id");
    }
}

