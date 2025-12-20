// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Services;

public class AuthorizationService : IAuthorizationService
{
    private readonly IVultContext _context;

    public AuthorizationService(IVultContext context)
    {
        _context = context;
    }

    public async Task<bool> HasRoleAsync(Guid userId, string roleName, CancellationToken cancellationToken = default)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.UserId == userId, cancellationToken);

        if (user == null)
        {
            return false;
        }

        return user.Roles.Any(r => r.Name.Equals(roleName, StringComparison.OrdinalIgnoreCase));
    }

    public async Task<IEnumerable<string>> GetUserRolesAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.UserId == userId, cancellationToken);

        if (user == null)
        {
            return Enumerable.Empty<string>();
        }

        return user.Roles.Select(r => r.Name).ToList();
    }

    public async Task<bool> AssignRoleAsync(Guid userId, string roleName, CancellationToken cancellationToken = default)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.UserId == userId, cancellationToken);

        if (user == null)
        {
            return false;
        }

        var role = await _context.Roles
            .FirstOrDefaultAsync(r => r.Name == roleName, cancellationToken);

        if (role == null)
        {
            // Create the role if it doesn't exist
            role = new Role
            {
                RoleId = Guid.NewGuid(),
                Name = roleName,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            };
            _context.Roles.Add(role);
        }

        // Check if user already has the role
        if (user.Roles.Any(r => r.RoleId == role.RoleId))
        {
            return true;
        }

        user.Roles.Add(role);
        user.UpdatedDate = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }

    public async Task<bool> RemoveRoleAsync(Guid userId, string roleName, CancellationToken cancellationToken = default)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.UserId == userId, cancellationToken);

        if (user == null)
        {
            return false;
        }

        var role = user.Roles.FirstOrDefault(r => r.Name.Equals(roleName, StringComparison.OrdinalIgnoreCase));
        if (role == null)
        {
            return false;
        }

        user.Roles.Remove(role);
        user.UpdatedDate = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
