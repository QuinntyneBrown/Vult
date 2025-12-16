// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vult.Api.Controllers;
using Vult.Api.Features.CatalogItems;
using Vult.Core.Enums;
using Vult.Core.Models;
using Vult.Infrastructure.Data;

namespace Vult.Api.Tests.Controllers;

[TestFixture]
public class CatalogItemsControllerTests
{
    private VultContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<VultContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new VultContext(options);
    }

    [Test]
    public async Task GetCatalogItems_ShouldReturnOkWithItems()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        
        var catalogItem = new CatalogItem
        {
            CatalogItemId = Guid.NewGuid(),
            BrandName = "Nike",
            Description = "Test Item",
            Size = "M",
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 60m,
            Gender = Gender.Mens,
            ItemType = ItemType.Shirt,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };
        
        context.CatalogItems.Add(catalogItem);
        await context.SaveChangesAsync();

        var handler = new GetCatalogItemsQueryHandler(context);
        var controller = new CatalogItemsController(
            handler,
            new GetCatalogItemByIdQueryHandler(context),
            new CreateCatalogItemCommandHandler(context),
            new UpdateCatalogItemCommandHandler(context),
            new DeleteCatalogItemCommandHandler(context));

        // Act
        var result = await controller.GetCatalogItems();

        // Assert
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        var okResult = result.Result as OkObjectResult;
        var queryResult = okResult!.Value as GetCatalogItemsQueryResult;
        Assert.That(queryResult, Is.Not.Null);
        Assert.That(queryResult!.Items, Has.Count.EqualTo(1));
        Assert.That(queryResult.TotalCount, Is.EqualTo(1));
    }

    [Test]
    public async Task GetCatalogItemById_ShouldReturnOk_WhenItemExists()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        
        var catalogItemId = Guid.NewGuid();
        var catalogItem = new CatalogItem
        {
            CatalogItemId = catalogItemId,
            BrandName = "Nike",
            Description = "Test Item",
            Size = "M",
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 60m,
            Gender = Gender.Mens,
            ItemType = ItemType.Shirt,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };
        
        context.CatalogItems.Add(catalogItem);
        await context.SaveChangesAsync();

        var controller = new CatalogItemsController(
            new GetCatalogItemsQueryHandler(context),
            new GetCatalogItemByIdQueryHandler(context),
            new CreateCatalogItemCommandHandler(context),
            new UpdateCatalogItemCommandHandler(context),
            new DeleteCatalogItemCommandHandler(context));

        // Act
        var result = await controller.GetCatalogItemById(catalogItemId);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        var okResult = result.Result as OkObjectResult;
        var queryResult = okResult!.Value as GetCatalogItemByIdQueryResult;
        Assert.That(queryResult, Is.Not.Null);
        Assert.That(queryResult!.CatalogItem, Is.Not.Null);
        Assert.That(queryResult.CatalogItem!.CatalogItemId, Is.EqualTo(catalogItemId));
    }

    [Test]
    public async Task GetCatalogItemById_ShouldReturnNotFound_WhenItemDoesNotExist()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        
        var controller = new CatalogItemsController(
            new GetCatalogItemsQueryHandler(context),
            new GetCatalogItemByIdQueryHandler(context),
            new CreateCatalogItemCommandHandler(context),
            new UpdateCatalogItemCommandHandler(context),
            new DeleteCatalogItemCommandHandler(context));

        var nonExistentId = Guid.NewGuid();

        // Act
        var result = await controller.GetCatalogItemById(nonExistentId);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    }

    [Test]
    public async Task CreateCatalogItem_ShouldReturnCreated_WhenSuccessful()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        
        var controller = new CatalogItemsController(
            new GetCatalogItemsQueryHandler(context),
            new GetCatalogItemByIdQueryHandler(context),
            new CreateCatalogItemCommandHandler(context),
            new UpdateCatalogItemCommandHandler(context),
            new DeleteCatalogItemCommandHandler(context));

        var dto = new CreateCatalogItemDto
        {
            BrandName = "Nike",
            Description = "Test Item",
            Size = "M",
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 60m,
            Gender = Gender.Mens,
            ItemType = ItemType.Shirt
        };

        // Act
        var result = await controller.CreateCatalogItem(dto);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<CreatedAtActionResult>());
        var createdResult = result.Result as CreatedAtActionResult;
        Assert.That(createdResult!.ActionName, Is.EqualTo(nameof(CatalogItemsController.GetCatalogItemById)));
        
        var commandResult = createdResult.Value as CreateCatalogItemCommandResult;
        Assert.That(commandResult, Is.Not.Null);
        Assert.That(commandResult!.Success, Is.True);
        Assert.That(commandResult.CatalogItem, Is.Not.Null);
    }

    [Test]
    public async Task CreateCatalogItem_ShouldReturnBadRequest_WhenValidationFails()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        
        var controller = new CatalogItemsController(
            new GetCatalogItemsQueryHandler(context),
            new GetCatalogItemByIdQueryHandler(context),
            new CreateCatalogItemCommandHandler(context),
            new UpdateCatalogItemCommandHandler(context),
            new DeleteCatalogItemCommandHandler(context));

        var dto = new CreateCatalogItemDto
        {
            BrandName = "", // Invalid
            Description = "", // Invalid
            Size = "",
            EstimatedMSRP = -1, // Invalid
            EstimatedResaleValue = -1, // Invalid
            Gender = Gender.Mens,
            ItemType = ItemType.Shirt
        };

        // Act
        var result = await controller.CreateCatalogItem(dto);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<BadRequestObjectResult>());
    }

    [Test]
    public async Task UpdateCatalogItem_ShouldReturnOk_WhenSuccessful()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        
        var catalogItemId = Guid.NewGuid();
        var catalogItem = new CatalogItem
        {
            CatalogItemId = catalogItemId,
            BrandName = "Nike",
            Description = "Original Item",
            Size = "M",
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 60m,
            Gender = Gender.Mens,
            ItemType = ItemType.Shirt,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };
        
        context.CatalogItems.Add(catalogItem);
        await context.SaveChangesAsync();

        var controller = new CatalogItemsController(
            new GetCatalogItemsQueryHandler(context),
            new GetCatalogItemByIdQueryHandler(context),
            new CreateCatalogItemCommandHandler(context),
            new UpdateCatalogItemCommandHandler(context),
            new DeleteCatalogItemCommandHandler(context));

        var dto = new UpdateCatalogItemDto
        {
            CatalogItemId = catalogItemId,
            BrandName = "Adidas",
            Description = "Updated Item",
            Size = "L",
            EstimatedMSRP = 120m,
            EstimatedResaleValue = 72m,
            Gender = Gender.Womens,
            ItemType = ItemType.Pants
        };

        // Act
        var result = await controller.UpdateCatalogItem(catalogItemId, dto);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        var okResult = result.Result as OkObjectResult;
        var commandResult = okResult!.Value as UpdateCatalogItemCommandResult;
        Assert.That(commandResult, Is.Not.Null);
        Assert.That(commandResult!.Success, Is.True);
        Assert.That(commandResult.CatalogItem!.BrandName, Is.EqualTo("Adidas"));
    }

    [Test]
    public async Task UpdateCatalogItem_ShouldReturnNotFound_WhenItemDoesNotExist()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        
        var controller = new CatalogItemsController(
            new GetCatalogItemsQueryHandler(context),
            new GetCatalogItemByIdQueryHandler(context),
            new CreateCatalogItemCommandHandler(context),
            new UpdateCatalogItemCommandHandler(context),
            new DeleteCatalogItemCommandHandler(context));

        var nonExistentId = Guid.NewGuid();
        var dto = new UpdateCatalogItemDto
        {
            CatalogItemId = nonExistentId,
            BrandName = "Nike",
            Description = "Updated Item",
            Size = "L",
            EstimatedMSRP = 120m,
            EstimatedResaleValue = 72m,
            Gender = Gender.Mens,
            ItemType = ItemType.Shirt
        };

        // Act
        var result = await controller.UpdateCatalogItem(nonExistentId, dto);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    }

    [Test]
    public async Task DeleteCatalogItem_ShouldReturnNoContent_WhenSuccessful()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        
        var catalogItemId = Guid.NewGuid();
        var catalogItem = new CatalogItem
        {
            CatalogItemId = catalogItemId,
            BrandName = "Nike",
            Description = "Test Item",
            Size = "M",
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 60m,
            Gender = Gender.Mens,
            ItemType = ItemType.Shirt,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };
        
        context.CatalogItems.Add(catalogItem);
        await context.SaveChangesAsync();

        var controller = new CatalogItemsController(
            new GetCatalogItemsQueryHandler(context),
            new GetCatalogItemByIdQueryHandler(context),
            new CreateCatalogItemCommandHandler(context),
            new UpdateCatalogItemCommandHandler(context),
            new DeleteCatalogItemCommandHandler(context));

        // Act
        var result = await controller.DeleteCatalogItem(catalogItemId);

        // Assert
        Assert.That(result, Is.InstanceOf<NoContentResult>());
    }

    [Test]
    public async Task DeleteCatalogItem_ShouldReturnNotFound_WhenItemDoesNotExist()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        
        var controller = new CatalogItemsController(
            new GetCatalogItemsQueryHandler(context),
            new GetCatalogItemByIdQueryHandler(context),
            new CreateCatalogItemCommandHandler(context),
            new UpdateCatalogItemCommandHandler(context),
            new DeleteCatalogItemCommandHandler(context));

        var nonExistentId = Guid.NewGuid();

        // Act
        var result = await controller.DeleteCatalogItem(nonExistentId);

        // Assert
        Assert.That(result, Is.InstanceOf<NotFoundObjectResult>());
    }
}
