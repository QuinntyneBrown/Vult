// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Api.Features.Users;
using Vult.Core;

namespace Vult.Api.Features.Roles;

public class GetRolesQueryHandler : IRequestHandler<GetRolesQuery, GetRolesQueryResponse>
{
    private readonly IVultContext _context;

    public GetRolesQueryHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<GetRolesQueryResponse> Handle(GetRolesQuery request, CancellationToken cancellationToken)
    {
        var roles = await _context.Roles
            .Include(r => r.Privileges)
            .ToListAsync(cancellationToken);

        return new GetRolesQueryResponse
        {
            Roles = roles.Select(r => r.ToDto()).ToList()
        };
    }
}
