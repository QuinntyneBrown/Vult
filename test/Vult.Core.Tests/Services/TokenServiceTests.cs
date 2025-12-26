// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;
using Vult.Core;

namespace Vult.Core.Tests.Services;

[TestFixture]
public class TokenServiceTests
{
    private IConfiguration _configuration = null!;

    [SetUp]
    public void SetUp()
    {
        var configValues = new Dictionary<string, string?>
        {
            { "Jwt:Key", "TestSecretKey12345678901234567890" },
            { "Jwt:Issuer", "TestIssuer" },
            { "Jwt:Audience", "TestAudience" },
            { "Jwt:ExpirationMinutes", "60" }
        };

        _configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(configValues)
            .Build();
    }

    [Test]
    public void GenerateToken_ShouldReturnValidJwtToken_WhenUserIsValid()
    {
        // Arrange
        var tokenService = new TokenService(_configuration);
        var user = CreateTestUser();

        // Act
        var token = tokenService.GenerateToken(user);

        // Assert
        Assert.That(token, Is.Not.Null);
        Assert.That(token, Is.Not.Empty);

        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(token);
        Assert.That(jwtToken, Is.Not.Null);
        Assert.That(jwtToken.Issuer, Is.EqualTo("TestIssuer"));
        Assert.That(jwtToken.Audiences, Contains.Item("TestAudience"));
    }

    [Test]
    public void GenerateToken_ShouldIncludeUserClaims_WhenUserHasRolesAndPrivileges()
    {
        // Arrange
        var tokenService = new TokenService(_configuration);
        var user = CreateTestUserWithRoles();

        // Act
        var token = tokenService.GenerateToken(user);

        // Assert
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(token);

        var nameClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name || c.Type == "unique_name");
        Assert.That(nameClaim, Is.Not.Null);
        Assert.That(nameClaim!.Value, Is.EqualTo("testuser"));

        var roleClaims = jwtToken.Claims.Where(c => c.Type == ClaimTypes.Role || c.Type == "role").ToList();
        Assert.That(roleClaims, Has.Count.EqualTo(1));
        Assert.That(roleClaims[0].Value, Is.EqualTo("Admin"));
    }

    [Test]
    public void GenerateToken_ShouldSetCorrectExpiration()
    {
        // Arrange
        var tokenService = new TokenService(_configuration);
        var user = CreateTestUser();

        // Act
        var token = tokenService.GenerateToken(user);

        // Assert
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(token);

        var expectedExpiration = DateTime.UtcNow.AddMinutes(60);
        Assert.That(jwtToken.ValidTo, Is.EqualTo(expectedExpiration).Within(TimeSpan.FromSeconds(5)));
    }

    [Test]
    public void GenerateRefreshToken_ShouldReturnNonEmptyString()
    {
        // Arrange
        var tokenService = new TokenService(_configuration);

        // Act
        var refreshToken = tokenService.GenerateRefreshToken();

        // Assert
        Assert.That(refreshToken, Is.Not.Null);
        Assert.That(refreshToken, Is.Not.Empty);
        Assert.That(refreshToken.Length, Is.GreaterThan(20));
    }

    [Test]
    public void GenerateRefreshToken_ShouldReturnDifferentTokensOnEachCall()
    {
        // Arrange
        var tokenService = new TokenService(_configuration);

        // Act
        var refreshToken1 = tokenService.GenerateRefreshToken();
        var refreshToken2 = tokenService.GenerateRefreshToken();

        // Assert
        Assert.That(refreshToken1, Is.Not.EqualTo(refreshToken2));
    }

    [Test]
    public void ValidateToken_ShouldReturnClaimsPrincipal_WhenTokenIsValid()
    {
        // Arrange
        var tokenService = new TokenService(_configuration);
        var user = CreateTestUser();
        var token = tokenService.GenerateToken(user);

        // Act
        var principal = tokenService.ValidateToken(token);

        // Assert
        Assert.That(principal, Is.Not.Null);
        var userIdClaim = principal!.FindFirst(ClaimTypes.NameIdentifier);
        Assert.That(userIdClaim, Is.Not.Null);
        Assert.That(userIdClaim!.Value, Is.EqualTo(user.UserId.ToString()));
    }

    [Test]
    public void ValidateToken_ShouldReturnNull_WhenTokenIsInvalid()
    {
        // Arrange
        var tokenService = new TokenService(_configuration);
        var invalidToken = "invalid.token.here";

        // Act
        var principal = tokenService.ValidateToken(invalidToken);

        // Assert
        Assert.That(principal, Is.Null);
    }

    [Test]
    public void ValidateToken_ShouldReturnNull_WhenTokenIsTampered()
    {
        // Arrange
        var tokenService = new TokenService(_configuration);
        var user = CreateTestUser();
        var token = tokenService.GenerateToken(user);
        var tamperedToken = token + "tampered";

        // Act
        var principal = tokenService.ValidateToken(tamperedToken);

        // Assert
        Assert.That(principal, Is.Null);
    }

    [Test]
    public void ValidateToken_ShouldReturnNull_WhenTokenExpired()
    {
        // Arrange - create config with 0 minute expiration (already expired)
        var shortLivedConfig = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                { "Jwt:Key", "TestSecretKey12345678901234567890" },
                { "Jwt:Issuer", "TestIssuer" },
                { "Jwt:Audience", "TestAudience" },
                { "Jwt:ExpirationMinutes", "-1" } // Expired token
            })
            .Build();

        var tokenService = new TokenService(shortLivedConfig);
        var user = CreateTestUser();
        var token = tokenService.GenerateToken(user);

        // Act
        var principal = tokenService.ValidateToken(token, validateLifetime: true);

        // Assert
        Assert.That(principal, Is.Null);
    }

    [Test]
    public void GetUserIdFromToken_ShouldReturnUserId_WhenTokenIsValid()
    {
        // Arrange
        var tokenService = new TokenService(_configuration);
        var user = CreateTestUser();
        var token = tokenService.GenerateToken(user);

        // Act
        var userId = tokenService.GetUserIdFromToken(token);

        // Assert
        Assert.That(userId, Is.Not.Null);
        Assert.That(userId, Is.EqualTo(user.UserId));
    }

    [Test]
    public void GetUserIdFromToken_ShouldReturnNull_WhenTokenIsInvalid()
    {
        // Arrange
        var tokenService = new TokenService(_configuration);
        var invalidToken = "invalid.token.here";

        // Act
        var userId = tokenService.GetUserIdFromToken(invalidToken);

        // Assert
        Assert.That(userId, Is.Null);
    }

    [Test]
    public void TokenService_ShouldUseDefaultValues_WhenConfigurationIsMissing()
    {
        // Arrange - empty configuration
        var emptyConfig = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>())
            .Build();

        var tokenService = new TokenService(emptyConfig);
        var user = CreateTestUser();

        // Act - should not throw
        var token = tokenService.GenerateToken(user);

        // Assert
        Assert.That(token, Is.Not.Null);
        Assert.That(token, Is.Not.Empty);
    }

    private static User CreateTestUser()
    {
        return new User
        {
            UserId = Guid.NewGuid(),
            Username = "testuser",
            Password = "hashedpassword",
            Salt = new byte[16],
            Roles = new List<Role>()
        };
    }

    private static User CreateTestUserWithRoles()
    {
        var privilege = new Privilege
        {
            PrivilegeId = Guid.NewGuid(),
            AccessRight = AccessRight.Read,
            Aggregate = "CatalogItem"
        };

        var role = new Role
        {
            RoleId = Guid.NewGuid(),
            Name = "Admin",
            Privileges = new List<Privilege> { privilege }
        };

        return new User
        {
            UserId = Guid.NewGuid(),
            Username = "testuser",
            Password = "hashedpassword",
            Salt = new byte[16],
            Roles = new List<Role> { role }
        };
    }
}
