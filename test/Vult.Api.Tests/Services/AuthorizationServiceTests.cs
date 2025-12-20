// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Vult.Api.Services;
using Vult.Core;
using Vult.Infrastructure.Data;

namespace Vult.Api.Tests.Services;

[TestFixture]
public class AuthorizationServiceTests
{
    private DbContextOptions<VultContext> _options = null!;

    [SetUp]
    public void Setup()
    {
        _options = new DbContextOptionsBuilder<VultContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
    }

    [Test]
    public async Task HasRoleAsync_UserHasRole_ShouldReturnTrue()
    {
        // Arrange
        using var context = new VultContext(_options);
        var service = new AuthorizationService(context);

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Username = "testuser",
            Email = "test@example.com",
            PasswordHash = "hash",
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        var role = new Role
        {
            RoleId = Guid.NewGuid(),
            Name = "Admin",
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        user.Roles.Add(role);
        context.Users.Add(user);
        context.Roles.Add(role);
        await context.SaveChangesAsync();

        // Act
        var hasRole = await service.HasRoleAsync(user.UserId, "Admin");

        // Assert
        Assert.That(hasRole, Is.True);
    }

    [Test]
    public async Task HasRoleAsync_UserDoesNotHaveRole_ShouldReturnFalse()
    {
        // Arrange
        using var context = new VultContext(_options);
        var service = new AuthorizationService(context);

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Username = "testuser",
            Email = "test@example.com",
            PasswordHash = "hash",
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();

        // Act
        var hasRole = await service.HasRoleAsync(user.UserId, "Admin");

        // Assert
        Assert.That(hasRole, Is.False);
    }

    [Test]
    public async Task HasRoleAsync_NonExistentUser_ShouldReturnFalse()
    {
        // Arrange
        using var context = new VultContext(_options);
        var service = new AuthorizationService(context);

        // Act
        var hasRole = await service.HasRoleAsync(Guid.NewGuid(), "Admin");

        // Assert
        Assert.That(hasRole, Is.False);
    }

    [Test]
    public async Task GetUserRolesAsync_UserWithMultipleRoles_ShouldReturnAllRoles()
    {
        // Arrange
        using var context = new VultContext(_options);
        var service = new AuthorizationService(context);

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Username = "testuser",
            Email = "test@example.com",
            PasswordHash = "hash",
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        var adminRole = new Role { RoleId = Guid.NewGuid(), Name = "Admin", CreatedDate = DateTime.UtcNow, UpdatedDate = DateTime.UtcNow };
        var userRole = new Role { RoleId = Guid.NewGuid(), Name = "User", CreatedDate = DateTime.UtcNow, UpdatedDate = DateTime.UtcNow };

        user.Roles.Add(adminRole);
        user.Roles.Add(userRole);

        context.Users.Add(user);
        context.Roles.Add(adminRole);
        context.Roles.Add(userRole);
        await context.SaveChangesAsync();

        // Act
        var roles = await service.GetUserRolesAsync(user.UserId);

        // Assert
        Assert.That(roles.Count(), Is.EqualTo(2));
        Assert.That(roles, Contains.Item("Admin"));
        Assert.That(roles, Contains.Item("User"));
    }

    [Test]
    public async Task GetUserRolesAsync_UserWithNoRoles_ShouldReturnEmptyList()
    {
        // Arrange
        using var context = new VultContext(_options);
        var service = new AuthorizationService(context);

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Username = "testuser",
            Email = "test@example.com",
            PasswordHash = "hash",
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();

        // Act
        var roles = await service.GetUserRolesAsync(user.UserId);

        // Assert
        Assert.That(roles.Count(), Is.EqualTo(0));
    }

    [Test]
    public async Task GetUserRolesAsync_NonExistentUser_ShouldReturnEmptyList()
    {
        // Arrange
        using var context = new VultContext(_options);
        var service = new AuthorizationService(context);

        // Act
        var roles = await service.GetUserRolesAsync(Guid.NewGuid());

        // Assert
        Assert.That(roles.Count(), Is.EqualTo(0));
    }

    [Test]
    public async Task AssignRoleAsync_ExistingRole_ShouldAssignToUser()
    {
        // Arrange
        using var context = new VultContext(_options);
        var service = new AuthorizationService(context);

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Username = "testuser",
            Email = "test@example.com",
            PasswordHash = "hash",
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        var role = new Role
        {
            RoleId = Guid.NewGuid(),
            Name = "Admin",
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        context.Users.Add(user);
        context.Roles.Add(role);
        await context.SaveChangesAsync();

        // Act
        var result = await service.AssignRoleAsync(user.UserId, "Admin");

        // Assert
        Assert.That(result, Is.True);
        var updatedUser = await context.Users.Include(u => u.Roles).FirstAsync(u => u.UserId == user.UserId);
        Assert.That(updatedUser.Roles.Any(r => r.Name == "Admin"), Is.True);
    }

    [Test]
    public async Task AssignRoleAsync_NewRole_ShouldCreateAndAssignRole()
    {
        // Arrange
        using var context = new VultContext(_options);
        var service = new AuthorizationService(context);

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Username = "testuser",
            Email = "test@example.com",
            PasswordHash = "hash",
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();

        // Act
        var result = await service.AssignRoleAsync(user.UserId, "NewRole");

        // Assert
        Assert.That(result, Is.True);
        var updatedUser = await context.Users.Include(u => u.Roles).FirstAsync(u => u.UserId == user.UserId);
        Assert.That(updatedUser.Roles.Any(r => r.Name == "NewRole"), Is.True);
        
        var role = await context.Roles.FirstOrDefaultAsync(r => r.Name == "NewRole");
        Assert.That(role, Is.Not.Null);
    }

    [Test]
    public async Task AssignRoleAsync_RoleAlreadyAssigned_ShouldReturnTrue()
    {
        // Arrange
        using var context = new VultContext(_options);
        var service = new AuthorizationService(context);

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Username = "testuser",
            Email = "test@example.com",
            PasswordHash = "hash",
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        var role = new Role
        {
            RoleId = Guid.NewGuid(),
            Name = "Admin",
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        user.Roles.Add(role);
        context.Users.Add(user);
        context.Roles.Add(role);
        await context.SaveChangesAsync();

        // Act
        var result = await service.AssignRoleAsync(user.UserId, "Admin");

        // Assert
        Assert.That(result, Is.True);
    }

    [Test]
    public async Task AssignRoleAsync_NonExistentUser_ShouldReturnFalse()
    {
        // Arrange
        using var context = new VultContext(_options);
        var service = new AuthorizationService(context);

        // Act
        var result = await service.AssignRoleAsync(Guid.NewGuid(), "Admin");

        // Assert
        Assert.That(result, Is.False);
    }

    [Test]
    public async Task RemoveRoleAsync_UserHasRole_ShouldRemoveRole()
    {
        // Arrange
        using var context = new VultContext(_options);
        var service = new AuthorizationService(context);

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Username = "testuser",
            Email = "test@example.com",
            PasswordHash = "hash",
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        var role = new Role
        {
            RoleId = Guid.NewGuid(),
            Name = "Admin",
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        user.Roles.Add(role);
        context.Users.Add(user);
        context.Roles.Add(role);
        await context.SaveChangesAsync();

        // Act
        var result = await service.RemoveRoleAsync(user.UserId, "Admin");

        // Assert
        Assert.That(result, Is.True);
        var updatedUser = await context.Users.Include(u => u.Roles).FirstAsync(u => u.UserId == user.UserId);
        Assert.That(updatedUser.Roles.Any(r => r.Name == "Admin"), Is.False);
    }

    [Test]
    public async Task RemoveRoleAsync_UserDoesNotHaveRole_ShouldReturnFalse()
    {
        // Arrange
        using var context = new VultContext(_options);
        var service = new AuthorizationService(context);

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Username = "testuser",
            Email = "test@example.com",
            PasswordHash = "hash",
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();

        // Act
        var result = await service.RemoveRoleAsync(user.UserId, "Admin");

        // Assert
        Assert.That(result, Is.False);
    }

    [Test]
    public async Task RemoveRoleAsync_NonExistentUser_ShouldReturnFalse()
    {
        // Arrange
        using var context = new VultContext(_options);
        var service = new AuthorizationService(context);

        // Act
        var result = await service.RemoveRoleAsync(Guid.NewGuid(), "Admin");

        // Assert
        Assert.That(result, Is.False);
    }
}
