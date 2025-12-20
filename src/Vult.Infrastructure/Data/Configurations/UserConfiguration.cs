// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vult.Core;

namespace Vult.Infrastructure.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");

        builder.HasKey(u => u.UserId);

        builder.Property(u => u.Username)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(u => u.Username)
            .IsUnique();

        builder.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(255);

        builder.HasIndex(u => u.Email)
            .IsUnique();

        builder.Property(u => u.PasswordHash)
            .IsRequired();

        builder.Property(u => u.FirstName)
            .HasMaxLength(100);

        builder.Property(u => u.LastName)
            .HasMaxLength(100);

        builder.Property(u => u.Status)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(u => u.CreatedDate)
            .IsRequired();

        builder.Property(u => u.UpdatedDate)
            .IsRequired();

        builder.Property(u => u.ActivationMethod)
            .HasConversion<string>()
            .HasMaxLength(30);

        builder.Property(u => u.DeactivationReason)
            .HasMaxLength(500);

        builder.Property(u => u.LockReason)
            .HasMaxLength(500);

        builder.Property(u => u.DeletionType)
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(u => u.DeletionReason)
            .HasMaxLength(500);

        builder.Property(u => u.FailedLoginAttempts)
            .HasDefaultValue(0);

        // Ignore computed properties
        builder.Ignore(u => u.IsLockExpired);
        builder.Ignore(u => u.CanRecover);

        // Configure many-to-many relationship with Role
        builder.HasMany(u => u.Roles)
            .WithMany(r => r.Users)
            .UsingEntity<Dictionary<string, object>>(
                "UserRole",
                j => j.HasOne<Role>().WithMany().HasForeignKey("RoleId"),
                j => j.HasOne<User>().WithMany().HasForeignKey("UserId"));
    }
}
