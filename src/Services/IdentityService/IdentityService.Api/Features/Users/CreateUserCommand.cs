// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using IdentityService.Api.Data;
using IdentityService.Api.Model;
using IdentityService.Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Vult.Messaging.Events;
using Vult.Messaging.PubSub;

namespace IdentityService.Api.Features.Users;

public class CreateUserCommand : IRequest<UserDto?>
{
    public CreateUserDto User { get; set; } = null!;
}

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, UserDto?>
{
    private readonly IdentityDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IEventPublisher _eventPublisher;
    private readonly ILogger<CreateUserCommandHandler> _logger;

    public CreateUserCommandHandler(
        IdentityDbContext context,
        IPasswordHasher passwordHasher,
        IEventPublisher eventPublisher,
        ILogger<CreateUserCommandHandler> logger)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _eventPublisher = eventPublisher;
        _logger = logger;
    }

    public async Task<UserDto?> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        // Check if username already exists
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == request.User.Username, cancellationToken);

        if (existingUser != null)
        {
            _logger.LogWarning("User creation failed: username {Username} already exists", request.User.Username);
            return null;
        }

        var salt = _passwordHasher.GenerateSalt();
        var hashedPassword = _passwordHasher.HashPassword(request.User.Password, salt);

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Username = request.User.Username,
            Email = request.User.Email,
            IsEmailVerified = false,
            Salt = salt,
            Password = hashedPassword,
            IsDeleted = false,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        // Assign roles if provided
        if (request.User.RoleIds != null && request.User.RoleIds.Any())
        {
            var roles = await _context.Roles
                .Where(r => request.User.RoleIds.Contains(r.RoleId))
                .ToListAsync(cancellationToken);
            user.Roles = roles;
        }
        else
        {
            // Default to User role
            var userRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "User", cancellationToken);
            if (userRole != null)
            {
                user.Roles = new List<Role> { userRole };
            }
        }

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        // Reload with roles and privileges
        await _context.Entry(user).Collection(u => u.Roles).LoadAsync(cancellationToken);
        foreach (var role in user.Roles)
        {
            await _context.Entry(role).Collection(r => r.Privileges).LoadAsync(cancellationToken);
        }

        // Publish integration event
        var integrationEvent = new UserCreatedEvent
        {
            UserId = user.UserId,
            Username = user.Username,
            Email = user.Email,
            Roles = user.Roles.Select(r => r.Name).ToList()
        };

        try
        {
            await _eventPublisher.PublishAsync(integrationEvent, cancellationToken);
            _logger.LogInformation("Published UserCreatedEvent for user {UserId}", user.UserId);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to publish UserCreatedEvent for user {UserId}", user.UserId);
        }

        return user.ToDto();
    }
}
