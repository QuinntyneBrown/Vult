// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.Users;

public class DeactivateUserCommandHandler : IRequestHandler<DeactivateUserCommand, DeactivateUserCommandResult>
{
    private readonly IVultContext _context;

    public DeactivateUserCommandHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<DeactivateUserCommandResult> Handle(DeactivateUserCommand command, CancellationToken cancellationToken)
    {
        var result = new DeactivateUserCommandResult();

        var user = await _context.Users
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.UserId == command.UserId, cancellationToken);

        if (user == null)
        {
            result.Errors.Add("User not found");
            return result;
        }

        if (user.Status == UserStatus.Inactive)
        {
            result.Errors.Add("User is already inactive");
            return result;
        }

        if (user.Status == UserStatus.Deleted)
        {
            result.Errors.Add("Cannot deactivate a deleted user");
            return result;
        }

        if (string.IsNullOrWhiteSpace(command.Data.Reason))
        {
            result.Errors.Add("Reason is required for deactivation");
            return result;
        }

        user.Status = UserStatus.Inactive;
        user.DeactivatedAt = DateTime.UtcNow;
        user.DeactivationReason = command.Data.Reason;
        user.UpdatedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        result.Success = true;
        result.User = user.ToDto();

        return result;
    }
}
