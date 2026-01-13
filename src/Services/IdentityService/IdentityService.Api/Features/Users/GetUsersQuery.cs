// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using IdentityService.Api.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IdentityService.Api.Features.Users;

public class GetUsersQuery : IRequest<List<UserDto>>
{
    public bool IncludeDeleted { get; set; } = false;
}

public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, List<UserDto>>
{
    private readonly IdentityDbContext _context;

    public GetUsersQueryHandler(IdentityDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Users
            .Include(u => u.Roles)
                .ThenInclude(r => r.Privileges)
            .AsQueryable();

        if (!request.IncludeDeleted)
        {
            query = query.Where(u => !u.IsDeleted);
        }

        var users = await query.ToListAsync(cancellationToken);
        return users.Select(u => u.ToDto()).ToList();
    }
}
