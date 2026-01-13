// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

namespace IdentityService.Api.Model;

public class User
{
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool IsEmailVerified { get; set; }
    public string Password { get; set; } = string.Empty;
    public byte[] Salt { get; set; } = Array.Empty<byte>();
    public Guid? CurrentProfileId { get; set; }
    public Guid? DefaultProfileId { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }

    public ICollection<Role> Roles { get; set; } = new List<Role>();
}

public class Role
{
    public Guid RoleId { get; set; }
    public string Name { get; set; } = string.Empty;
    public ICollection<User> Users { get; set; } = new List<User>();
    public ICollection<Privilege> Privileges { get; set; } = new List<Privilege>();
}

public class Privilege
{
    public Guid PrivilegeId { get; set; }
    public Guid RoleId { get; set; }
    public string Aggregate { get; set; } = string.Empty;
    public AccessRight AccessRight { get; set; }
    public Role? Role { get; set; }
}

public enum AccessRight
{
    None = 0,
    Read = 1,
    Write = 2,
    Create = 3,
    Delete = 4
}
