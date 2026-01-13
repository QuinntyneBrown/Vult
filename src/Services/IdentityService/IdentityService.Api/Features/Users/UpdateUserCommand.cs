// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using IdentityService.Api.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Messaging.Events;
using Vult.Messaging.PubSub;

namespace IdentityService.Api.Features.Users;

public class UpdateUserCommand : IRequest<UserDto?>
{
    public Guid UserId { get; set; }
    public UpdateUserDto User { get; set; } = null!;
}

public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, UserDto?>
{
    private readonly IdentityDbContext _context;
    private readonly IEventPublisher _eventPublisher;
    private readonly ILogger<UpdateUserCommandHandler> _logger;

    public UpdateUserCommandHandler(
        IdentityDbContext context,
        IEventPublisher eventPublisher,
        ILogger<UpdateUserCommandHandler> logger)
    {
        _context = context;
        _eventPublisher = eventPublisher;
        _logger = logger;
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

        if (request.User.Email != null)
        {
            user.Email = request.User.Email;
        }

        if (request.User.IsEmailVerified.HasValue)
        {
            user.IsEmailVerified = request.User.IsEmailVerified.Value;
        }

        if (request.User.RoleIds != null)
        {
            var roles = await _context.Roles
                .Where(r => request.User.RoleIds.Contains(r.RoleId))
                .ToListAsync(cancellationToken);
            user.Roles.Clear();
            foreach (var role in roles)
            {
                user.Roles.Add(role);
            }
        }

        user.UpdatedDate = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        // Publish integration event
        var integrationEvent = new UserUpdatedEvent
        {
            UserId = user.UserId,
            Username = user.Username,
            Email = user.Email,
            Roles = user.Roles.Select(r => r.Name).ToList()
        };

        try
        {
            await _eventPublisher.PublishAsync(integrationEvent, cancellationToken);
            _logger.LogInformation("Published UserUpdatedEvent for user {UserId}", user.UserId);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to publish UserUpdatedEvent for user {UserId}", user.UserId);
        }

        return user.ToDto();
    }
}
