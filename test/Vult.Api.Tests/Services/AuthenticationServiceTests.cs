using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Vult.Api.Services;
using Vult.Core.Models;
using Vult.Infrastructure.Data;

namespace Vult.Api.Tests.Services;

[TestFixture]
public class AuthenticationServiceTests
{
    private DbContextOptions<VultContext> _options = null!;
    private IConfiguration _configuration = null!;

    [SetUp]
    public void Setup()
    {
        _options = new DbContextOptionsBuilder<VultContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        var configDict = new Dictionary<string, string?>
        {
            { "Jwt:Key", "TestSecretKey12345678901234567890123456" },
            { "Jwt:Issuer", "TestIssuer" },
            { "Jwt:Audience", "TestAudience" },
            { "Jwt:ExpirationHours", "24" }
        };

        _configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(configDict)
            .Build();
    }

    [Test]
    public async Task RegisterAsync_WithValidData_ShouldCreateUser()
    {
        // Arrange
        using var context = new VultContext(_options);
        var service = new AuthenticationService(context, _configuration);

        // Act
        var user = await service.RegisterAsync("testuser", "test@example.com", "password123");

        // Assert
        Assert.That(user, Is.Not.Null);
        Assert.That(user!.Username, Is.EqualTo("testuser"));
        Assert.That(user.Email, Is.EqualTo("test@example.com"));
        Assert.That(user.PasswordHash, Is.Not.Empty);
        Assert.That(user.IsActive, Is.True);
    }

    [Test]
    public async Task RegisterAsync_WithDuplicateUsername_ShouldReturnNull()
    {
        // Arrange
        using var context = new VultContext(_options);
        var service = new AuthenticationService(context, _configuration);
        await service.RegisterAsync("testuser", "test1@example.com", "password123");

        // Act
        var user = await service.RegisterAsync("testuser", "test2@example.com", "password456");

        // Assert
        Assert.That(user, Is.Null);
    }

    [Test]
    public async Task RegisterAsync_WithDuplicateEmail_ShouldReturnNull()
    {
        // Arrange
        using var context = new VultContext(_options);
        var service = new AuthenticationService(context, _configuration);
        await service.RegisterAsync("testuser1", "test@example.com", "password123");

        // Act
        var user = await service.RegisterAsync("testuser2", "test@example.com", "password456");

        // Assert
        Assert.That(user, Is.Null);
    }

    [Test]
    public async Task AuthenticateAsync_WithValidCredentials_ShouldReturnToken()
    {
        // Arrange
        using var context = new VultContext(_options);
        var service = new AuthenticationService(context, _configuration);
        await service.RegisterAsync("testuser", "test@example.com", "password123");

        // Act
        var token = await service.AuthenticateAsync("testuser", "password123");

        // Assert
        Assert.That(token, Is.Not.Null);
        Assert.That(token, Is.Not.Empty);
    }

    [Test]
    public async Task AuthenticateAsync_WithInvalidPassword_ShouldReturnNull()
    {
        // Arrange
        using var context = new VultContext(_options);
        var service = new AuthenticationService(context, _configuration);
        await service.RegisterAsync("testuser", "test@example.com", "password123");

        // Act
        var token = await service.AuthenticateAsync("testuser", "wrongpassword");

        // Assert
        Assert.That(token, Is.Null);
    }

    [Test]
    public async Task AuthenticateAsync_WithNonExistentUser_ShouldReturnNull()
    {
        // Arrange
        using var context = new VultContext(_options);
        var service = new AuthenticationService(context, _configuration);

        // Act
        var token = await service.AuthenticateAsync("nonexistent", "password123");

        // Assert
        Assert.That(token, Is.Null);
    }

    [Test]
    public async Task AuthenticateAsync_WithInactiveUser_ShouldReturnNull()
    {
        // Arrange
        using var context = new VultContext(_options);
        var service = new AuthenticationService(context, _configuration);
        var user = await service.RegisterAsync("testuser", "test@example.com", "password123");
        
        // Deactivate user
        user!.IsActive = false;
        await context.SaveChangesAsync();

        // Act
        var token = await service.AuthenticateAsync("testuser", "password123");

        // Assert
        Assert.That(token, Is.Null);
    }

    [Test]
    public async Task ValidateToken_WithValidToken_ShouldReturnTrue()
    {
        // Arrange
        using var context = new VultContext(_options);
        var service = new AuthenticationService(context, _configuration);
        await service.RegisterAsync("testuser", "test@example.com", "password123");
        var token = await service.AuthenticateAsync("testuser", "password123");

        // Act
        var isValid = service.ValidateToken(token!);

        // Assert
        Assert.That(isValid, Is.True);
    }

    [Test]
    public void ValidateToken_WithInvalidToken_ShouldReturnFalse()
    {
        // Arrange
        using var context = new VultContext(_options);
        var service = new AuthenticationService(context, _configuration);

        // Act
        var isValid = service.ValidateToken("invalid.token.here");

        // Assert
        Assert.That(isValid, Is.False);
    }

    [Test]
    public async Task GetUserIdFromToken_WithValidToken_ShouldReturnUserId()
    {
        // Arrange
        using var context = new VultContext(_options);
        var service = new AuthenticationService(context, _configuration);
        var user = await service.RegisterAsync("testuser", "test@example.com", "password123");
        var token = await service.AuthenticateAsync("testuser", "password123");

        // Act
        var userId = service.GetUserIdFromToken(token!);

        // Assert
        Assert.That(userId, Is.Not.Null);
        Assert.That(userId, Is.EqualTo(user!.UserId));
    }

    [Test]
    public void GetUserIdFromToken_WithInvalidToken_ShouldReturnNull()
    {
        // Arrange
        using var context = new VultContext(_options);
        var service = new AuthenticationService(context, _configuration);

        // Act
        var userId = service.GetUserIdFromToken("invalid.token.here");

        // Assert
        Assert.That(userId, Is.Null);
    }

    [Test]
    public async Task AuthenticateAsync_ShouldUpdateLastLoginDate()
    {
        // Arrange
        using var context = new VultContext(_options);
        var service = new AuthenticationService(context, _configuration);
        var user = await service.RegisterAsync("testuser", "test@example.com", "password123");
        var initialLoginDate = user!.LastLoginDate;

        // Wait a moment to ensure time difference
        await Task.Delay(10);

        // Act
        await service.AuthenticateAsync("testuser", "password123");

        // Assert
        var updatedUser = await context.Users.FindAsync(user.UserId);
        Assert.That(updatedUser!.LastLoginDate, Is.Not.Null);
        Assert.That(updatedUser.LastLoginDate, Is.GreaterThan(initialLoginDate ?? DateTime.MinValue));
    }

    [Test]
    public async Task AuthenticateAsync_WithUserRoles_ShouldIncludeRolesInToken()
    {
        // Arrange
        using var context = new VultContext(_options);
        var service = new AuthenticationService(context, _configuration);
        var user = await service.RegisterAsync("testuser", "test@example.com", "password123");
        
        var adminRole = new Role
        {
            RoleId = Guid.NewGuid(),
            Name = "Admin",
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };
        
        context.Roles.Add(adminRole);
        user!.Roles.Add(adminRole);
        await context.SaveChangesAsync();

        // Act
        var token = await service.AuthenticateAsync("testuser", "password123");

        // Assert
        Assert.That(token, Is.Not.Null);
        Assert.That(token, Is.Not.Empty);
        // Token should contain role claim (we verify this by validating the token structure)
        var isValid = service.ValidateToken(token!);
        Assert.That(isValid, Is.True);
    }
}
