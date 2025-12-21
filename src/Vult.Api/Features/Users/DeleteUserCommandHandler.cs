// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.Users;

public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, bool>
{
    private readonly IVultContext _context;

    public DeleteUserCommandHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.UserId == request.UserId && !u.IsDeleted, cancellationToken);

        if (user == null)
        {
            return false;
        }

        user.IsDeleted = true;
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
