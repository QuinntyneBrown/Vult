// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Vult.Api.Features.Products;
using Vult.Core;
using Vult.Infrastructure.Data;

namespace Vult.Api.Tests.Features.Products;

[TestFixture]
public class GetProductByIdQueryHandlerTests
{
    private VultContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<VultContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new VultContext(options);
    }

    [Test]
    public async Task HandleAsync_ShouldReturnProduct_WhenExists()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var productId = Guid.NewGuid();

        context.Products.Add(new Product
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
        });

        await context.SaveChangesAsync();

        var handler = new GetProductByIdQueryHandler(context);
        var query = new GetProductByIdQuery(productId);

        // Act
        var result = await handler.Handle(query, default);

        // Assert
        Assert.That(result.Product, Is.Not.Null);
        Assert.That(result.Product!.ProductId, Is.EqualTo(productId));
        Assert.That(result.Product.BrandName, Is.EqualTo("Adidas"));
    }

    [Test]
    public async Task HandleAsync_ShouldReturnNull_WhenNotExists()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new GetProductByIdQueryHandler(context);
        var query = new GetProductByIdQuery(Guid.NewGuid());

        // Act
        var result = await handler.Handle(query, default);

        // Assert
        Assert.That(result.Product, Is.Null);
    }

    [Test]
    public async Task HandleAsync_ShouldIncludeImages_WhenProductHasImages()
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
            BrandName = "Puma",
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

        var handler = new GetProductByIdQueryHandler(context);
        var query = new GetProductByIdQuery(productId);

        // Act
        var result = await handler.Handle(query, default);

        // Assert
        Assert.That(result.Product, Is.Not.Null);
        Assert.That(result.Product!.ProductImages, Has.Count.EqualTo(1));
        Assert.That(result.Product.ProductImages[0].ProductImageId, Is.EqualTo(imageId));
    }
}
