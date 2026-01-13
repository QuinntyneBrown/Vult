// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using IdentityService.Api.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Messaging.Events;
using Vult.Messaging.PubSub;

namespace IdentityService.Api.Features.Users;

public class DeleteUserCommand : IRequest<bool>
{
    public Guid UserId { get; set; }
}

public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, bool>
{
    private readonly IdentityDbContext _context;
    private readonly IEventPublisher _eventPublisher;
    private readonly ILogger<DeleteUserCommandHandler> _logger;

    public DeleteUserCommandHandler(
        IdentityDbContext context,
        IEventPublisher eventPublisher,
        ILogger<DeleteUserCommandHandler> logger)
    {
        _context = context;
        _eventPublisher = eventPublisher;
        _logger = logger;
    }

    public async Task<bool> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.UserId == request.UserId && !u.IsDeleted, cancellationToken);

        if (user == null)
        {
            return false;
        }

        // Soft delete
        user.IsDeleted = true;
        user.UpdatedDate = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        // Publish integration event
        var integrationEvent = new UserDeletedEvent
        {
            UserId = user.UserId
        };

        try
        {
            await _eventPublisher.PublishAsync(integrationEvent, cancellationToken);
            _logger.LogInformation("Published UserDeletedEvent for user {UserId}", user.UserId);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to publish UserDeletedEvent for user {UserId}", user.UserId);
        }

        return true;
    }
}
