// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using System.ComponentModel.DataAnnotations;
using Vult.Core;

namespace Vult.Core.Tests.Models;

[TestFixture]
public class UserTests
{
    [Test]
    public void User_DefaultValues_ShouldBeSetCorrectly()
    {
        // Act
        var user = new User();

        // Assert
        Assert.That(user.UserId, Is.EqualTo(Guid.Empty));
        Assert.That(user.Username, Is.EqualTo(string.Empty));
        Assert.That(user.Email, Is.EqualTo(string.Empty));
        Assert.That(user.PasswordHash, Is.EqualTo(string.Empty));
        Assert.That(user.IsActive, Is.True);
        Assert.That(user.Roles, Is.Not.Null);
        Assert.That(user.Roles.Count, Is.EqualTo(0));
    }

    [Test]
    public void User_SetProperties_ShouldWork()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var createdDate = DateTime.UtcNow;
        var updatedDate = DateTime.UtcNow;

        // Act
        var user = new User
        {
            UserId = userId,
            Username = "testuser",
            Email = "test@example.com",
            PasswordHash = "hashedpassword",
            FirstName = "John",
            LastName = "Doe",
            IsActive = true,
            CreatedDate = createdDate,
            UpdatedDate = updatedDate
        };

        // Assert
        Assert.That(user.UserId, Is.EqualTo(userId));
        Assert.That(user.Username, Is.EqualTo("testuser"));
        Assert.That(user.Email, Is.EqualTo("test@example.com"));
        Assert.That(user.PasswordHash, Is.EqualTo("hashedpassword"));
        Assert.That(user.FirstName, Is.EqualTo("John"));
        Assert.That(user.LastName, Is.EqualTo("Doe"));
        Assert.That(user.IsActive, Is.True);
        Assert.That(user.CreatedDate, Is.EqualTo(createdDate));
        Assert.That(user.UpdatedDate, Is.EqualTo(updatedDate));
    }

    [Test]
    public void User_WithRoles_ShouldAllowMultipleRoles()
    {
        // Arrange
        var user = new User();
        var role1 = new Role { RoleId = Guid.NewGuid(), Name = "Admin" };
        var role2 = new Role { RoleId = Guid.NewGuid(), Name = "User" };

        // Act
        user.Roles.Add(role1);
        user.Roles.Add(role2);

        // Assert
        Assert.That(user.Roles.Count, Is.EqualTo(2));
        Assert.That(user.Roles, Contains.Item(role1));
        Assert.That(user.Roles, Contains.Item(role2));
    }

    [Test]
    public void User_Username_RequiredValidation()
    {
        // Arrange
        var user = new User
        {
            Email = "test@example.com",
            PasswordHash = "hashedpassword"
        };

        var validationResults = new List<ValidationResult>();
        var validationContext = new ValidationContext(user, null, null);

        // Act
        var isValid = Validator.TryValidateObject(user, validationContext, validationResults, true);

        // Assert
        Assert.That(isValid, Is.False);
        Assert.That(validationResults.Any(v => v.MemberNames.Contains("Username")), Is.True);
    }

    [Test]
    public void User_Email_RequiredValidation()
    {
        // Arrange
        var user = new User
        {
            Username = "testuser",
            PasswordHash = "hashedpassword"
        };

        var validationResults = new List<ValidationResult>();
        var validationContext = new ValidationContext(user, null, null);

        // Act
        var isValid = Validator.TryValidateObject(user, validationContext, validationResults, true);

        // Assert
        Assert.That(isValid, Is.False);
        Assert.That(validationResults.Any(v => v.MemberNames.Contains("Email")), Is.True);
    }

    [Test]
    public void User_Email_EmailAddressValidation()
    {
        // Arrange
        var user = new User
        {
            Username = "testuser",
            Email = "invalid-email",
            PasswordHash = "hashedpassword"
        };

        var validationResults = new List<ValidationResult>();
        var validationContext = new ValidationContext(user, null, null);

        // Act
        var isValid = Validator.TryValidateObject(user, validationContext, validationResults, true);

        // Assert
        Assert.That(isValid, Is.False);
        Assert.That(validationResults.Any(v => v.MemberNames.Contains("Email")), Is.True);
    }

    [Test]
    public void User_PasswordHash_RequiredValidation()
    {
        // Arrange
        var user = new User
        {
            Username = "testuser",
            Email = "test@example.com"
        };

        var validationResults = new List<ValidationResult>();
        var validationContext = new ValidationContext(user, null, null);

        // Act
        var isValid = Validator.TryValidateObject(user, validationContext, validationResults, true);

        // Assert
        Assert.That(isValid, Is.False);
        Assert.That(validationResults.Any(v => v.MemberNames.Contains("PasswordHash")), Is.True);
    }

    [Test]
    public void User_ValidUser_PassesValidation()
    {
        // Arrange
        var user = new User
        {
            Username = "testuser",
            Email = "test@example.com",
            PasswordHash = "hashedpassword"
        };

        var validationResults = new List<ValidationResult>();
        var validationContext = new ValidationContext(user, null, null);

        // Act
        var isValid = Validator.TryValidateObject(user, validationContext, validationResults, true);

        // Assert
        Assert.That(isValid, Is.True);
        Assert.That(validationResults.Count, Is.EqualTo(0));
    }

    [Test]
    public void User_Username_MaxLength100_Validation()
    {
        // Arrange
        var user = new User
        {
            Username = new string('a', 101),
            Email = "test@example.com",
            PasswordHash = "hashedpassword"
        };

        var validationResults = new List<ValidationResult>();
        var validationContext = new ValidationContext(user, null, null);

        // Act
        var isValid = Validator.TryValidateObject(user, validationContext, validationResults, true);

        // Assert
        Assert.That(isValid, Is.False);
        Assert.That(validationResults.Any(v => v.MemberNames.Contains("Username")), Is.True);
    }

    [Test]
    public void User_Email_MaxLength255_Validation()
    {
        // Arrange
        var user = new User
        {
            Username = "testuser",
            Email = new string('a', 256) + "@example.com",
            PasswordHash = "hashedpassword"
        };

        var validationResults = new List<ValidationResult>();
        var validationContext = new ValidationContext(user, null, null);

        // Act
        var isValid = Validator.TryValidateObject(user, validationContext, validationResults, true);

        // Assert
        Assert.That(isValid, Is.False);
        Assert.That(validationResults.Any(v => v.MemberNames.Contains("Email")), Is.True);
    }
}
