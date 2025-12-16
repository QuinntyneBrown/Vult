using Microsoft.EntityFrameworkCore;
using Vult.Core.Models;

namespace Vult.Core.Interfaces;

public interface IVultContext
{
    DbSet<CatalogItem> CatalogItems { get; set; }
    DbSet<CatalogItemImage> CatalogItemImages { get; set; }
    
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
