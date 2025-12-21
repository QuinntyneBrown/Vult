// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vult.Core;

namespace Vult.Infrastructure.Data.Configurations;

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.HasKey(r => r.RoleId);

        builder.Property(r => r.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(r => r.Name)
            .IsUnique();

        builder.HasMany(r => r.Privileges)
            .WithOne(p => p.Role)
            .HasForeignKey(p => p.RoleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
