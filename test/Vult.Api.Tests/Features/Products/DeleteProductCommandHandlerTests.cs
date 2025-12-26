// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Vult.Api.Features.Products;
using Vult.Core;
using Vult.Infrastructure.Data;

namespace Vult.Api.Tests.Features.Products;

[TestFixture]
public class DeleteProductCommandHandlerTests
{
    private VultContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<VultContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new VultContext(options);
    }

    [Test]
    public async Task HandleAsync_ShouldDeleteProduct_WhenExists()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var productId = Guid.NewGuid();

        var product = new Product
        {
            ProductId = productId,
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 50m,
            Description = "Test Item",
            Size = "M",
            BrandName = "Adidas",
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        context.Products.Add(product);
        await context.SaveChangesAsync();

        var handler = new DeleteProductCommandHandler(context);
        var command = new DeleteProductCommand(productId);

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        Assert.That(result.Success, Is.True);
        Assert.That(result.Errors, Is.Empty);

        var itemInDb = await context.Products.FirstOrDefaultAsync(x => x.ProductId == productId);
        Assert.That(itemInDb, Is.Null);
    }

    [Test]
    public async Task HandleAsync_ShouldReturnError_WhenProductNotFound()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new DeleteProductCommandHandler(context);
        var command = new DeleteProductCommand(Guid.NewGuid());

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Contains.Item("Product not found"));
    }

    [Test]
    public async Task HandleAsync_ShouldReturnError_WhenProductIdIsEmpty()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new DeleteProductCommandHandler(context);
        var command = new DeleteProductCommand(Guid.Empty);

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Contains.Item("ProductId is required"));
    }

    [Test]
    public async Task HandleAsync_ShouldDeleteProductAndImages_WhenHasImages()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var productId = Guid.NewGuid();
        var imageId = Guid.NewGuid();

        var product = new Product
        {
            ProductId = productId,
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 50m,
            Description = "Test Item",
            Size = "M",
            BrandName = "Reebok",
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        var image = new ProductImage
        {
            ProductImageId = imageId,
            ProductId = productId,
            ImageData = new byte[] { 1, 2, 3 },
            Description = "Test Image",
            CreatedDate = DateTime.UtcNow
        };

        context.Products.Add(product);
        context.ProductImages.Add(image);
        await context.SaveChangesAsync();

        var handler = new DeleteProductCommandHandler(context);
        var command = new DeleteProductCommand(productId);

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        Assert.That(result.Success, Is.True);
        Assert.That(result.Errors, Is.Empty);

        var itemInDb = await context.Products.FirstOrDefaultAsync(x => x.ProductId == productId);
        Assert.That(itemInDb, Is.Null);

        // Due to cascade delete, images should also be removed
        var imageInDb = await context.ProductImages.FirstOrDefaultAsync(x => x.ProductImageId == imageId);
        Assert.That(imageInDb, Is.Null);
    }
}
