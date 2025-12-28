// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vult.Core.Model.OrderAggregate;

namespace Vult.Infrastructure.Data.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("Orders");

        builder.HasKey(e => e.OrderId);

        builder.Property(e => e.OrderNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(e => e.CustomerEmail)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(e => e.Status)
            .IsRequired()
            .HasConversion<string>();

        builder.Property(e => e.SubTotal)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.Property(e => e.Tax)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.Property(e => e.ShippingCost)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.Property(e => e.Total)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.Property(e => e.Currency)
            .IsRequired()
            .HasMaxLength(3);

        builder.Property(e => e.ShippingFullName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(e => e.ShippingAddressLine1)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(e => e.ShippingAddressLine2)
            .HasMaxLength(200);

        builder.Property(e => e.ShippingCity)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(e => e.ShippingProvince)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(e => e.ShippingPostalCode)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(e => e.ShippingCountry)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(e => e.ShippingPhone)
            .HasMaxLength(20);

        builder.Property(e => e.BillingFullName)
            .HasMaxLength(200);

        builder.Property(e => e.BillingAddressLine1)
            .HasMaxLength(200);

        builder.Property(e => e.BillingAddressLine2)
            .HasMaxLength(200);

        builder.Property(e => e.BillingCity)
            .HasMaxLength(100);

        builder.Property(e => e.BillingProvince)
            .HasMaxLength(100);

        builder.Property(e => e.BillingPostalCode)
            .HasMaxLength(20);

        builder.Property(e => e.BillingCountry)
            .HasMaxLength(100);

        builder.Property(e => e.BillingPhone)
            .HasMaxLength(20);

        builder.Property(e => e.StripePaymentIntentId)
            .HasMaxLength(255);

        builder.Property(e => e.StripePaymentStatus)
            .HasMaxLength(50);

        builder.Property(e => e.PaymentErrorMessage)
            .HasMaxLength(500);

        builder.Property(e => e.CreatedDate)
            .IsRequired();

        builder.Property(e => e.UpdatedDate)
            .IsRequired();

        // Configure relationship with LineItems
        builder.HasMany(e => e.LineItems)
            .WithOne(e => e.Order)
            .HasForeignKey(e => e.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
