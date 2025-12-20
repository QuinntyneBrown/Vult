// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vult.Core;

namespace Vult.Infrastructure.Data.Configurations;

public class UserInvitationConfiguration : IEntityTypeConfiguration<UserInvitation>
{
    public void Configure(EntityTypeBuilder<UserInvitation> builder)
    {
        builder.ToTable("UserInvitations");

        builder.HasKey(ui => ui.UserInvitationId);

        builder.Property(ui => ui.Email)
            .IsRequired()
            .HasMaxLength(255);

        builder.HasIndex(ui => ui.Email);

        builder.Property(ui => ui.Token)
            .IsRequired()
            .HasMaxLength(500);

        builder.HasIndex(ui => ui.Token)
            .IsUnique();

        builder.Property(ui => ui.InvitedByUserId)
            .IsRequired();

        builder.Property(ui => ui.SentAt)
            .IsRequired();

        builder.Property(ui => ui.ExpiresAt)
            .IsRequired();

        builder.Property(ui => ui.IsAccepted)
            .HasDefaultValue(false);

        builder.Property(ui => ui.IsCancelled)
            .HasDefaultValue(false);

        builder.Property(ui => ui.RoleIds)
            .HasMaxLength(1000);

        builder.Property(ui => ui.CreatedDate)
            .IsRequired();

        builder.Property(ui => ui.UpdatedDate)
            .IsRequired();

        // Ignore computed properties
        builder.Ignore(ui => ui.IsExpired);

        // Configure relationships
        builder.HasOne(ui => ui.InvitedByUser)
            .WithMany()
            .HasForeignKey(ui => ui.InvitedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(ui => ui.AcceptedByUser)
            .WithMany()
            .HasForeignKey(ui => ui.AcceptedByUserId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
