// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using System.ComponentModel.DataAnnotations;

namespace Vult.Api.Features.UserInvitations;

public class SendUserInvitationDto
{
    [Required]
    [EmailAddress]
    [StringLength(255, ErrorMessage = "Email cannot exceed 255 characters")]
    public string Email { get; set; } = string.Empty;

    public List<Guid>? RoleIds { get; set; }
}
