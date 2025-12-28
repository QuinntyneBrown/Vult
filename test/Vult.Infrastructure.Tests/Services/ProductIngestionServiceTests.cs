// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Vult.Core;
using Vult.Core.Model.ProductAggregate;
using Vult.Core.Model.ProductAggregate.Enums;
using Vult.Core.Services;
using Vult.Infrastructure.Data;

namespace Vult.Infrastructure.Tests.Services;

[TestFixture]
public class ProductIngestionServiceTests
{
    private Mock<IImageAnalysisService> _imageAnalysisServiceMock = null!;
    private Mock<ILogger<ProductIngestionService>> _loggerMock = null!;
    private Mock<IAzureOpenAIService> _azureOpenAIServiceMock = null!;
    private VultContext _context = null!;

    private VultContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<VultContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new VultContext(options);
    }

    [SetUp]
    public void SetUp()
    {
        _imageAnalysisServiceMock = new Mock<IImageAnalysisService>();
        _loggerMock = new Mock<ILogger<ProductIngestionService>>();
        _context = GetInMemoryContext();
    }

    [TearDown]
    public void TearDown()
    {
        _context?.Dispose();
    }

    [Test]
    public async Task IngestImagesAsync_ShouldReturnError_WhenImagesIsNull()
    {
        // Arrange
        var service = new ProductIngestionService(_imageAnalysisServiceMock.Object, _context, _azureOpenAIServiceMock.Object, _loggerMock.Object);

        // Act
        var result = await service.IngestAsync(null!);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Contains.Item("No images provided for ingestion"));
        Assert.That(result.TotalProcessed, Is.EqualTo(0));
    }

    [Test]
    public async Task IngestImagesAsync_ShouldReturnError_WhenImagesIsEmpty()
    {
        // Arrange
        var service = new ProductIngestionService(_imageAnalysisServiceMock.Object, _context, _azureOpenAIServiceMock.Object, _loggerMock.Object);

        // Act
        var result = await service.IngestAsync(Array.Empty<byte[]>());

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Contains.Item("No images provided for ingestion"));
    }

    [Test]
    public async Task IngestImagesAsync_ShouldProcessImagesSuccessfully_WhenValid()
    {
        // Arrange
        var service = new ProductIngestionService(_imageAnalysisServiceMock.Object, _context, _azureOpenAIServiceMock.Object, _loggerMock.Object);

        var imageData = new byte[] { 1, 2, 3, 4, 5 };
        var images = new[] { imageData };

        var analysisResult = new ProductAnalysisResult
        {
            Success = true,
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 60m,
            Description = "Great condition Adidas shoe",
            Size = "M",
            BrandName = "Adidas",
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe,
            ImageDescription = "A red Adidas shoe"
        };

        _imageAnalysisServiceMock
            .Setup(s => s.AnalyzeAsync(It.IsAny<byte[]>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(analysisResult);

        // Act
        var result = await service.IngestAsync(images);

        // Assert
        Assert.That(result.Success, Is.True);
        Assert.That(result.TotalProcessed, Is.EqualTo(1));
        Assert.That(result.SuccessfullyProcessed, Is.EqualTo(1));
        Assert.That(result.Failed, Is.EqualTo(0));
        Assert.That(result.Products, Has.Count.EqualTo(1));

        var product = result.Products[0];
        Assert.That(product.BrandName, Is.EqualTo("Adidas"));
        Assert.That(product.EstimatedMSRP, Is.EqualTo(100m));
        Assert.That(product.EstimatedResaleValue, Is.EqualTo(60m));
        Assert.That(product.ItemType, Is.EqualTo(ItemType.Shoe));
        Assert.That(product.Gender, Is.EqualTo(Gender.Mens));
        Assert.That(product.ProductImages, Has.Count.EqualTo(1));

        var image = product.ProductImages.First();
        Assert.That(image.ImageData, Is.EqualTo(imageData));
        Assert.That(image.Description, Is.EqualTo("A red Adidas shoe"));

        // Verify it was saved to database
        var dbItem = await _context.Products.Include(c => c.ProductImages).FirstOrDefaultAsync();
        Assert.That(dbItem, Is.Not.Null);
        Assert.That(dbItem!.BrandName, Is.EqualTo("Adidas"));
    }

    [Test]
    public async Task IngestImagesAsync_ShouldHandleMultipleImages()
    {
        // Arrange
        var service = new ProductIngestionService(_imageAnalysisServiceMock.Object, _context, _azureOpenAIServiceMock.Object, _loggerMock.Object);

        var images = new[]
        {
            new byte[] { 1, 2, 3 },
            new byte[] { 4, 5, 6 },
            new byte[] { 7, 8, 9 }
        };

        var analysisResults = new[]
        {
            new ProductAnalysisResult
            {
                Success = true,
                EstimatedMSRP = 100m,
                EstimatedResaleValue = 60m,
                Description = "Puma shoe",
                BrandName = "Puma",
                ItemType = ItemType.Shoe,
                Gender = Gender.Mens,
                Size = "L"
            },
            new ProductAnalysisResult
            {
                Success = true,
                EstimatedMSRP = 80m,
                EstimatedResaleValue = 48m,
                Description = "Adidas jacket",
                BrandName = "Adidas",
                ItemType = ItemType.Jacket,
                Gender = Gender.Womens,
                Size = "M"
            },
            new ProductAnalysisResult
            {
                Success = true,
                EstimatedMSRP = 50m,
                EstimatedResaleValue = 30m,
                Description = "Generic shirt",
                BrandName = "Generic",
                ItemType = ItemType.Shirt,
                Gender = Gender.Unisex,
                Size = "S"
            }
        };

        var callIndex = 0;
        _imageAnalysisServiceMock
            .Setup(s => s.AnalyzeAsync(It.IsAny<byte[]>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(() => analysisResults[callIndex++]);

        // Act
        var result = await service.IngestAsync(images);

        // Assert
        Assert.That(result.Success, Is.True);
        Assert.That(result.TotalProcessed, Is.EqualTo(3));
        Assert.That(result.SuccessfullyProcessed, Is.EqualTo(3));
        Assert.That(result.Failed, Is.EqualTo(0));
        Assert.That(result.Products, Has.Count.EqualTo(3));

        var dbItems = await _context.Products.Include(c => c.ProductImages).ToListAsync();
        Assert.That(dbItems, Has.Count.EqualTo(3));
    }

    [Test]
    public async Task IngestImagesAsync_ShouldHandleFailedAnalysis()
    {
        // Arrange
        var service = new ProductIngestionService(_imageAnalysisServiceMock.Object, _context, _azureOpenAIServiceMock.Object, _loggerMock.Object);

        var images = new[]
        {
            new byte[] { 1, 2, 3 },
            new byte[] { 4, 5, 6 }
        };

        var successResult = new ProductAnalysisResult
        {
            Success = true,
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 60m,
            Description = "Reebok shoe",
            BrandName = "Reebok",
            ItemType = ItemType.Shoe,
            Gender = Gender.Mens,
            Size = "L"
        };

        var failureResult = new ProductAnalysisResult
        {
            Success = false,
            ErrorMessage = "Failed to analyze image"
        };

        var callIndex = 0;
        _imageAnalysisServiceMock
            .Setup(s => s.AnalyzeAsync(It.IsAny<byte[]>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(() => callIndex++ == 0 ? successResult : failureResult);

        // Act
        var result = await service.IngestAsync(images);

        // Assert
        Assert.That(result.Success, Is.True);
        Assert.That(result.TotalProcessed, Is.EqualTo(2));
        Assert.That(result.SuccessfullyProcessed, Is.EqualTo(1));
        Assert.That(result.Failed, Is.EqualTo(1));
        Assert.That(result.Products, Has.Count.EqualTo(1));
        Assert.That(result.Errors, Has.Count.EqualTo(1));
        Assert.That(result.Errors[0], Does.Contain("Failed to analyze image"));
    }

    [Test]
    public async Task IngestImagesAsync_ShouldSkipEmptyImages()
    {
        // Arrange
        var service = new ProductIngestionService(_imageAnalysisServiceMock.Object, _context, _azureOpenAIServiceMock.Object, _loggerMock.Object);

        var images = new[]
        {
            new byte[] { 1, 2, 3 },
            Array.Empty<byte>(),
            new byte[] { 4, 5, 6 }
        };

        var analysisResult = new ProductAnalysisResult
        {
            Success = true,
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 60m,
            Description = "Test item",
            BrandName = "Test",
            ItemType = ItemType.Shoe,
            Gender = Gender.Mens,
            Size = "M"
        };

        _imageAnalysisServiceMock
            .Setup(s => s.AnalyzeAsync(It.IsAny<byte[]>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(analysisResult);

        // Act
        var result = await service.IngestAsync(images);

        // Assert
        Assert.That(result.TotalProcessed, Is.EqualTo(3));
        Assert.That(result.SuccessfullyProcessed, Is.EqualTo(2));
        Assert.That(result.Failed, Is.EqualTo(1));
        Assert.That(result.Errors, Has.Count.EqualTo(1));
        Assert.That(result.Errors[0], Does.Contain("Image at index 1 is empty"));
    }
}
