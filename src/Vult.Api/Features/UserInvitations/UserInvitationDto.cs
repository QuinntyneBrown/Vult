// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

namespace Vult.Api.Features.UserInvitations;

public class UserInvitationDto
{
    public Guid UserInvitationId { get; set; }
    public string Email { get; set; } = string.Empty;
    public Guid InvitedByUserId { get; set; }
    public string? InvitedByUsername { get; set; }
    public DateTime SentAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime? AcceptedAt { get; set; }
    public Guid? AcceptedByUserId { get; set; }
    public bool IsAccepted { get; set; }
    public bool IsExpired { get; set; }
    public bool IsCancelled { get; set; }
    public DateTime? CancelledAt { get; set; }
    public List<Guid> RoleIds { get; set; } = new();
    public DateTime CreatedDate { get; set; }
}
