// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.Users;

public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, GetUserByIdQueryResult>
{
    private readonly IVultContext _context;

    public GetUserByIdQueryHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<GetUserByIdQueryResult> Handle(GetUserByIdQuery query, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.UserId == query.UserId, cancellationToken);

        if (user == null)
        {
            return new GetUserByIdQueryResult { Found = false };
        }

        return new GetUserByIdQueryResult
        {
            User = user.ToDto(),
            Found = true
        };
    }
}
