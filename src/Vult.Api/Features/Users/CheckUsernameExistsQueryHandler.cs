// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.Users;

public class CheckUsernameExistsQueryHandler : IRequestHandler<CheckUsernameExistsQuery, bool>
{
    private readonly IVultContext _context;

    public CheckUsernameExistsQueryHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(CheckUsernameExistsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Users
            .AnyAsync(u => u.Username.ToLower() == request.Username.ToLower(), cancellationToken);
    }
}
