using System.ComponentModel.DataAnnotations;
using Vult.Core.Enums;

namespace Vult.Core.Models;

public class CatalogItem
{
    public Guid Id { get; set; }
    
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Estimated MSRP must be greater than 0")]
    public decimal EstimatedMSRP { get; set; }
    
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Estimated Resale Value must be greater than 0")]
    public decimal EstimatedResaleValue { get; set; }
    
    [Required]
    [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    [StringLength(50, ErrorMessage = "Size cannot exceed 50 characters")]
    public string Size { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100, ErrorMessage = "Brand Name cannot exceed 100 characters")]
    public string BrandName { get; set; } = string.Empty;
    
    [Required]
    public Gender Gender { get; set; }
    
    [Required]
    public ClothingType ClothingType { get; set; }
    
    public DateTime CreatedDate { get; set; }
    
    public DateTime UpdatedDate { get; set; }
    
    // Navigation property
    public ICollection<CatalogItemImage> CatalogItemImages { get; set; } = new List<CatalogItemImage>();
}
