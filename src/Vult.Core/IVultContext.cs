// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Vult.Core.Model.ProductAggregate;
using Vult.Core.Model.TestimonialAggregate;
using Vult.Core.Model.UserAggregate;

namespace Vult.Core;

public interface IVultContext
{
    DbSet<Product> Products { get; set; }
    DbSet<ProductImage> ProductImages { get; set; }
    DbSet<User> Users { get; set; }
    DbSet<Role> Roles { get; set; }
    DbSet<Privilege> Privileges { get; set; }
    DbSet<Testimonial> Testimonials { get; set; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
