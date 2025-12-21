// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.Users;

public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, UserDto?>
{
    private readonly IVultContext _context;

    public UpdateUserCommandHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<UserDto?> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
            .ThenInclude(r => r.Privileges)
            .FirstOrDefaultAsync(u => u.UserId == request.UserId && !u.IsDeleted, cancellationToken);

        if (user == null)
        {
            return null;
        }

        if (!string.IsNullOrEmpty(request.Username) && request.Username != user.Username)
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username, cancellationToken);

            if (existingUser != null)
            {
                throw new InvalidOperationException("Username already exists");
            }

            user.Username = request.Username;
        }

        if (request.Roles != null)
        {
            var roles = await _context.Roles
                .Where(r => request.Roles.Contains(r.Name))
                .ToListAsync(cancellationToken);

            user.Roles.Clear();
            foreach (var role in roles)
            {
                user.Roles.Add(role);
            }
        }

        await _context.SaveChangesAsync(cancellationToken);

        return user.ToDto();
    }
}
