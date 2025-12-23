// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Api.Features.Users;
using Vult.Core;

namespace Vult.Api.Features.Roles;

public class GetRoleByIdQueryHandler : IRequestHandler<GetRoleByIdQuery, RoleDto?>
{
    private readonly IVultContext _context;

    public GetRoleByIdQueryHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<RoleDto?> Handle(GetRoleByIdQuery request, CancellationToken cancellationToken)
    {
        var role = await _context.Roles
            .Include(r => r.Privileges)
            .FirstOrDefaultAsync(r => r.RoleId == request.RoleId, cancellationToken);

        return role?.ToDto();
    }
}
