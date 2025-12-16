// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using System.ComponentModel.DataAnnotations;

namespace Vult.Core.Models;

public class User
{
    public Guid UserId { get; set; }
    
    [Required]
    [StringLength(100, ErrorMessage = "Username cannot exceed 100 characters")]
    public string Username { get; set; } = string.Empty;
    
    [Required]
    [StringLength(255, ErrorMessage = "Email cannot exceed 255 characters")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public string PasswordHash { get; set; } = string.Empty;
    
    [StringLength(100, ErrorMessage = "First name cannot exceed 100 characters")]
    public string? FirstName { get; set; }
    
    [StringLength(100, ErrorMessage = "Last name cannot exceed 100 characters")]
    public string? LastName { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedDate { get; set; }
    
    public DateTime UpdatedDate { get; set; }
    
    public DateTime? LastLoginDate { get; set; }
    
    // Navigation properties
    public ICollection<Role> Roles { get; set; } = new List<Role>();
}
