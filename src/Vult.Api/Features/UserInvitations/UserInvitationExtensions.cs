// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using System.Text.Json;
using Vult.Core;

namespace Vult.Api.Features.UserInvitations;

public static class UserInvitationExtensions
{
    public static UserInvitationDto ToDto(this UserInvitation invitation)
    {
        var roleIds = new List<Guid>();
        if (!string.IsNullOrEmpty(invitation.RoleIds))
        {
            try
            {
                roleIds = JsonSerializer.Deserialize<List<Guid>>(invitation.RoleIds) ?? new();
            }
            catch
            {
                roleIds = new List<Guid>();
            }
        }

        return new UserInvitationDto
        {
            UserInvitationId = invitation.UserInvitationId,
            Email = invitation.Email,
            InvitedByUserId = invitation.InvitedByUserId,
            InvitedByUsername = invitation.InvitedByUser?.Username,
            SentAt = invitation.SentAt,
            ExpiresAt = invitation.ExpiresAt,
            AcceptedAt = invitation.AcceptedAt,
            AcceptedByUserId = invitation.AcceptedByUserId,
            IsAccepted = invitation.IsAccepted,
            IsExpired = invitation.IsExpired,
            IsCancelled = invitation.IsCancelled,
            CancelledAt = invitation.CancelledAt,
            RoleIds = roleIds,
            CreatedDate = invitation.CreatedDate
        };
    }

    public static string SerializeRoleIds(List<Guid>? roleIds)
    {
        if (roleIds == null || roleIds.Count == 0)
        {
            return "[]";
        }
        return JsonSerializer.Serialize(roleIds);
    }

    public static List<Guid> DeserializeRoleIds(string? roleIds)
    {
        if (string.IsNullOrEmpty(roleIds))
        {
            return new List<Guid>();
        }

        try
        {
            return JsonSerializer.Deserialize<List<Guid>>(roleIds) ?? new();
        }
        catch
        {
            return new List<Guid>();
        }
    }
}
