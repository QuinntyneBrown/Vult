// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Vult.Core;
using Vult.Core;
using Vult.Core;
using Vult.Core;
using Vult.Infrastructure.Data;

namespace Vult.Infrastructure.Tests.Services;

[TestFixture]
public class CatalogItemEvaluationServiceTests
{
    private Mock<IImageAnalysisService> _azureAIServiceMock = null!;
    private Mock<ILogger<CatalogItemEvaluationService>> _loggerMock = null!;
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
        _azureAIServiceMock = new Mock<IImageAnalysisService>();
        _loggerMock = new Mock<ILogger<CatalogItemEvaluationService>>();
        _context = GetInMemoryContext();
    }

    [TearDown]
    public void TearDown()
    {
        _context?.Dispose();
    }

    [Test]
    public async Task ReEvaluateItemAsync_ShouldReturnError_WhenCatalogItemNotFound()
    {
        // Arrange
        var service = new CatalogItemEvaluationService(_azureAIServiceMock.Object, _context, _loggerMock.Object);
        var nonExistentId = Guid.NewGuid();

        // Act
        var result = await service.ReEvaluateItemAsync(nonExistentId);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Has.Count.EqualTo(1));
        Assert.That(result.Errors[0], Does.Contain("not found"));
    }

    [Test]
    public async Task ReEvaluateItemAsync_ShouldReturnError_WhenCatalogItemHasNoImages()
    {
        // Arrange
        var service = new CatalogItemEvaluationService(_azureAIServiceMock.Object, _context, _loggerMock.Object);
        
        var catalogItem = new CatalogItem
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

        _context.CatalogItems.Add(catalogItem);
        await _context.SaveChangesAsync();

        // Act
        var result = await service.ReEvaluateItemAsync(catalogItem.CatalogItemId);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Has.Count.EqualTo(1));
        Assert.That(result.Errors[0], Does.Contain("no images"));
    }

    [Test]
    public async Task ReEvaluateItemAsync_ShouldUpdateCatalogItem_WhenAnalysisSucceeds()
    {
        // Arrange
        var service = new CatalogItemEvaluationService(_azureAIServiceMock.Object, _context, _loggerMock.Object);
        
        var catalogItem = new CatalogItem
        {
            CatalogItemId = Guid.NewGuid(),
            BrandName = "Old Brand",
            Description = "Old Description",
            Size = "S",
            EstimatedMSRP = 50m,
            EstimatedResaleValue = 30m,
            Gender = Gender.Womens,
            ItemType = ItemType.Dress,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow,
            CatalogItemImages = new List<CatalogItemImage>
            {
                new CatalogItemImage
                {
                    CatalogItemImageId = Guid.NewGuid(),
                    ImageData = new byte[] { 1, 2, 3 },
                    Description = "Test Image",
                    CreatedDate = DateTime.UtcNow
                }
            }
        };

        _context.CatalogItems.Add(catalogItem);
        await _context.SaveChangesAsync();

        var analysisResult = new CatalogItemAnalysisResult
        {
            Success = true,
            BrandName = "New Brand",
            Description = "New Description",
            Size = "L",
            EstimatedMSRP = 120m,
            EstimatedResaleValue = 72m,
            Gender = Gender.Mens,
            ItemType = ItemType.Jacket,
            ImageDescription = "Updated Image"
        };

        _azureAIServiceMock
            .Setup(x => x.AnalyzeAsync(It.IsAny<byte[]>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(analysisResult);

        // Act
        var result = await service.ReEvaluateItemAsync(catalogItem.CatalogItemId);

        // Assert
        Assert.That(result.Success, Is.True);
        Assert.That(result.CatalogItem, Is.Not.Null);
        Assert.That(result.CatalogItem!.BrandName, Is.EqualTo("New Brand"));
        Assert.That(result.CatalogItem.Description, Is.EqualTo("New Description"));
        Assert.That(result.CatalogItem.Size, Is.EqualTo("L"));
        Assert.That(result.CatalogItem.EstimatedMSRP, Is.EqualTo(120m));
        Assert.That(result.CatalogItem.EstimatedResaleValue, Is.EqualTo(72m));
        Assert.That(result.CatalogItem.Gender, Is.EqualTo(Gender.Mens));
        Assert.That(result.CatalogItem.ItemType, Is.EqualTo(ItemType.Jacket));
    }

    [Test]
    public async Task ReEvaluateItemAsync_ShouldReturnError_WhenAnalysisFails()
    {
        // Arrange
        var service = new CatalogItemEvaluationService(_azureAIServiceMock.Object, _context, _loggerMock.Object);
        
        var catalogItem = new CatalogItem
        {
            CatalogItemId = Guid.NewGuid(),
            BrandName = "Test Brand",
            Description = "Test Description",
            Size = "M",
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 60m,
            Gender = Gender.Unisex,
            ItemType = ItemType.Shirt,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow,
            CatalogItemImages = new List<CatalogItemImage>
            {
                new CatalogItemImage
                {
                    CatalogItemImageId = Guid.NewGuid(),
                    ImageData = new byte[] { 1, 2, 3 },
                    Description = "Test Image",
                    CreatedDate = DateTime.UtcNow
                }
            }
        };

        _context.CatalogItems.Add(catalogItem);
        await _context.SaveChangesAsync();

        var analysisResult = new CatalogItemAnalysisResult
        {
            Success = false,
            ErrorMessage = "AI service error"
        };

        _azureAIServiceMock
            .Setup(x => x.AnalyzeAsync(It.IsAny<byte[]>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(analysisResult);

        // Act
        var result = await service.ReEvaluateItemAsync(catalogItem.CatalogItemId);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Has.Count.EqualTo(1));
        Assert.That(result.Errors[0], Does.Contain("AI service error"));
    }

    [Test]
    public async Task ReEvaluateBatchAsync_ShouldReturnError_WhenNoIdsProvided()
    {
        // Arrange
        var service = new CatalogItemEvaluationService(_azureAIServiceMock.Object, _context, _loggerMock.Object);

        // Act
        var result = await service.ReEvaluateBatchAsync(Array.Empty<Guid>());

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Has.Count.EqualTo(1));
        Assert.That(result.Errors[0], Does.Contain("No catalog item IDs"));
    }

    [Test]
    public async Task ReEvaluateBatchAsync_ShouldProcessMultipleItems_WhenAllSucceed()
    {
        // Arrange
        var service = new CatalogItemEvaluationService(_azureAIServiceMock.Object, _context, _loggerMock.Object);
        
        var catalogItem1 = new CatalogItem
        {
            CatalogItemId = Guid.NewGuid(),
            BrandName = "Brand 1",
            Description = "Description 1",
            Size = "S",
            EstimatedMSRP = 50m,
            EstimatedResaleValue = 30m,
            Gender = Gender.Mens,
            ItemType = ItemType.Shirt,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow,
            CatalogItemImages = new List<CatalogItemImage>
            {
                new CatalogItemImage
                {
                    CatalogItemImageId = Guid.NewGuid(),
                    ImageData = new byte[] { 1, 2, 3 },
                    Description = "Image 1",
                    CreatedDate = DateTime.UtcNow
                }
            }
        };

        var catalogItem2 = new CatalogItem
        {
            CatalogItemId = Guid.NewGuid(),
            BrandName = "Brand 2",
            Description = "Description 2",
            Size = "M",
            EstimatedMSRP = 80m,
            EstimatedResaleValue = 48m,
            Gender = Gender.Womens,
            ItemType = ItemType.Pants,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow,
            CatalogItemImages = new List<CatalogItemImage>
            {
                new CatalogItemImage
                {
                    CatalogItemImageId = Guid.NewGuid(),
                    ImageData = new byte[] { 4, 5, 6 },
                    Description = "Image 2",
                    CreatedDate = DateTime.UtcNow
                }
            }
        };

        _context.CatalogItems.AddRange(catalogItem1, catalogItem2);
        await _context.SaveChangesAsync();

        var analysisResult = new CatalogItemAnalysisResult
        {
            Success = true,
            BrandName = "Updated Brand",
            Description = "Updated Description",
            Size = "L",
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 60m,
            Gender = Gender.Unisex,
            ItemType = ItemType.Jacket,
            ImageDescription = "Updated"
        };

        _azureAIServiceMock
            .Setup(x => x.AnalyzeAsync(It.IsAny<byte[]>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(analysisResult);

        // Act
        var result = await service.ReEvaluateBatchAsync(new[] { catalogItem1.CatalogItemId, catalogItem2.CatalogItemId });

        // Assert
        Assert.That(result.Success, Is.True);
        Assert.That(result.TotalProcessed, Is.EqualTo(2));
        Assert.That(result.SuccessfullyProcessed, Is.EqualTo(2));
        Assert.That(result.Failed, Is.EqualTo(0));
        Assert.That(result.CatalogItems, Has.Count.EqualTo(2));
    }

    [Test]
    public async Task ReEvaluateBatchAsync_ShouldPartiallySucceed_WhenSomeItemsFail()
    {
        // Arrange
        var service = new CatalogItemEvaluationService(_azureAIServiceMock.Object, _context, _loggerMock.Object);
        
        var catalogItem1 = new CatalogItem
        {
            CatalogItemId = Guid.NewGuid(),
            BrandName = "Brand 1",
            Description = "Description 1",
            Size = "S",
            EstimatedMSRP = 50m,
            EstimatedResaleValue = 30m,
            Gender = Gender.Mens,
            ItemType = ItemType.Shirt,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow,
            CatalogItemImages = new List<CatalogItemImage>
            {
                new CatalogItemImage
                {
                    CatalogItemImageId = Guid.NewGuid(),
                    ImageData = new byte[] { 1, 2, 3 },
                    Description = "Image 1",
                    CreatedDate = DateTime.UtcNow
                }
            }
        };

        _context.CatalogItems.Add(catalogItem1);
        await _context.SaveChangesAsync();

        var analysisResult = new CatalogItemAnalysisResult
        {
            Success = true,
            BrandName = "Updated Brand",
            Description = "Updated Description",
            Size = "L",
            EstimatedMSRP = 100m,
            EstimatedResaleValue = 60m,
            Gender = Gender.Unisex,
            ItemType = ItemType.Jacket,
            ImageDescription = "Updated"
        };

        _azureAIServiceMock
            .Setup(x => x.AnalyzeAsync(It.IsAny<byte[]>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(analysisResult);

        var nonExistentId = Guid.NewGuid();

        // Act
        var result = await service.ReEvaluateBatchAsync(new[] { catalogItem1.CatalogItemId, nonExistentId });

        // Assert
        Assert.That(result.Success, Is.True); // Still successful because at least one item succeeded
        Assert.That(result.TotalProcessed, Is.EqualTo(2));
        Assert.That(result.SuccessfullyProcessed, Is.EqualTo(1));
        Assert.That(result.Failed, Is.EqualTo(1));
        Assert.That(result.CatalogItems, Has.Count.EqualTo(1));
        Assert.That(result.Errors, Has.Count.GreaterThan(0));
    }
}
