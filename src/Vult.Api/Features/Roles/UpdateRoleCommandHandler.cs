// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Api.Features.Users;
using Vult.Core;

namespace Vult.Api.Features.Roles;

public class UpdateRoleCommandHandler : IRequestHandler<UpdateRoleCommand, RoleDto?>
{
    private readonly IVultContext _context;

    public UpdateRoleCommandHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<RoleDto?> Handle(UpdateRoleCommand request, CancellationToken cancellationToken)
    {
        var role = await _context.Roles
            .Include(r => r.Privileges)
            .FirstOrDefaultAsync(r => r.RoleId == request.RoleId, cancellationToken);

        if (role == null)
        {
            return null;
        }

        // Check if new name conflicts with another role
        var existingRole = await _context.Roles
            .FirstOrDefaultAsync(r => r.Name == request.Name && r.RoleId != request.RoleId, cancellationToken);

        if (existingRole != null)
        {
            throw new InvalidOperationException("Role name already exists");
        }

        role.Name = request.Name;

        // Remove privileges that are no longer in the request
        var requestPrivilegeIds = request.Privileges
            .Where(p => p.PrivilegeId.HasValue)
            .Select(p => p.PrivilegeId!.Value)
            .ToList();

        var privilegesToRemove = role.Privileges
            .Where(p => !requestPrivilegeIds.Contains(p.PrivilegeId))
            .ToList();

        foreach (var privilege in privilegesToRemove)
        {
            role.Privileges.Remove(privilege);
            _context.Privileges.Remove(privilege);
        }

        // Update existing and add new privileges
        foreach (var privilegeDto in request.Privileges)
        {
            if (privilegeDto.PrivilegeId.HasValue)
            {
                var existingPrivilege = role.Privileges
                    .FirstOrDefault(p => p.PrivilegeId == privilegeDto.PrivilegeId.Value);

                if (existingPrivilege != null)
                {
                    existingPrivilege.Aggregate = privilegeDto.Aggregate;
                    existingPrivilege.AccessRight = privilegeDto.AccessRight;
                }
            }
            else
            {
                role.Privileges.Add(new Privilege
                {
                    PrivilegeId = Guid.NewGuid(),
                    RoleId = role.RoleId,
                    Aggregate = privilegeDto.Aggregate,
                    AccessRight = privilegeDto.AccessRight
                });
            }
        }

        await _context.SaveChangesAsync(cancellationToken);

        return role.ToDto();
    }
}
