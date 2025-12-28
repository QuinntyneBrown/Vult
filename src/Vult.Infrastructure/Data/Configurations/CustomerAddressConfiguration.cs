// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vult.Core.Model.CustomerAggregate;

namespace Vult.Infrastructure.Data.Configurations;

public class CustomerAddressConfiguration : IEntityTypeConfiguration<CustomerAddress>
{
    public void Configure(EntityTypeBuilder<CustomerAddress> builder)
    {
        builder.ToTable("CustomerAddresses");

        builder.HasKey(e => e.CustomerAddressId);

        builder.Property(e => e.Label)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(e => e.FullName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(e => e.AddressLine1)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(e => e.AddressLine2)
            .HasMaxLength(200);

        builder.Property(e => e.City)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(e => e.Province)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(e => e.PostalCode)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(e => e.Country)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(e => e.Phone)
            .HasMaxLength(20);

        builder.Property(e => e.CreatedDate)
            .IsRequired();

        builder.Property(e => e.UpdatedDate)
            .IsRequired();
    }
}
