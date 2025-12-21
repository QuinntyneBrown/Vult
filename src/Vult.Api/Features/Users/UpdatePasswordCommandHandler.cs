// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.Users;

public class UpdatePasswordCommandHandler : IRequestHandler<UpdatePasswordCommand, bool>
{
    private readonly IVultContext _context;
    private readonly IPasswordHasher _passwordHasher;

    public UpdatePasswordCommandHandler(IVultContext context, IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<bool> Handle(UpdatePasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.UserId == request.UserId && !u.IsDeleted, cancellationToken);

        if (user == null)
        {
            return false;
        }

        var newSalt = _passwordHasher.GenerateSalt();
        user.Salt = newSalt;
        user.Password = _passwordHasher.HashPassword(request.Password, newSalt);

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
