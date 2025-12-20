// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;

namespace Vult.Core;

public interface IVultContext
{
    DbSet<CatalogItem> CatalogItems { get; set; }
    DbSet<CatalogItemImage> CatalogItemImages { get; set; }
    DbSet<User> Users { get; set; }
    DbSet<Role> Roles { get; set; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
