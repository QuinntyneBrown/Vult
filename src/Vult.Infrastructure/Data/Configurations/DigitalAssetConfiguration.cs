// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vult.Core.Model.DigitalAssetAggregate;

namespace Vult.Infrastructure.Data.Configurations;

public class DigitalAssetConfiguration : IEntityTypeConfiguration<DigitalAsset>
{
    public void Configure(EntityTypeBuilder<DigitalAsset> builder)
    {
        builder.ToTable("DigitalAssets");

        builder.HasKey(e => e.DigitalAssetId);

        builder.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(e => e.ContentType)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(e => e.Bytes)
            .IsRequired();

        builder.Property(e => e.Height)
            .IsRequired();

        builder.Property(e => e.Width)
            .IsRequired();

        builder.Property(e => e.CreatedDate)
            .IsRequired();

        // Create index on Name for faster filename lookups
        builder.HasIndex(e => e.Name);
    }
}
