// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.Users;

public class GetUserRolesQueryHandler : IRequestHandler<GetUserRolesQuery, GetUserRolesQueryResult>
{
    private readonly IVultContext _context;

    public GetUserRolesQueryHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<GetUserRolesQueryResult> Handle(GetUserRolesQuery query, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.UserId == query.UserId, cancellationToken);

        if (user == null)
        {
            return new GetUserRolesQueryResult { UserFound = false };
        }

        return new GetUserRolesQueryResult
        {
            Roles = user.Roles.Select(r => r.ToDto()).ToList(),
            UserFound = true
        };
    }
}
