// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vult.Core;

namespace Vult.Infrastructure.Data.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");

        builder.HasKey(e => e.ProductId);

        builder.Property(e => e.Description)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(e => e.Size)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(e => e.BrandName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(e => e.EstimatedMSRP)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.Property(e => e.EstimatedResaleValue)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.Property(e => e.Gender)
            .IsRequired()
            .HasConversion<string>();

        builder.Property(e => e.ItemType)
            .IsRequired()
            .HasConversion<string>();

        builder.Property(e => e.CreatedDate)
            .IsRequired();

        builder.Property(e => e.UpdatedDate)
            .IsRequired();

        // Configure relationship with ProductImages
        builder.HasMany(e => e.ProductImages)
            .WithOne(e => e.Product)
            .HasForeignKey(e => e.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
