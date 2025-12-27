// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vult.Core;

namespace Vult.Infrastructure.Data.Configurations;

public class TestimonialConfiguration : IEntityTypeConfiguration<Testimonial>
{
    public void Configure(EntityTypeBuilder<Testimonial> builder)
    {
        builder.ToTable("Testimonials");

        builder.HasKey(e => e.TestimonialId);

        builder.Property(e => e.CustomerName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(e => e.PhotoUrl)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(e => e.Rating)
            .IsRequired();

        builder.Property(e => e.Text)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(e => e.CreatedDate)
            .IsRequired();

        builder.Property(e => e.UpdatedDate)
            .IsRequired();
    }
}
