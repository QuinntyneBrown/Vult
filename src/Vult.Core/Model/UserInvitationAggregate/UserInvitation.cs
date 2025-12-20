// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using System.ComponentModel.DataAnnotations;

namespace Vult.Core;

public class UserInvitation
{
    public Guid UserInvitationId { get; set; }

    [Required]
    [StringLength(255, ErrorMessage = "Email cannot exceed 255 characters")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Token { get; set; } = string.Empty;

    public Guid InvitedByUserId { get; set; }

    public DateTime SentAt { get; set; }

    public DateTime ExpiresAt { get; set; }

    public DateTime? AcceptedAt { get; set; }

    public Guid? AcceptedByUserId { get; set; }

    public bool IsAccepted { get; set; }

    public bool IsExpired => DateTime.UtcNow > ExpiresAt && !IsAccepted;

    public bool IsCancelled { get; set; }

    public DateTime? CancelledAt { get; set; }

    [StringLength(1000)]
    public string? RoleIds { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime UpdatedDate { get; set; }

    // Navigation properties
    public User? InvitedByUser { get; set; }

    public User? AcceptedByUser { get; set; }
}
