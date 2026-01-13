// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using DigitalAssetService.Api.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalAssetService.Api.Data.Configurations;

public class DigitalAssetConfiguration : IEntityTypeConfiguration<DigitalAsset>
{
    public void Configure(EntityTypeBuilder<DigitalAsset> builder)
    {
        builder.ToTable("DigitalAssets");
        builder.HasKey(e => e.DigitalAssetId);

        builder.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(256);

        builder.HasIndex(e => e.Name);

        builder.Property(e => e.Bytes)
            .IsRequired();

        builder.Property(e => e.ContentType)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(e => e.CreatedDate)
            .IsRequired();
    }
}
