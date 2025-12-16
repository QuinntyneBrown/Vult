// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using System.ComponentModel.DataAnnotations;
using Vult.Core.Models;

namespace Vult.Core.Tests.Models;

[TestFixture]
public class RoleTests
{
    [Test]
    public void Role_DefaultValues_ShouldBeSetCorrectly()
    {
        // Act
        var role = new Role();

        // Assert
        Assert.That(role.RoleId, Is.EqualTo(Guid.Empty));
        Assert.That(role.Name, Is.EqualTo(string.Empty));
        Assert.That(role.Users, Is.Not.Null);
        Assert.That(role.Users.Count, Is.EqualTo(0));
    }

    [Test]
    public void Role_SetProperties_ShouldWork()
    {
        // Arrange
        var roleId = Guid.NewGuid();
        var createdDate = DateTime.UtcNow;
        var updatedDate = DateTime.UtcNow;

        // Act
        var role = new Role
        {
            RoleId = roleId,
            Name = "Admin",
            Description = "Administrator role",
            CreatedDate = createdDate,
            UpdatedDate = updatedDate
        };

        // Assert
        Assert.That(role.RoleId, Is.EqualTo(roleId));
        Assert.That(role.Name, Is.EqualTo("Admin"));
        Assert.That(role.Description, Is.EqualTo("Administrator role"));
        Assert.That(role.CreatedDate, Is.EqualTo(createdDate));
        Assert.That(role.UpdatedDate, Is.EqualTo(updatedDate));
    }

    [Test]
    public void Role_WithUsers_ShouldAllowMultipleUsers()
    {
        // Arrange
        var role = new Role { Name = "Admin" };
        var user1 = new User { UserId = Guid.NewGuid(), Username = "user1", Email = "user1@example.com", PasswordHash = "hash1" };
        var user2 = new User { UserId = Guid.NewGuid(), Username = "user2", Email = "user2@example.com", PasswordHash = "hash2" };

        // Act
        role.Users.Add(user1);
        role.Users.Add(user2);

        // Assert
        Assert.That(role.Users.Count, Is.EqualTo(2));
        Assert.That(role.Users, Contains.Item(user1));
        Assert.That(role.Users, Contains.Item(user2));
    }

    [Test]
    public void Role_Name_RequiredValidation()
    {
        // Arrange
        var role = new Role
        {
            Description = "Test role"
        };

        var validationResults = new List<ValidationResult>();
        var validationContext = new ValidationContext(role, null, null);

        // Act
        var isValid = Validator.TryValidateObject(role, validationContext, validationResults, true);

        // Assert
        Assert.That(isValid, Is.False);
        Assert.That(validationResults.Any(v => v.MemberNames.Contains("Name")), Is.True);
    }

    [Test]
    public void Role_ValidRole_PassesValidation()
    {
        // Arrange
        var role = new Role
        {
            Name = "Admin"
        };

        var validationResults = new List<ValidationResult>();
        var validationContext = new ValidationContext(role, null, null);

        // Act
        var isValid = Validator.TryValidateObject(role, validationContext, validationResults, true);

        // Assert
        Assert.That(isValid, Is.True);
        Assert.That(validationResults.Count, Is.EqualTo(0));
    }

    [Test]
    public void Role_Name_MaxLength50_Validation()
    {
        // Arrange
        var role = new Role
        {
            Name = new string('a', 51)
        };

        var validationResults = new List<ValidationResult>();
        var validationContext = new ValidationContext(role, null, null);

        // Act
        var isValid = Validator.TryValidateObject(role, validationContext, validationResults, true);

        // Assert
        Assert.That(isValid, Is.False);
        Assert.That(validationResults.Any(v => v.MemberNames.Contains("Name")), Is.True);
    }

    [Test]
    public void Role_Description_MaxLength200_Validation()
    {
        // Arrange
        var role = new Role
        {
            Name = "Admin",
            Description = new string('a', 201)
        };

        var validationResults = new List<ValidationResult>();
        var validationContext = new ValidationContext(role, null, null);

        // Act
        var isValid = Validator.TryValidateObject(role, validationContext, validationResults, true);

        // Assert
        Assert.That(isValid, Is.False);
        Assert.That(validationResults.Any(v => v.MemberNames.Contains("Description")), Is.True);
    }
}
