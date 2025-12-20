// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using System.ComponentModel.DataAnnotations;

namespace Vult.Core;

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

    public UserStatus Status { get; set; } = UserStatus.Active;

    public DateTime CreatedDate { get; set; }

    public DateTime UpdatedDate { get; set; }

    public DateTime? LastLoginDate { get; set; }

    public DateTime? ActivatedAt { get; set; }

    public ActivationMethod ActivationMethod { get; set; } = ActivationMethod.None;

    public DateTime? DeactivatedAt { get; set; }

    [StringLength(500, ErrorMessage = "Deactivation reason cannot exceed 500 characters")]
    public string? DeactivationReason { get; set; }

    public DateTime? LockedAt { get; set; }

    [StringLength(500, ErrorMessage = "Lock reason cannot exceed 500 characters")]
    public string? LockReason { get; set; }

    public long? LockDurationTicks { get; set; }

    public int FailedLoginAttempts { get; set; }

    public DateTime? LastFailedLoginAttempt { get; set; }

    public DateTime? DeletedAt { get; set; }

    public DeletionType DeletionType { get; set; } = DeletionType.None;

    [StringLength(500, ErrorMessage = "Deletion reason cannot exceed 500 characters")]
    public string? DeletionReason { get; set; }

    // Navigation properties
    public ICollection<Role> Roles { get; set; } = new List<Role>();

    // Helper properties
    public bool IsLockExpired => LockedAt.HasValue && LockDurationTicks.HasValue &&
        DateTime.UtcNow > LockedAt.Value.AddTicks(LockDurationTicks.Value);

    public bool CanRecover => DeletionType == DeletionType.Soft && DeletedAt.HasValue &&
        DateTime.UtcNow < DeletedAt.Value.AddDays(30);
}
