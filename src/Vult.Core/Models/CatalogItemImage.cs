namespace Vult.Core.Models;

public class CatalogItemImage
{
    public Guid Id { get; set; }
    public Guid CatalogItemId { get; set; }
    public string Url { get; set; } = string.Empty;
    public string AltText { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
    
    // Navigation property
    public CatalogItem? CatalogItem { get; set; }
}
