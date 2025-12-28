// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vult.Core.Model.OrderAggregate;

namespace Vult.Infrastructure.Data.Configurations;

public class LineItemConfiguration : IEntityTypeConfiguration<LineItem>
{
    public void Configure(EntityTypeBuilder<LineItem> builder)
    {
        builder.ToTable("LineItems");

        builder.HasKey(e => e.LineItemId);

        builder.Property(e => e.ProductName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(e => e.ProductSize)
            .HasMaxLength(50);

        builder.Property(e => e.ProductImageUrl)
            .HasMaxLength(500);

        builder.Property(e => e.UnitPrice)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.Property(e => e.Quantity)
            .IsRequired();

        // SubTotal is a computed property, so we ignore it
        builder.Ignore(e => e.SubTotal);
    }
}
