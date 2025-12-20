// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.Users;

public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, UpdateUserCommandResult>
{
    private readonly IVultContext _context;

    public UpdateUserCommandHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<UpdateUserCommandResult> Handle(UpdateUserCommand command, CancellationToken cancellationToken)
    {
        var result = new UpdateUserCommandResult();

        var user = await _context.Users
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.UserId == command.UserId, cancellationToken);

        if (user == null)
        {
            result.Errors.Add("User not found");
            return result;
        }

        if (user.Status == UserStatus.Deleted)
        {
            result.Errors.Add("Cannot update a deleted user");
            return result;
        }

        user.UpdateFromDto(command.User);

        if (command.User.RoleIds != null)
        {
            var roles = await _context.Roles
                .Where(r => command.User.RoleIds.Contains(r.RoleId))
                .ToListAsync(cancellationToken);

            user.Roles.Clear();
            foreach (var role in roles)
            {
                user.Roles.Add(role);
            }
        }

        await _context.SaveChangesAsync(cancellationToken);

        result.Success = true;
        result.User = user.ToDto();

        return result;
    }
}
