// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Vult.Core;
using Vult.Infrastructure.Data;

namespace Vult.Core.Tests.Services;

[TestFixture]
public class CatalogItemIngestionServiceDatabaseTests
{
    private Mock<IImageAnalysisService> _imageAnalysisServiceMock = null!;
    private Mock<ILogger<CatalogItemIngestionService>> _loggerMock = null!;
    private Mock<IAzureOpenAIService> _azureOpenAIServiceMock = null!;
    private VultContext _context = null!;
    private CatalogItemIngestionService _service = null!;

    private VultContext CreateContext()
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
        _loggerMock = new Mock<ILogger<CatalogItemIngestionService>>();
        _azureOpenAIServiceMock = new Mock<IAzureOpenAIService>();
        _context = CreateContext();
        _service = new CatalogItemIngestionService(
            _imageAnalysisServiceMock.Object,
            _context,
            _azureOpenAIServiceMock.Object,
            _loggerMock.Object);
    }

    [TearDown]
    public void TearDown()
    {
        _context?.Dispose();
    }

    [Test]
    public async Task IngestAsync_ShouldPersistCatalogItem_ToDatabase()
    {
        // Arrange
        var imageData = new byte[] { 1, 2, 3, 4, 5 };
        var images = new[] { imageData };

        var analysisResult = new CatalogItemAnalysisResult
        {
            Success = true,
            EstimatedMSRP = 150m,
            EstimatedResaleValue = 90m,
            Description = "Premium Nike running shoe",
            Size = "10",
            BrandName = "Nike",
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe,
            ImageDescription = "A stylish running shoe"
        };

        _imageAnalysisServiceMock
            .Setup(s => s.AnalyzeAsync(It.IsAny<byte[]>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(analysisResult);

        // Act
        var result = await _service.IngestAsync(images);

        // Assert - verify result
        Assert.That(result.Success, Is.True);
        Assert.That(result.SuccessfullyProcessed, Is.EqualTo(1));

        // Assert - verify database persistence
        var catalogItems = await _context.CatalogItems.ToListAsync();
        Assert.That(catalogItems, Has.Count.EqualTo(1));

        var dbItem = catalogItems[0];
        Assert.That(dbItem.BrandName, Is.EqualTo("Nike"));
        Assert.That(dbItem.EstimatedMSRP, Is.EqualTo(150m));
        Assert.That(dbItem.EstimatedResaleValue, Is.EqualTo(90m));
        Assert.That(dbItem.Description, Is.EqualTo("Premium Nike running shoe"));
        Assert.That(dbItem.Size, Is.EqualTo("10"));
        Assert.That(dbItem.Gender, Is.EqualTo(Gender.Mens));
        Assert.That(dbItem.ItemType, Is.EqualTo(ItemType.Shoe));
    }

    [Test]
    public async Task IngestAsync_ShouldPersistCatalogItemImages_ToDatabase()
    {
        // Arrange
        var imageData = new byte[] { 10, 20, 30, 40, 50 };
        var images = new[] { imageData };

        var analysisResult = new CatalogItemAnalysisResult
        {
            Success = true,
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 60m,
            Description = "Test item",
            Size = "M",
            BrandName = "Adidas",
            Gender = Gender.Unisex,
            ItemType = ItemType.Jacket,
            ImageDescription = "A red jacket"
        };

        _imageAnalysisServiceMock
            .Setup(s => s.AnalyzeAsync(It.IsAny<byte[]>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(analysisResult);

        // Act
        await _service.IngestAsync(images);

        // Assert - verify image persistence
        var catalogItemImages = await _context.CatalogItemImages.ToListAsync();
        Assert.That(catalogItemImages, Has.Count.EqualTo(1));

        var dbImage = catalogItemImages[0];
        Assert.That(dbImage.ImageData, Is.EqualTo(imageData));
        Assert.That(dbImage.Description, Is.EqualTo("A red jacket"));
        Assert.That(dbImage.CreatedDate, Is.Not.EqualTo(default(DateTime)));
    }

    [Test]
    public async Task IngestAsync_ShouldMaintainRelationship_BetweenCatalogItemAndImages()
    {
        // Arrange
        var imageData = new byte[] { 1, 2, 3 };
        var images = new[] { imageData };

        var analysisResult = new CatalogItemAnalysisResult
        {
            Success = true,
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 60m,
            Description = "Test item",
            Size = "M",
            BrandName = "Test",
            Gender = Gender.Mens,
            ItemType = ItemType.Shirt,
            ImageDescription = "Test image"
        };

        _imageAnalysisServiceMock
            .Setup(s => s.AnalyzeAsync(It.IsAny<byte[]>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(analysisResult);

        // Act
        await _service.IngestAsync(images);

        // Assert - verify relationship
        var catalogItem = await _context.CatalogItems
            .Include(c => c.CatalogItemImages)
            .FirstOrDefaultAsync();

        Assert.That(catalogItem, Is.Not.Null);
        Assert.That(catalogItem!.CatalogItemImages, Has.Count.EqualTo(1));

        var image = catalogItem.CatalogItemImages.First();
        Assert.That(image.CatalogItemId, Is.EqualTo(catalogItem.CatalogItemId));
    }

    [Test]
    public async Task IngestAsync_ShouldPersistMultipleCatalogItems_ToDatabase()
    {
        // Arrange
        var images = new[]
        {
            new byte[] { 1, 2, 3 },
            new byte[] { 4, 5, 6 },
            new byte[] { 7, 8, 9 }
        };

        var callIndex = 0;
        var analysisResults = new[]
        {
            new CatalogItemAnalysisResult
            {
                Success = true,
                EstimatedMSRP = 100m,
                EstimatedResaleValue = 60m,
                Description = "Item 1",
                BrandName = "Nike",
                ItemType = ItemType.Shoe,
                Gender = Gender.Mens,
                Size = "10"
            },
            new CatalogItemAnalysisResult
            {
                Success = true,
                EstimatedMSRP = 200m,
                EstimatedResaleValue = 120m,
                Description = "Item 2",
                BrandName = "Adidas",
                ItemType = ItemType.Jacket,
                Gender = Gender.Womens,
                Size = "S"
            },
            new CatalogItemAnalysisResult
            {
                Success = true,
                EstimatedMSRP = 300m,
                EstimatedResaleValue = 180m,
                Description = "Item 3",
                BrandName = "Puma",
                ItemType = ItemType.Pants,
                Gender = Gender.Unisex,
                Size = "M"
            }
        };

        _imageAnalysisServiceMock
            .Setup(s => s.AnalyzeAsync(It.IsAny<byte[]>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(() => analysisResults[callIndex++]);

        // Act
        var result = await _service.IngestAsync(images);

        // Assert
        Assert.That(result.Success, Is.True);
        Assert.That(result.SuccessfullyProcessed, Is.EqualTo(3));

        var catalogItems = await _context.CatalogItems.ToListAsync();
        Assert.That(catalogItems, Has.Count.EqualTo(3));

        var brands = catalogItems.Select(c => c.BrandName).ToList();
        Assert.That(brands, Contains.Item("Nike"));
        Assert.That(brands, Contains.Item("Adidas"));
        Assert.That(brands, Contains.Item("Puma"));
    }

    [Test]
    public async Task IngestAsync_ShouldSetCreatedAndUpdatedDates()
    {
        // Arrange
        var beforeTest = DateTime.UtcNow.AddSeconds(-1);
        var imageData = new byte[] { 1, 2, 3 };
        var images = new[] { imageData };

        var analysisResult = new CatalogItemAnalysisResult
        {
            Success = true,
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 60m,
            Description = "Test item",
            Size = "M",
            BrandName = "Test",
            Gender = Gender.Mens,
            ItemType = ItemType.Shirt,
            ImageDescription = "Test image"
        };

        _imageAnalysisServiceMock
            .Setup(s => s.AnalyzeAsync(It.IsAny<byte[]>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(analysisResult);

        // Act
        await _service.IngestAsync(images);
        var afterTest = DateTime.UtcNow.AddSeconds(1);

        // Assert
        var catalogItem = await _context.CatalogItems.FirstOrDefaultAsync();
        Assert.That(catalogItem, Is.Not.Null);
        Assert.That(catalogItem!.CreatedDate, Is.GreaterThan(beforeTest));
        Assert.That(catalogItem.CreatedDate, Is.LessThan(afterTest));
        Assert.That(catalogItem.UpdatedDate, Is.GreaterThan(beforeTest));
        Assert.That(catalogItem.UpdatedDate, Is.LessThan(afterTest));
    }

    [Test]
    public async Task IngestAsync_ShouldNotPersistAnything_WhenAllImagesFail()
    {
        // Arrange
        var images = new[]
        {
            new byte[] { 1, 2, 3 },
            new byte[] { 4, 5, 6 }
        };

        var failureResult = new CatalogItemAnalysisResult
        {
            Success = false,
            ErrorMessage = "Analysis failed"
        };

        _imageAnalysisServiceMock
            .Setup(s => s.AnalyzeAsync(It.IsAny<byte[]>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(failureResult);

        // Act
        var result = await _service.IngestAsync(images);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.SuccessfullyProcessed, Is.EqualTo(0));
        Assert.That(result.Failed, Is.EqualTo(2));

        var catalogItems = await _context.CatalogItems.ToListAsync();
        Assert.That(catalogItems, Has.Count.EqualTo(0));
    }

    [Test]
    public async Task IngestAsync_ShouldPersistPartialSuccess_WhenSomeImagesFail()
    {
        // Arrange
        var images = new[]
        {
            new byte[] { 1, 2, 3 },
            new byte[] { 4, 5, 6 }
        };

        var callIndex = 0;
        var successResult = new CatalogItemAnalysisResult
        {
            Success = true,
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 60m,
            Description = "Test item",
            Size = "M",
            BrandName = "Test",
            Gender = Gender.Mens,
            ItemType = ItemType.Shirt
        };

        var failureResult = new CatalogItemAnalysisResult
        {
            Success = false,
            ErrorMessage = "Analysis failed"
        };

        _imageAnalysisServiceMock
            .Setup(s => s.AnalyzeAsync(It.IsAny<byte[]>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(() => callIndex++ == 0 ? successResult : failureResult);

        // Act
        var result = await _service.IngestAsync(images);

        // Assert
        Assert.That(result.Success, Is.True);
        Assert.That(result.SuccessfullyProcessed, Is.EqualTo(1));
        Assert.That(result.Failed, Is.EqualTo(1));

        var catalogItems = await _context.CatalogItems.ToListAsync();
        Assert.That(catalogItems, Has.Count.EqualTo(1));
    }

    [Test]
    public async Task IngestAsync_ShouldGenerateUniqueIds_ForEachItem()
    {
        // Arrange
        var images = new[]
        {
            new byte[] { 1, 2, 3 },
            new byte[] { 4, 5, 6 }
        };

        var analysisResult = new CatalogItemAnalysisResult
        {
            Success = true,
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 60m,
            Description = "Test item",
            Size = "M",
            BrandName = "Test",
            Gender = Gender.Mens,
            ItemType = ItemType.Shirt
        };

        _imageAnalysisServiceMock
            .Setup(s => s.AnalyzeAsync(It.IsAny<byte[]>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(analysisResult);

        // Act
        await _service.IngestAsync(images);

        // Assert
        var catalogItems = await _context.CatalogItems.ToListAsync();
        var ids = catalogItems.Select(c => c.CatalogItemId).ToList();
        Assert.That(ids, Is.Unique);
        Assert.That(ids, Has.None.EqualTo(Guid.Empty));
    }
}
