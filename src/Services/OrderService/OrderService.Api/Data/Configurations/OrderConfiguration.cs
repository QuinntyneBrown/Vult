// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OrderService.Api.Model;

namespace OrderService.Api.Data.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("Orders");
        builder.HasKey(e => e.OrderId);

        builder.Property(e => e.OrderNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(e => e.OrderNumber)
            .IsUnique();

        builder.Property(e => e.CustomerEmail)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(e => e.Status)
            .IsRequired()
            .HasConversion<string>();

        builder.Property(e => e.SubTotal)
            .HasColumnType("decimal(18,2)");

        builder.Property(e => e.Tax)
            .HasColumnType("decimal(18,2)");

        builder.Property(e => e.ShippingCost)
            .HasColumnType("decimal(18,2)");

        builder.Property(e => e.Total)
            .HasColumnType("decimal(18,2)");

        builder.Property(e => e.Currency)
            .HasMaxLength(10);

        builder.Property(e => e.ShippingFullName).HasMaxLength(200);
        builder.Property(e => e.ShippingAddressLine1).HasMaxLength(200);
        builder.Property(e => e.ShippingAddressLine2).HasMaxLength(200);
        builder.Property(e => e.ShippingCity).HasMaxLength(100);
        builder.Property(e => e.ShippingProvince).HasMaxLength(100);
        builder.Property(e => e.ShippingPostalCode).HasMaxLength(20);
        builder.Property(e => e.ShippingCountry).HasMaxLength(100);
        builder.Property(e => e.ShippingPhone).HasMaxLength(50);

        builder.Property(e => e.BillingFullName).HasMaxLength(200);
        builder.Property(e => e.BillingAddressLine1).HasMaxLength(200);
        builder.Property(e => e.BillingAddressLine2).HasMaxLength(200);
        builder.Property(e => e.BillingCity).HasMaxLength(100);
        builder.Property(e => e.BillingProvince).HasMaxLength(100);
        builder.Property(e => e.BillingPostalCode).HasMaxLength(20);
        builder.Property(e => e.BillingCountry).HasMaxLength(100);
        builder.Property(e => e.BillingPhone).HasMaxLength(50);

        builder.Property(e => e.CreatedDate).IsRequired();
        builder.Property(e => e.UpdatedDate).IsRequired();

        builder.HasMany(e => e.LineItems)
            .WithOne(e => e.Order)
            .HasForeignKey(e => e.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

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
            .HasColumnType("decimal(18,2)");

        builder.Ignore(e => e.SubTotal);
    }
}
