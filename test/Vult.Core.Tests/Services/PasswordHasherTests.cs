// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Vult.Core;

namespace Vult.Core.Tests.Services;

[TestFixture]
public class PasswordHasherTests
{
    private PasswordHasher _passwordHasher = null!;

    [SetUp]
    public void SetUp()
    {
        _passwordHasher = new PasswordHasher();
    }

    [Test]
    public void GenerateSalt_ShouldReturnNonEmptyByteArray()
    {
        // Act
        var salt = _passwordHasher.GenerateSalt();

        // Assert
        Assert.That(salt, Is.Not.Null);
        Assert.That(salt.Length, Is.EqualTo(16)); // 128 bits = 16 bytes
    }

    [Test]
    public void GenerateSalt_ShouldReturnDifferentSaltsOnEachCall()
    {
        // Act
        var salt1 = _passwordHasher.GenerateSalt();
        var salt2 = _passwordHasher.GenerateSalt();

        // Assert
        Assert.That(salt1, Is.Not.EqualTo(salt2));
    }

    [Test]
    public void HashPassword_ShouldReturnNonEmptyHash()
    {
        // Arrange
        var password = "TestPassword123!";
        var salt = _passwordHasher.GenerateSalt();

        // Act
        var hash = _passwordHasher.HashPassword(password, salt);

        // Assert
        Assert.That(hash, Is.Not.Null);
        Assert.That(hash, Is.Not.Empty);
    }

    [Test]
    public void HashPassword_ShouldReturnBase64EncodedString()
    {
        // Arrange
        var password = "TestPassword123!";
        var salt = _passwordHasher.GenerateSalt();

        // Act
        var hash = _passwordHasher.HashPassword(password, salt);

        // Assert - verify it's valid base64
        Assert.DoesNotThrow(() => Convert.FromBase64String(hash));
    }

    [Test]
    public void HashPassword_ShouldReturnSameHash_ForSamePasswordAndSalt()
    {
        // Arrange
        var password = "TestPassword123!";
        var salt = _passwordHasher.GenerateSalt();

        // Act
        var hash1 = _passwordHasher.HashPassword(password, salt);
        var hash2 = _passwordHasher.HashPassword(password, salt);

        // Assert
        Assert.That(hash1, Is.EqualTo(hash2));
    }

    [Test]
    public void HashPassword_ShouldReturnDifferentHash_ForDifferentSalts()
    {
        // Arrange
        var password = "TestPassword123!";
        var salt1 = _passwordHasher.GenerateSalt();
        var salt2 = _passwordHasher.GenerateSalt();

        // Act
        var hash1 = _passwordHasher.HashPassword(password, salt1);
        var hash2 = _passwordHasher.HashPassword(password, salt2);

        // Assert
        Assert.That(hash1, Is.Not.EqualTo(hash2));
    }

    [Test]
    public void HashPassword_ShouldReturnDifferentHash_ForDifferentPasswords()
    {
        // Arrange
        var password1 = "TestPassword123!";
        var password2 = "DifferentPassword456!";
        var salt = _passwordHasher.GenerateSalt();

        // Act
        var hash1 = _passwordHasher.HashPassword(password1, salt);
        var hash2 = _passwordHasher.HashPassword(password2, salt);

        // Assert
        Assert.That(hash1, Is.Not.EqualTo(hash2));
    }

    [Test]
    public void VerifyPassword_ShouldReturnTrue_WhenPasswordMatches()
    {
        // Arrange
        var password = "TestPassword123!";
        var salt = _passwordHasher.GenerateSalt();
        var hash = _passwordHasher.HashPassword(password, salt);

        // Act
        var result = _passwordHasher.VerifyPassword(password, hash, salt);

        // Assert
        Assert.That(result, Is.True);
    }

    [Test]
    public void VerifyPassword_ShouldReturnFalse_WhenPasswordDoesNotMatch()
    {
        // Arrange
        var password = "TestPassword123!";
        var wrongPassword = "WrongPassword456!";
        var salt = _passwordHasher.GenerateSalt();
        var hash = _passwordHasher.HashPassword(password, salt);

        // Act
        var result = _passwordHasher.VerifyPassword(wrongPassword, hash, salt);

        // Assert
        Assert.That(result, Is.False);
    }

    [Test]
    public void VerifyPassword_ShouldReturnFalse_WhenSaltIsDifferent()
    {
        // Arrange
        var password = "TestPassword123!";
        var salt1 = _passwordHasher.GenerateSalt();
        var salt2 = _passwordHasher.GenerateSalt();
        var hash = _passwordHasher.HashPassword(password, salt1);

        // Act
        var result = _passwordHasher.VerifyPassword(password, hash, salt2);

        // Assert
        Assert.That(result, Is.False);
    }

    [Test]
    public void VerifyPassword_ShouldBeCaseSensitive()
    {
        // Arrange
        var password = "TestPassword123!";
        var wrongPassword = "testpassword123!";
        var salt = _passwordHasher.GenerateSalt();
        var hash = _passwordHasher.HashPassword(password, salt);

        // Act
        var result = _passwordHasher.VerifyPassword(wrongPassword, hash, salt);

        // Assert
        Assert.That(result, Is.False);
    }

    [Test]
    public void HashPassword_ShouldHandleEmptyPassword()
    {
        // Arrange
        var password = string.Empty;
        var salt = _passwordHasher.GenerateSalt();

        // Act
        var hash = _passwordHasher.HashPassword(password, salt);

        // Assert
        Assert.That(hash, Is.Not.Null);
        Assert.That(hash, Is.Not.Empty);
    }

    [Test]
    public void HashPassword_ShouldHandleUnicodePassword()
    {
        // Arrange
        var password = "Tëst🔐Pàsswörd123!";
        var salt = _passwordHasher.GenerateSalt();

        // Act
        var hash = _passwordHasher.HashPassword(password, salt);

        // Assert
        Assert.That(hash, Is.Not.Null);
        Assert.That(hash, Is.Not.Empty);

        // Verify it can be verified correctly
        var result = _passwordHasher.VerifyPassword(password, hash, salt);
        Assert.That(result, Is.True);
    }

    [Test]
    public void HashPassword_ShouldHandleLongPassword()
    {
        // Arrange
        var password = new string('a', 1000);
        var salt = _passwordHasher.GenerateSalt();

        // Act
        var hash = _passwordHasher.HashPassword(password, salt);

        // Assert
        Assert.That(hash, Is.Not.Null);
        Assert.That(hash, Is.Not.Empty);

        // Verify it can be verified correctly
        var result = _passwordHasher.VerifyPassword(password, hash, salt);
        Assert.That(result, Is.True);
    }

    [Test]
    public void HashPassword_ShouldHandleSpecialCharacters()
    {
        // Arrange
        var password = "P@$$w0rd!@#$%^&*()_+-=[]{}|;':\",./<>?`~";
        var salt = _passwordHasher.GenerateSalt();

        // Act
        var hash = _passwordHasher.HashPassword(password, salt);

        // Assert
        Assert.That(hash, Is.Not.Null);
        Assert.That(hash, Is.Not.Empty);

        // Verify it can be verified correctly
        var result = _passwordHasher.VerifyPassword(password, hash, salt);
        Assert.That(result, Is.True);
    }

    [Test]
    public void GenerateSalt_ShouldBeUnpredictable()
    {
        // Act - generate many salts
        var salts = Enumerable.Range(0, 100)
            .Select(_ => _passwordHasher.GenerateSalt())
            .ToList();

        // Assert - all should be unique
        var distinctSalts = salts.Select(s => Convert.ToBase64String(s)).Distinct().Count();
        Assert.That(distinctSalts, Is.EqualTo(100));
    }
}
