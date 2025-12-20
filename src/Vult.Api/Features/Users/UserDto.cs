// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

namespace Vult.Api.Features.Users;

public class UserDto
{
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
    public DateTime? LastLoginDate { get; set; }
    public DateTime? ActivatedAt { get; set; }
    public string? ActivationMethod { get; set; }
    public DateTime? DeactivatedAt { get; set; }
    public string? DeactivationReason { get; set; }
    public DateTime? LockedAt { get; set; }
    public string? LockReason { get; set; }
    public DateTime? LockExpiresAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public string? DeletionType { get; set; }
    public string? DeletionReason { get; set; }
    public bool CanRecover { get; set; }
    public List<RoleDto> Roles { get; set; } = new();
}
