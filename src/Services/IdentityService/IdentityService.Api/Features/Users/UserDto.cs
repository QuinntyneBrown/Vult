// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using IdentityService.Api.Model;

namespace IdentityService.Api.Features.Users;

public class UserDto
{
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool IsEmailVerified { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
    public List<RoleDto> Roles { get; set; } = new();
}

public class RoleDto
{
    public Guid RoleId { get; set; }
    public string Name { get; set; } = string.Empty;
    public List<PrivilegeDto> Privileges { get; set; } = new();
}

public class PrivilegeDto
{
    public Guid PrivilegeId { get; set; }
    public string Aggregate { get; set; } = string.Empty;
    public AccessRight AccessRight { get; set; }
}

public class CreateUserDto
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public List<Guid>? RoleIds { get; set; }
}

public class UpdateUserDto
{
    public string? Email { get; set; }
    public bool? IsEmailVerified { get; set; }
    public List<Guid>? RoleIds { get; set; }
}

public class LoginDto
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginResultDto
{
    public string Token { get; set; } = string.Empty;
    public UserDto User { get; set; } = null!;
}

public class ChangePasswordDto
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}

public static class UserExtensions
{
    public static UserDto ToDto(this User user)
    {
        return new UserDto
        {
            UserId = user.UserId,
            Username = user.Username,
            Email = user.Email,
            IsEmailVerified = user.IsEmailVerified,
            CreatedDate = user.CreatedDate,
            UpdatedDate = user.UpdatedDate,
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
            Aggregate = privilege.Aggregate,
            AccessRight = privilege.AccessRight
        };
    }
}
