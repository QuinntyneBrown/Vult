// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Vult.Api.Controllers;
using Vult.Api.Features.Products;
using Vult.Core;
using Vult.Infrastructure.Data;

namespace Vult.Api.Tests.Controllers;

[TestFixture]
public class ProductsControllerTests
{
    private VultContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<VultContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new VultContext(options);
    }

    [Test]
    public async Task GetProducts_ShouldReturnOkWithItems()
    {
        // Arrange
        var mediatorMock = new Mock<IMediator>();
        var loggerMock = new Mock<ILogger<ProductsController>>();

        var productDto = new ProductDto
        {
            ProductId = Guid.NewGuid(),
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
            .Setup(m => m.Send(It.IsAny<GetProductsQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new GetProductsQueryResult
            {
                Items = new List<ProductDto> { productDto },
                TotalCount = 1,
                PageNumber = 1,
                PageSize = 10
            });

        var controller = new ProductsController(mediatorMock.Object, loggerMock.Object);

        // Act
        var result = await controller.GetProducts();

        // Assert
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        var okResult = result.Result as OkObjectResult;
        var queryResult = okResult!.Value as GetProductsQueryResult;
        Assert.That(queryResult, Is.Not.Null);
        Assert.That(queryResult!.Items, Has.Count.EqualTo(1));
        Assert.That(queryResult.TotalCount, Is.EqualTo(1));
    }

    [Test]
    public async Task GetProductById_ShouldReturnOk_WhenItemExists()
    {
        // Arrange
        var productId = Guid.NewGuid();
        var mediatorMock = new Mock<IMediator>();
        var loggerMock = new Mock<ILogger<ProductsController>>();

        mediatorMock
            .Setup(m => m.Send(It.IsAny<GetProductByIdQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new GetProductByIdQueryResult
            {
                Product = new ProductDto
                {
                    ProductId = productId,
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

        var controller = new ProductsController(mediatorMock.Object, loggerMock.Object);

        // Act
        var result = await controller.GetProductById(productId);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        var okResult = result.Result as OkObjectResult;
        var queryResult = okResult!.Value as GetProductByIdQueryResult;
        Assert.That(queryResult, Is.Not.Null);
        Assert.That(queryResult!.Product, Is.Not.Null);
        Assert.That(queryResult.Product!.ProductId, Is.EqualTo(productId));
    }

    [Test]
    public async Task GetProductById_ShouldReturnNotFound_WhenItemDoesNotExist()
    {
        // Arrange
        var mediatorMock = new Mock<IMediator>();
        var loggerMock = new Mock<ILogger<ProductsController>>();

        mediatorMock
            .Setup(m => m.Send(It.IsAny<GetProductByIdQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new GetProductByIdQueryResult
            {
                Product = null
            });

        var controller = new ProductsController(mediatorMock.Object, loggerMock.Object);

        var nonExistentId = Guid.NewGuid();

        // Act
        var result = await controller.GetProductById(nonExistentId);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    }

    [Test]
    public async Task CreateProduct_ShouldReturnCreated_WhenSuccessful()
    {
        // Arrange
        var mediatorMock = new Mock<IMediator>();
        var loggerMock = new Mock<ILogger<ProductsController>>();

        mediatorMock
            .Setup(m => m.Send(It.IsAny<CreateProductCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new CreateProductCommandResult
            {
                Success = true,
                Product = new ProductDto
                {
                    ProductId = Guid.NewGuid(),
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

        var controller = new ProductsController(mediatorMock.Object, loggerMock.Object);

        var dto = new CreateProductDto
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
        var result = await controller.CreateProduct(dto);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<CreatedAtActionResult>());
        var createdResult = result.Result as CreatedAtActionResult;
        Assert.That(createdResult!.ActionName, Is.EqualTo(nameof(ProductsController.GetProductById)));

        var commandResult = createdResult.Value as CreateProductCommandResult;
        Assert.That(commandResult, Is.Not.Null);
        Assert.That(commandResult!.Success, Is.True);
        Assert.That(commandResult.Product, Is.Not.Null);
    }

    [Test]
    public async Task CreateProduct_ShouldReturnBadRequest_WhenValidationFails()
    {
        // Arrange
        var mediatorMock = new Mock<IMediator>();
        var loggerMock = new Mock<ILogger<ProductsController>>();

        mediatorMock
            .Setup(m => m.Send(It.IsAny<CreateProductCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new CreateProductCommandResult
            {
                Success = false,
                Errors = new List<string> { "Validation failed" }
            });

        var controller = new ProductsController(mediatorMock.Object, loggerMock.Object);

        var dto = new CreateProductDto
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
        var result = await controller.CreateProduct(dto);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<BadRequestObjectResult>());
    }

    [Test]
    public async Task UpdateProduct_ShouldReturnOk_WhenSuccessful()
    {
        // Arrange
        var productId = Guid.NewGuid();
        var mediatorMock = new Mock<IMediator>();
        var loggerMock = new Mock<ILogger<ProductsController>>();

        mediatorMock
            .Setup(m => m.Send(It.IsAny<UpdateProductCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new UpdateProductCommandResult
            {
                Success = true,
                Product = new ProductDto
                {
                    ProductId = productId,
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

        var controller = new ProductsController(mediatorMock.Object, loggerMock.Object);

        var dto = new UpdateProductDto
        {
            ProductId = productId,
            BrandName = "Adidas",
            Description = "Updated Item",
            Size = "L",
            EstimatedMSRP = 120m,
            EstimatedResaleValue = 72m,
            Gender = Gender.Womens,
            ItemType = ItemType.Pants
        };

        // Act
        var result = await controller.UpdateProduct(productId, dto);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        var okResult = result.Result as OkObjectResult;
        var commandResult = okResult!.Value as UpdateProductCommandResult;
        Assert.That(commandResult, Is.Not.Null);
        Assert.That(commandResult!.Success, Is.True);
        Assert.That(commandResult.Product!.BrandName, Is.EqualTo("Adidas"));
    }

    [Test]
    public async Task UpdateProduct_ShouldReturnNotFound_WhenItemDoesNotExist()
    {
        // Arrange
        var mediatorMock = new Mock<IMediator>();
        var loggerMock = new Mock<ILogger<ProductsController>>();

        mediatorMock
            .Setup(m => m.Send(It.IsAny<UpdateProductCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new UpdateProductCommandResult
            {
                Success = false,
                Errors = new List<string> { "Product not found" }
            });

        var controller = new ProductsController(mediatorMock.Object, loggerMock.Object);

        var nonExistentId = Guid.NewGuid();
        var dto = new UpdateProductDto
        {
            ProductId = nonExistentId,
            BrandName = "New Balance",
            Description = "Updated Item",
            Size = "L",
            EstimatedMSRP = 120m,
            EstimatedResaleValue = 72m,
            Gender = Gender.Mens,
            ItemType = ItemType.Shirt
        };

        // Act
        var result = await controller.UpdateProduct(nonExistentId, dto);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    }

    [Test]
    public async Task DeleteProduct_ShouldReturnNoContent_WhenSuccessful()
    {
        // Arrange
        var mediatorMock = new Mock<IMediator>();
        var loggerMock = new Mock<ILogger<ProductsController>>();

        mediatorMock
            .Setup(m => m.Send(It.IsAny<DeleteProductCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new DeleteProductCommandResult
            {
                Success = true
            });

        var controller = new ProductsController(mediatorMock.Object, loggerMock.Object);

        var productId = Guid.NewGuid();

        // Act
        var result = await controller.DeleteProduct(productId);

        // Assert
        Assert.That(result, Is.InstanceOf<NoContentResult>());
    }

    [Test]
    public async Task DeleteProduct_ShouldReturnNotFound_WhenItemDoesNotExist()
    {
        // Arrange
        var mediatorMock = new Mock<IMediator>();
        var loggerMock = new Mock<ILogger<ProductsController>>();

        mediatorMock
            .Setup(m => m.Send(It.IsAny<DeleteProductCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new DeleteProductCommandResult
            {
                Success = false,
                Errors = new List<string> { "Product not found" }
            });

        var controller = new ProductsController(mediatorMock.Object, loggerMock.Object);

        var nonExistentId = Guid.NewGuid();

        // Act
        var result = await controller.DeleteProduct(nonExistentId);

        // Assert
        Assert.That(result, Is.InstanceOf<NotFoundObjectResult>());
    }
}
