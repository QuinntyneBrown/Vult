// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.Users;

public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, GetUsersQueryResponse>
{
    private readonly IVultContext _context;

    public GetUsersQueryHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<GetUsersQueryResponse> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await _context.Users
            .Include(u => u.Roles)
            .ThenInclude(r => r.Privileges)
            .Where(u => !u.IsDeleted)
            .ToListAsync(cancellationToken);

        return new GetUsersQueryResponse
        {
            Users = users.Select(u => u.ToDto()).ToList()
        };
    }
}
