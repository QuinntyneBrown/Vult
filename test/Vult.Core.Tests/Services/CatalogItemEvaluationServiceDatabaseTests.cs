// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Vult.Core;
using Vult.Infrastructure.Data;

namespace Vult.Core.Tests.Services;

[TestFixture]
public class CatalogItemEvaluationServiceDatabaseTests
{
    private Mock<IImageAnalysisService> _imageAnalysisServiceMock = null!;
    private Mock<ILogger<CatalogItemEvaluationService>> _loggerMock = null!;
    private VultContext _context = null!;
    private CatalogItemEvaluationService _service = null!;

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
        _loggerMock = new Mock<ILogger<CatalogItemEvaluationService>>();
        _context = CreateContext();
        _service = new CatalogItemEvaluationService(
            _imageAnalysisServiceMock.Object,
            _context,
            _loggerMock.Object);
    }

    [TearDown]
    public void TearDown()
    {
        _context?.Dispose();
    }

    private async Task<CatalogItem> CreateCatalogItemWithImage()
    {
        var catalogItem = new CatalogItem
        {
            CatalogItemId = Guid.NewGuid(),
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 60m,
            Description = "Original description",
            Size = "M",
            BrandName = "OriginalBrand",
            Gender = Gender.Mens,
            ItemType = ItemType.Shirt,
            CreatedDate = DateTime.UtcNow.AddDays(-1),
            UpdatedDate = DateTime.UtcNow.AddDays(-1)
        };

        var catalogItemImage = new CatalogItemImage
        {
            CatalogItemImageId = Guid.NewGuid(),
            CatalogItemId = catalogItem.CatalogItemId,
            ImageData = new byte[] { 1, 2, 3, 4, 5 },
            Description = "Original image description",
            CreatedDate = DateTime.UtcNow.AddDays(-1)
        };

        catalogItem.CatalogItemImages.Add(catalogItemImage);

        _context.CatalogItems.Add(catalogItem);
        await _context.SaveChangesAsync();

        return catalogItem;
    }

    [Test]
    public async Task ReEvaluateItemAsync_ShouldUpdateCatalogItem_InDatabase()
    {
        // Arrange
        var catalogItem = await CreateCatalogItemWithImage();

        var newAnalysisResult = new CatalogItemAnalysisResult
        {
            Success = true,
            EstimatedMSRP = 200m,
            EstimatedResaleValue = 120m,
            Description = "Updated description",
            Size = "L",
            BrandName = "UpdatedBrand",
            Gender = Gender.Womens,
            ItemType = ItemType.Jacket
        };

        _imageAnalysisServiceMock
            .Setup(s => s.AnalyzeAsync(It.IsAny<byte[]>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(newAnalysisResult);

        // Act
        var result = await _service.ReEvaluateItemAsync(catalogItem.CatalogItemId);

        // Assert - verify result
        Assert.That(result.Success, Is.True);
        Assert.That(result.CatalogItem, Is.Not.Null);

        // Assert - verify database update
        var dbItem = await _context.CatalogItems.FindAsync(catalogItem.CatalogItemId);
        Assert.That(dbItem, Is.Not.Null);
        Assert.That(dbItem!.EstimatedMSRP, Is.EqualTo(200m));
        Assert.That(dbItem.EstimatedResaleValue, Is.EqualTo(120m));
        Assert.That(dbItem.Description, Is.EqualTo("Updated description"));
        Assert.That(dbItem.Size, Is.EqualTo("L"));
        Assert.That(dbItem.BrandName, Is.EqualTo("UpdatedBrand"));
        Assert.That(dbItem.Gender, Is.EqualTo(Gender.Womens));
        Assert.That(dbItem.ItemType, Is.EqualTo(ItemType.Jacket));
    }

    [Test]
    public async Task ReEvaluateItemAsync_ShouldUpdateUpdatedDate()
    {
        // Arrange
        var catalogItem = await CreateCatalogItemWithImage();
        var originalUpdatedDate = catalogItem.UpdatedDate;

        var analysisResult = new CatalogItemAnalysisResult
        {
            Success = true,
            EstimatedMSRP = 150m,
            EstimatedResaleValue = 90m,
            Description = "New description",
            Size = "M",
            BrandName = "NewBrand",
            Gender = Gender.Mens,
            ItemType = ItemType.Shirt
        };

        _imageAnalysisServiceMock
            .Setup(s => s.AnalyzeAsync(It.IsAny<byte[]>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(analysisResult);

        // Wait a bit to ensure time difference
        await Task.Delay(10);

        // Act
        await _service.ReEvaluateItemAsync(catalogItem.CatalogItemId);

        // Assert
        var dbItem = await _context.CatalogItems.FindAsync(catalogItem.CatalogItemId);
        Assert.That(dbItem, Is.Not.Null);
        Assert.That(dbItem!.UpdatedDate, Is.GreaterThan(originalUpdatedDate));
    }

    [Test]
    public async Task ReEvaluateItemAsync_ShouldNotModifyCreatedDate()
    {
        // Arrange
        var catalogItem = await CreateCatalogItemWithImage();
        var originalCreatedDate = catalogItem.CreatedDate;

        var analysisResult = new CatalogItemAnalysisResult
        {
            Success = true,
            EstimatedMSRP = 150m,
            EstimatedResaleValue = 90m,
            Description = "New description",
            Size = "M",
            BrandName = "NewBrand",
            Gender = Gender.Mens,
            ItemType = ItemType.Shirt
        };

        _imageAnalysisServiceMock
            .Setup(s => s.AnalyzeAsync(It.IsAny<byte[]>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(analysisResult);

        // Act
        await _service.ReEvaluateItemAsync(catalogItem.CatalogItemId);

        // Assert
        var dbItem = await _context.CatalogItems.FindAsync(catalogItem.CatalogItemId);
        Assert.That(dbItem, Is.Not.Null);
        Assert.That(dbItem!.CreatedDate, Is.EqualTo(originalCreatedDate));
    }

    [Test]
    public async Task ReEvaluateItemAsync_ShouldReturnError_WhenItemNotFound()
    {
        // Arrange
        var nonExistentId = Guid.NewGuid();

        // Act
        var result = await _service.ReEvaluateItemAsync(nonExistentId);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Has.Count.EqualTo(1));
        Assert.That(result.Errors[0], Does.Contain(nonExistentId.ToString()));
        Assert.That(result.CatalogItem, Is.Null);
    }

    [Test]
    public async Task ReEvaluateItemAsync_ShouldReturnError_WhenItemHasNoImages()
    {
        // Arrange - create item without images
        var catalogItem = new CatalogItem
        {
            CatalogItemId = Guid.NewGuid(),
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 60m,
            Description = "No images",
            Size = "M",
            BrandName = "Test",
            Gender = Gender.Mens,
            ItemType = ItemType.Shirt,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        _context.CatalogItems.Add(catalogItem);
        await _context.SaveChangesAsync();

        // Act
        var result = await _service.ReEvaluateItemAsync(catalogItem.CatalogItemId);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Has.Count.EqualTo(1));
        Assert.That(result.Errors[0], Does.Contain("no images"));
    }

    [Test]
    public async Task ReEvaluateItemAsync_ShouldNotModifyDatabase_WhenAnalysisFails()
    {
        // Arrange
        var catalogItem = await CreateCatalogItemWithImage();
        var originalMSRP = catalogItem.EstimatedMSRP;
        var originalDescription = catalogItem.Description;

        var failureResult = new CatalogItemAnalysisResult
        {
            Success = false,
            ErrorMessage = "Analysis failed"
        };

        _imageAnalysisServiceMock
            .Setup(s => s.AnalyzeAsync(It.IsAny<byte[]>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(failureResult);

        // Act
        var result = await _service.ReEvaluateItemAsync(catalogItem.CatalogItemId);

        // Assert
        Assert.That(result.Success, Is.False);

        // Verify database was not modified
        var dbItem = await _context.CatalogItems.FindAsync(catalogItem.CatalogItemId);
        Assert.That(dbItem, Is.Not.Null);
        Assert.That(dbItem!.EstimatedMSRP, Is.EqualTo(originalMSRP));
        Assert.That(dbItem.Description, Is.EqualTo(originalDescription));
    }

    [Test]
    public async Task ReEvaluateBatchAsync_ShouldUpdateMultipleItems_InDatabase()
    {
        // Arrange
        var item1 = await CreateCatalogItemWithImage();
        var item2 = await CreateCatalogItemWithImage();

        var analysisResult = new CatalogItemAnalysisResult
        {
            Success = true,
            EstimatedMSRP = 500m,
            EstimatedResaleValue = 300m,
            Description = "Batch updated",
            Size = "XL",
            BrandName = "BatchBrand",
            Gender = Gender.Unisex,
            ItemType = ItemType.Coat
        };

        _imageAnalysisServiceMock
            .Setup(s => s.AnalyzeAsync(It.IsAny<byte[]>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(analysisResult);

        // Act
        var result = await _service.ReEvaluateBatchAsync(
            new[] { item1.CatalogItemId, item2.CatalogItemId });

        // Assert
        Assert.That(result.Success, Is.True);
        Assert.That(result.SuccessfullyProcessed, Is.EqualTo(2));
        Assert.That(result.Failed, Is.EqualTo(0));

        // Verify database updates
        var dbItem1 = await _context.CatalogItems.FindAsync(item1.CatalogItemId);
        var dbItem2 = await _context.CatalogItems.FindAsync(item2.CatalogItemId);

        Assert.That(dbItem1!.Description, Is.EqualTo("Batch updated"));
        Assert.That(dbItem2!.Description, Is.EqualTo("Batch updated"));
        Assert.That(dbItem1.EstimatedMSRP, Is.EqualTo(500m));
        Assert.That(dbItem2.EstimatedMSRP, Is.EqualTo(500m));
    }

    [Test]
    public async Task ReEvaluateBatchAsync_ShouldHandlePartialSuccess()
    {
        // Arrange
        var item1 = await CreateCatalogItemWithImage();
        var nonExistentId = Guid.NewGuid();

        var analysisResult = new CatalogItemAnalysisResult
        {
            Success = true,
            EstimatedMSRP = 500m,
            EstimatedResaleValue = 300m,
            Description = "Updated",
            Size = "M",
            BrandName = "Test",
            Gender = Gender.Mens,
            ItemType = ItemType.Shirt
        };

        _imageAnalysisServiceMock
            .Setup(s => s.AnalyzeAsync(It.IsAny<byte[]>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(analysisResult);

        // Act
        var result = await _service.ReEvaluateBatchAsync(
            new[] { item1.CatalogItemId, nonExistentId });

        // Assert
        Assert.That(result.Success, Is.True); // At least one succeeded
        Assert.That(result.SuccessfullyProcessed, Is.EqualTo(1));
        Assert.That(result.Failed, Is.EqualTo(1));
        Assert.That(result.Errors, Has.Count.EqualTo(1));
    }

    [Test]
    public async Task ReEvaluateBatchAsync_ShouldReturnError_WhenIdsIsEmpty()
    {
        // Act
        var result = await _service.ReEvaluateBatchAsync(Array.Empty<Guid>());

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Contains.Item("No catalog item IDs provided"));
    }

    [Test]
    public async Task ReEvaluateBatchAsync_ShouldReturnError_WhenIdsIsNull()
    {
        // Act
        var result = await _service.ReEvaluateBatchAsync(null!);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Contains.Item("No catalog item IDs provided"));
    }

    [Test]
    public async Task ReEvaluateItemAsync_ShouldLoadItemWithImages_FromDatabase()
    {
        // Arrange
        var catalogItem = await CreateCatalogItemWithImage();
        var expectedImageData = catalogItem.CatalogItemImages.First().ImageData;

        byte[]? capturedImageData = null;
        var analysisResult = new CatalogItemAnalysisResult
        {
            Success = true,
            EstimatedMSRP = 150m,
            EstimatedResaleValue = 90m,
            Description = "Updated",
            Size = "M",
            BrandName = "Test",
            Gender = Gender.Mens,
            ItemType = ItemType.Shirt
        };

        _imageAnalysisServiceMock
            .Setup(s => s.AnalyzeAsync(It.IsAny<byte[]>(), It.IsAny<CancellationToken>()))
            .Callback<byte[], CancellationToken>((data, _) => capturedImageData = data)
            .ReturnsAsync(analysisResult);

        // Act
        await _service.ReEvaluateItemAsync(catalogItem.CatalogItemId);

        // Assert - verify the correct image data was passed to analysis
        Assert.That(capturedImageData, Is.Not.Null);
        Assert.That(capturedImageData, Is.EqualTo(expectedImageData));
    }

    [Test]
    public async Task ReEvaluateItemAsync_ShouldPreserveExistingImages()
    {
        // Arrange
        var catalogItem = await CreateCatalogItemWithImage();
        var originalImageCount = catalogItem.CatalogItemImages.Count;
        var originalImageId = catalogItem.CatalogItemImages.First().CatalogItemImageId;

        var analysisResult = new CatalogItemAnalysisResult
        {
            Success = true,
            EstimatedMSRP = 150m,
            EstimatedResaleValue = 90m,
            Description = "Updated",
            Size = "M",
            BrandName = "Test",
            Gender = Gender.Mens,
            ItemType = ItemType.Shirt
        };

        _imageAnalysisServiceMock
            .Setup(s => s.AnalyzeAsync(It.IsAny<byte[]>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(analysisResult);

        // Act
        await _service.ReEvaluateItemAsync(catalogItem.CatalogItemId);

        // Assert - images should not be modified
        var dbItem = await _context.CatalogItems
            .Include(c => c.CatalogItemImages)
            .FirstOrDefaultAsync(c => c.CatalogItemId == catalogItem.CatalogItemId);

        Assert.That(dbItem, Is.Not.Null);
        Assert.That(dbItem!.CatalogItemImages, Has.Count.EqualTo(originalImageCount));
        Assert.That(dbItem.CatalogItemImages.First().CatalogItemImageId, Is.EqualTo(originalImageId));
    }
}
