// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Api.Features.Users;
using Vult.Core;

namespace Vult.Api.Features.Roles;

public class CreateRoleCommandHandler : IRequestHandler<CreateRoleCommand, RoleDto>
{
    private readonly IVultContext _context;

    public CreateRoleCommandHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<RoleDto> Handle(CreateRoleCommand request, CancellationToken cancellationToken)
    {
        var existingRole = await _context.Roles
            .FirstOrDefaultAsync(r => r.Name == request.Name, cancellationToken);

        if (existingRole != null)
        {
            throw new InvalidOperationException("Role name already exists");
        }

        var role = new Role
        {
            RoleId = Guid.NewGuid(),
            Name = request.Name,
            Privileges = request.Privileges.Select(p => new Privilege
            {
                PrivilegeId = Guid.NewGuid(),
                Aggregate = p.Aggregate,
                AccessRight = p.AccessRight
            }).ToList()
        };

        _context.Roles.Add(role);
        await _context.SaveChangesAsync(cancellationToken);

        return role.ToDto();
    }
}
