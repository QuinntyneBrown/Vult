// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Core;

namespace Vult.Api.Features.Users;

public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, DeleteUserCommandResult>
{
    private readonly IVultContext _context;

    public DeleteUserCommandHandler(IVultContext context)
    {
        _context = context;
    }

    public async Task<DeleteUserCommandResult> Handle(DeleteUserCommand command, CancellationToken cancellationToken)
    {
        var result = new DeleteUserCommandResult();

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.UserId == command.UserId, cancellationToken);

        if (user == null)
        {
            result.Errors.Add("User not found");
            return result;
        }

        if (user.Status == UserStatus.Deleted)
        {
            result.Errors.Add("User is already deleted");
            return result;
        }

        if (string.IsNullOrWhiteSpace(command.Data.Reason))
        {
            result.Errors.Add("Deletion reason is mandatory");
            return result;
        }

        if (command.Data.HardDelete)
        {
            _context.Users.Remove(user);
        }
        else
        {
            user.Status = UserStatus.Deleted;
            user.DeletedAt = DateTime.UtcNow;
            user.DeletionType = DeletionType.Soft;
            user.DeletionReason = command.Data.Reason;
            user.UpdatedDate = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync(cancellationToken);

        result.Success = true;

        return result;
    }
}
