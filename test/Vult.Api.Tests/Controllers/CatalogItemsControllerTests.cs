// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Vult.Api.Controllers;
using Vult.Api.Features.CatalogItems;
using Vult.Core;
using Vult.Core;
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
        var mediatorMock = new Mock<IMediator>();
        var loggerMock = new Mock<ILogger<CatalogItemsController>>();

        var catalogItemDto = new CatalogItemDto
        {
            CatalogItemId = Guid.NewGuid(),
            BrandName = "Adidas",
            Description = "Test Item",
            Size = "M",
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 60m,
            Gender = Gender.Mens,
            ItemType = ItemType.Shirt,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        mediatorMock
            .Setup(m => m.Send(It.IsAny<GetCatalogItemsQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new GetCatalogItemsQueryResult
            {
                Items = new List<CatalogItemDto> { catalogItemDto },
                TotalCount = 1,
                PageNumber = 1,
                PageSize = 10
            });

        var controller = new CatalogItemsController(mediatorMock.Object, loggerMock.Object);

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
        var catalogItemId = Guid.NewGuid();
        var mediatorMock = new Mock<IMediator>();
        var loggerMock = new Mock<ILogger<CatalogItemsController>>();

        mediatorMock
            .Setup(m => m.Send(It.IsAny<GetCatalogItemByIdQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new GetCatalogItemByIdQueryResult
            {
                CatalogItem = new CatalogItemDto
                {
                    CatalogItemId = catalogItemId,
                    BrandName = "Puma",
                    Description = "Test Item",
                    Size = "M",
                    EstimatedMSRP = 100m,
                    EstimatedResaleValue = 60m,
                    Gender = Gender.Mens,
                    ItemType = ItemType.Shirt,
                    CreatedDate = DateTime.UtcNow,
                    UpdatedDate = DateTime.UtcNow
                }
            });

        var controller = new CatalogItemsController(mediatorMock.Object, loggerMock.Object);

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
        var mediatorMock = new Mock<IMediator>();
        var loggerMock = new Mock<ILogger<CatalogItemsController>>();

        mediatorMock
            .Setup(m => m.Send(It.IsAny<GetCatalogItemByIdQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new GetCatalogItemByIdQueryResult
            {
                CatalogItem = null
            });

        var controller = new CatalogItemsController(mediatorMock.Object, loggerMock.Object);

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
        var mediatorMock = new Mock<IMediator>();
        var loggerMock = new Mock<ILogger<CatalogItemsController>>();

        mediatorMock
            .Setup(m => m.Send(It.IsAny<CreateCatalogItemCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new CreateCatalogItemCommandResult
            {
                Success = true,
                CatalogItem = new CatalogItemDto
                {
                    CatalogItemId = Guid.NewGuid(),
                    BrandName = "Reebok",
                    Description = "Test Item",
                    Size = "M",
                    EstimatedMSRP = 100m,
                    EstimatedResaleValue = 60m,
                    Gender = Gender.Mens,
                    ItemType = ItemType.Shirt,
                    CreatedDate = DateTime.UtcNow,
                    UpdatedDate = DateTime.UtcNow
                }
            });

        var controller = new CatalogItemsController(mediatorMock.Object, loggerMock.Object);

        var dto = new CreateCatalogItemDto
        {
            BrandName = "Reebok",
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
        var mediatorMock = new Mock<IMediator>();
        var loggerMock = new Mock<ILogger<CatalogItemsController>>();

        mediatorMock
            .Setup(m => m.Send(It.IsAny<CreateCatalogItemCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new CreateCatalogItemCommandResult
            {
                Success = false,
                Errors = new List<string> { "Validation failed" }
            });

        var controller = new CatalogItemsController(mediatorMock.Object, loggerMock.Object);

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
        var catalogItemId = Guid.NewGuid();
        var mediatorMock = new Mock<IMediator>();
        var loggerMock = new Mock<ILogger<CatalogItemsController>>();

        mediatorMock
            .Setup(m => m.Send(It.IsAny<UpdateCatalogItemCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new UpdateCatalogItemCommandResult
            {
                Success = true,
                CatalogItem = new CatalogItemDto
                {
                    CatalogItemId = catalogItemId,
                    BrandName = "Adidas",
                    Description = "Updated Item",
                    Size = "L",
                    EstimatedMSRP = 120m,
                    EstimatedResaleValue = 72m,
                    Gender = Gender.Womens,
                    ItemType = ItemType.Pants,
                    CreatedDate = DateTime.UtcNow,
                    UpdatedDate = DateTime.UtcNow
                }
            });

        var controller = new CatalogItemsController(mediatorMock.Object, loggerMock.Object);

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
        var mediatorMock = new Mock<IMediator>();
        var loggerMock = new Mock<ILogger<CatalogItemsController>>();

        mediatorMock
            .Setup(m => m.Send(It.IsAny<UpdateCatalogItemCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new UpdateCatalogItemCommandResult
            {
                Success = false,
                Errors = new List<string> { "Catalog item not found" }
            });

        var controller = new CatalogItemsController(mediatorMock.Object, loggerMock.Object);

        var nonExistentId = Guid.NewGuid();
        var dto = new UpdateCatalogItemDto
        {
            CatalogItemId = nonExistentId,
            BrandName = "New Balance",
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
        var mediatorMock = new Mock<IMediator>();
        var loggerMock = new Mock<ILogger<CatalogItemsController>>();

        mediatorMock
            .Setup(m => m.Send(It.IsAny<DeleteCatalogItemCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new DeleteCatalogItemCommandResult
            {
                Success = true
            });

        var controller = new CatalogItemsController(mediatorMock.Object, loggerMock.Object);

        var catalogItemId = Guid.NewGuid();

        // Act
        var result = await controller.DeleteCatalogItem(catalogItemId);

        // Assert
        Assert.That(result, Is.InstanceOf<NoContentResult>());
    }

    [Test]
    public async Task DeleteCatalogItem_ShouldReturnNotFound_WhenItemDoesNotExist()
    {
        // Arrange
        var mediatorMock = new Mock<IMediator>();
        var loggerMock = new Mock<ILogger<CatalogItemsController>>();

        mediatorMock
            .Setup(m => m.Send(It.IsAny<DeleteCatalogItemCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new DeleteCatalogItemCommandResult
            {
                Success = false,
                Errors = new List<string> { "Catalog item not found" }
            });

        var controller = new CatalogItemsController(mediatorMock.Object, loggerMock.Object);

        var nonExistentId = Guid.NewGuid();

        // Act
        var result = await controller.DeleteCatalogItem(nonExistentId);

        // Assert
        Assert.That(result, Is.InstanceOf<NotFoundObjectResult>());
    }
}
