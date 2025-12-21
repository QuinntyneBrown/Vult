// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vult.Core;

namespace Vult.Infrastructure.Data.Configurations;

public class PrivilegeConfiguration : IEntityTypeConfiguration<Privilege>
{
    public void Configure(EntityTypeBuilder<Privilege> builder)
    {
        builder.HasKey(p => p.PrivilegeId);

        builder.Property(p => p.Aggregate)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(p => new { p.RoleId, p.Aggregate, p.AccessRight })
            .IsUnique();
    }
}
