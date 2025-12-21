// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Vult.Core;

namespace Vult.Api.Features.Users;

public static class UserExtensions
{
    public static UserDto ToDto(this User user)
    {
        return new UserDto
        {
            UserId = user.UserId,
            Username = user.Username,
            DefaultProfileId = user.DefaultProfileId,
            Roles = user.Roles.Select(r => r.ToDto()).ToList()
        };
    }

    public static RoleDto ToDto(this Role role)
    {
        return new RoleDto
        {
            RoleId = role.RoleId,
            Name = role.Name,
            Privileges = role.Privileges.Select(p => p.ToDto()).ToList()
        };
    }

    public static PrivilegeDto ToDto(this Privilege privilege)
    {
        return new PrivilegeDto
        {
            PrivilegeId = privilege.PrivilegeId,
            RoleId = privilege.RoleId,
            Aggregate = privilege.Aggregate,
            AccessRight = privilege.AccessRight
        };
    }
}
