// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Vult.Core;

namespace Vult.Api.Features.Users;

public static class UserExtensions
{
    public static UserDto ToDto(this User user)
    {
        DateTime? lockExpiresAt = null;
        if (user.LockedAt.HasValue && user.LockDurationTicks.HasValue)
        {
            lockExpiresAt = user.LockedAt.Value.AddTicks(user.LockDurationTicks.Value);
        }

        return new UserDto
        {
            UserId = user.UserId,
            Username = user.Username,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Status = user.Status.ToString(),
            CreatedDate = user.CreatedDate,
            UpdatedDate = user.UpdatedDate,
            LastLoginDate = user.LastLoginDate,
            ActivatedAt = user.ActivatedAt,
            ActivationMethod = user.ActivationMethod.ToString(),
            DeactivatedAt = user.DeactivatedAt,
            DeactivationReason = user.DeactivationReason,
            LockedAt = user.LockedAt,
            LockReason = user.LockReason,
            LockExpiresAt = lockExpiresAt,
            DeletedAt = user.DeletedAt,
            DeletionType = user.DeletionType.ToString(),
            DeletionReason = user.DeletionReason,
            CanRecover = user.CanRecover,
            Roles = user.Roles?.Select(r => r.ToDto()).ToList() ?? new()
        };
    }

    public static RoleDto ToDto(this Role role)
    {
        return new RoleDto
        {
            RoleId = role.RoleId,
            Name = role.Name,
            Description = role.Description
        };
    }

    public static void UpdateFromDto(this User user, UpdateUserDto dto)
    {
        if (dto.FirstName != null)
        {
            user.FirstName = dto.FirstName;
        }

        if (dto.LastName != null)
        {
            user.LastName = dto.LastName;
        }

        user.UpdatedDate = DateTime.UtcNow;
    }
}
