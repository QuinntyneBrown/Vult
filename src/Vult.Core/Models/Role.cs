using System.ComponentModel.DataAnnotations;

namespace Vult.Core.Models;

public class Role
{
    public Guid RoleId { get; set; }
    
    [Required]
    [StringLength(50, ErrorMessage = "Role name cannot exceed 50 characters")]
    public string Name { get; set; } = string.Empty;
    
    [StringLength(200, ErrorMessage = "Description cannot exceed 200 characters")]
    public string? Description { get; set; }
    
    public DateTime CreatedDate { get; set; }
    
    public DateTime UpdatedDate { get; set; }
    
    // Navigation properties
    public ICollection<User> Users { get; set; } = new List<User>();
}
