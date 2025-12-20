// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.Users;

public class RestoreUserCommandHandler : IRequestHandler<RestoreUserCommand, RestoreUserCommandResult>
{
    private readonly IVultContext _context;

    public RestoreUserCommandHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<RestoreUserCommandResult> Handle(RestoreUserCommand command, CancellationToken cancellationToken)
    {
        var result = new RestoreUserCommandResult();

        var user = await _context.Users
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.UserId == command.UserId, cancellationToken);

        if (user == null)
        {
            result.Errors.Add("User not found");
            return result;
        }

        if (user.Status != UserStatus.Deleted)
        {
            result.Errors.Add("User is not deleted");
            return result;
        }

        if (!user.CanRecover)
        {
            result.Errors.Add("User cannot be recovered. The 30-day recovery window has expired.");
            return result;
        }

        user.Status = UserStatus.Inactive;
        user.DeletedAt = null;
        user.DeletionType = DeletionType.None;
        user.DeletionReason = null;
        user.UpdatedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        result.Success = true;
        result.User = user.ToDto();

        return result;
    }
}
