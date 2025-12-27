// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;
using Vult.Core.Model.UserAggregate;
using Vult.Core.Services;

namespace Vult.Api.Features.Users;

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, UserDto>
{
    private readonly IVultContext _context;
    private readonly IPasswordHasher _passwordHasher;

    public CreateUserCommandHandler(IVultContext context, IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<UserDto> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == request.Username, cancellationToken);

        if (existingUser != null)
        {
            throw new InvalidOperationException("Username already exists");
        }

        var salt = _passwordHasher.GenerateSalt();
        var hashedPassword = _passwordHasher.HashPassword(request.Password, salt);

        var roles = await _context.Roles
            .Where(r => request.Roles.Contains(r.Name))
            .ToListAsync(cancellationToken);

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Username = request.Username,
            Password = hashedPassword,
            Salt = salt,
            Roles = roles
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        return user.ToDto();
    }
}
