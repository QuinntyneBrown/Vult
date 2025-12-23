// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.Roles;

public class DeleteRoleCommandHandler : IRequestHandler<DeleteRoleCommand, bool>
{
    private readonly IVultContext _context;

    public DeleteRoleCommandHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteRoleCommand request, CancellationToken cancellationToken)
    {
        var role = await _context.Roles
            .Include(r => r.Privileges)
            .FirstOrDefaultAsync(r => r.RoleId == request.RoleId, cancellationToken);

        if (role == null)
        {
            return false;
        }

        // Remove all privileges associated with this role
        foreach (var privilege in role.Privileges.ToList())
        {
            _context.Privileges.Remove(privilege);
        }

        _context.Roles.Remove(role);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
