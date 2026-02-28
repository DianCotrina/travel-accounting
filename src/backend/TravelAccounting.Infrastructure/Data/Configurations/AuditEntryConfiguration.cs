using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TravelAccounting.Domain.Audit;

namespace TravelAccounting.Infrastructure.Data.Configurations;

internal sealed class AuditEntryConfiguration : IEntityTypeConfiguration<AuditEntry>
{
    public void Configure(EntityTypeBuilder<AuditEntry> builder)
    {
        builder.ToTable("audit_entries");

        builder.HasKey(entry => entry.Id);

        builder.Property(entry => entry.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(entry => entry.UserId)
            .HasColumnName("user_id")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(entry => entry.Action)
            .HasColumnName("action")
            .HasConversion<short>()
            .IsRequired();

        builder.Property(entry => entry.EntityType)
            .HasColumnName("entity_type")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(entry => entry.EntityId)
            .HasColumnName("entity_id")
            .IsRequired();

        builder.Property(entry => entry.Timestamp)
            .HasColumnName("timestamp")
            .IsRequired();

        builder.Property(entry => entry.Changes)
            .HasColumnName("changes")
            .HasColumnType("jsonb")
            .IsRequired();

        builder.HasIndex(entry => entry.UserId)
            .HasDatabaseName("ix_audit_entries_user_id");

        builder.HasIndex(entry => new { entry.EntityType, entry.EntityId })
            .HasDatabaseName("ix_audit_entries_entity");

        builder.HasIndex(entry => entry.Timestamp)
            .HasDatabaseName("ix_audit_entries_timestamp");
    }
}
