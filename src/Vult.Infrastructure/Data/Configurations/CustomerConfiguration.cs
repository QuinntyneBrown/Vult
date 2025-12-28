// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vult.Core.Model.CustomerAggregate;

namespace Vult.Infrastructure.Data.Configurations;

public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable("Customers");

        builder.HasKey(e => e.CustomerId);

        builder.Property(e => e.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(e => e.LastName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(e => e.Phone)
            .HasMaxLength(20);

        builder.Property(e => e.CreatedDate)
            .IsRequired();

        builder.Property(e => e.UpdatedDate)
            .IsRequired();

        // Configure relationship with CustomerAddresses
        builder.HasMany(e => e.Addresses)
            .WithOne(e => e.Customer)
            .HasForeignKey(e => e.CustomerId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
