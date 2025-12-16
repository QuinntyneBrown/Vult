using Microsoft.EntityFrameworkCore;
using Vult.Core.Enums;
using Vult.Core.Models;
using Vult.Infrastructure.Data;

namespace Vult.Infrastructure.Tests.Data;

[TestFixture]
public class VultContextTests
{
    private DbContextOptions<VultContext> _options = null!;

    [SetUp]
    public void Setup()
    {
        _options = new DbContextOptionsBuilder<VultContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
    }

    [Test]
    public async Task CatalogItem_ShouldBeSavedAndRetrieved()
    {
        // Arrange
        using var context = new VultContext(_options);
        var catalogItem = new CatalogItem
        {
            CatalogItemId = Guid.NewGuid(),
            Description = "Test Description",
            Size = "M",
            BrandName = "Test Brand",
            EstimatedMSRP = 99.99m,
            EstimatedResaleValue = 59.99m,
            Gender = Gender.Mens,
            ItemType = ItemType.Shoe,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        // Act
        context.CatalogItems.Add(catalogItem);
        await context.SaveChangesAsync();

        // Assert
        var savedItem = await context.CatalogItems.FindAsync(catalogItem.CatalogItemId);
        Assert.That(savedItem, Is.Not.Null);
        Assert.That(savedItem!.Description, Is.EqualTo("Test Description"));
        Assert.That(savedItem.EstimatedMSRP, Is.EqualTo(99.99m));
    }

    [Test]
    public async Task CatalogItemImage_ShouldBeSavedAndRetrieved()
    {
        // Arrange
        using var context = new VultContext(_options);
        var image = new CatalogItemImage
        {
            CatalogItemImageId = Guid.NewGuid(),
            CatalogItemId = Guid.NewGuid(),
            ImageData = new byte[] { 1, 2, 3, 4, 5 },
            Description = "AI-generated description",
            CreatedDate = DateTime.UtcNow
        };

        // Act
        context.CatalogItemImages.Add(image);
        await context.SaveChangesAsync();

        // Assert
        var savedImage = await context.CatalogItemImages.FindAsync(image.CatalogItemImageId);
        Assert.That(savedImage, Is.Not.Null);
        Assert.That(savedImage!.ImageData, Is.EqualTo(new byte[] { 1, 2, 3, 4, 5 }));
        Assert.That(savedImage.Description, Is.EqualTo("AI-generated description"));
    }

    [Test]
    public async Task CatalogItem_WithImages_ShouldSaveRelationship()
    {
        // Arrange
        using var context = new VultContext(_options);
        var catalogItem = new CatalogItem
        {
            CatalogItemId = Guid.NewGuid(),
            Description = "Test Item",
            Size = "L",
            BrandName = "Nike",
            EstimatedMSRP = 149.99m,
            EstimatedResaleValue = 89.99m,
            Gender = Gender.Unisex,
            ItemType = ItemType.Jacket,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        var image = new CatalogItemImage
        {
            CatalogItemImageId = Guid.NewGuid(),
            CatalogItemId = catalogItem.CatalogItemId,
            ImageData = new byte[] { 0xFF, 0xD8, 0xFF, 0xE0 },
            Description = "Front view of jacket",
            CreatedDate = DateTime.UtcNow
        };

        // Act
        context.CatalogItems.Add(catalogItem);
        context.CatalogItemImages.Add(image);
        await context.SaveChangesAsync();

        // Assert
        var savedItem = await context.CatalogItems
            .Include(c => c.CatalogItemImages)
            .FirstOrDefaultAsync(c => c.CatalogItemId == catalogItem.CatalogItemId);

        Assert.That(savedItem, Is.Not.Null);
        Assert.That(savedItem!.CatalogItemImages.Count, Is.EqualTo(1));
        Assert.That(savedItem.CatalogItemImages.First().Description, Is.EqualTo("Front view of jacket"));
    }

    [Test]
    public async Task CatalogItem_Deletion_ShouldCascadeToImages()
    {
        // Arrange
        using var context = new VultContext(_options);
        var catalogItem = new CatalogItem
        {
            CatalogItemId = Guid.NewGuid(),
            Description = "Test Item",
            Size = "M",
            BrandName = "Adidas",
            EstimatedMSRP = 79.99m,
            EstimatedResaleValue = 49.99m,
            Gender = Gender.Womens,
            ItemType = ItemType.Shirt,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        var image1 = new CatalogItemImage
        {
            CatalogItemImageId = Guid.NewGuid(),
            CatalogItemId = catalogItem.CatalogItemId,
            ImageData = new byte[] { 1, 2, 3 },
            Description = "Image 1",
            CreatedDate = DateTime.UtcNow
        };

        var image2 = new CatalogItemImage
        {
            CatalogItemImageId = Guid.NewGuid(),
            CatalogItemId = catalogItem.CatalogItemId,
            ImageData = new byte[] { 4, 5, 6 },
            Description = "Image 2",
            CreatedDate = DateTime.UtcNow
        };

        context.CatalogItems.Add(catalogItem);
        context.CatalogItemImages.Add(image1);
        context.CatalogItemImages.Add(image2);
        await context.SaveChangesAsync();

        // Act
        context.CatalogItems.Remove(catalogItem);
        await context.SaveChangesAsync();

        // Assert
        var remainingImages = await context.CatalogItemImages
            .Where(i => i.CatalogItemId == catalogItem.CatalogItemId)
            .ToListAsync();

        Assert.That(remainingImages.Count, Is.EqualTo(0));
    }

    [Test]
    public async Task CatalogItem_DecimalPrecision_ShouldBePreserved()
    {
        // Arrange
        using var context = new VultContext(_options);
        var catalogItem = new CatalogItem
        {
            CatalogItemId = Guid.NewGuid(),
            Description = "Test Precision",
            Size = "XL",
            BrandName = "Precision Brand",
            EstimatedMSRP = 123.45m,
            EstimatedResaleValue = 67.89m,
            Gender = Gender.Mens,
            ItemType = ItemType.Pants,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        // Act
        context.CatalogItems.Add(catalogItem);
        await context.SaveChangesAsync();

        // Assert
        var savedItem = await context.CatalogItems.FindAsync(catalogItem.CatalogItemId);
        Assert.That(savedItem, Is.Not.Null);
        Assert.That(savedItem!.EstimatedMSRP, Is.EqualTo(123.45m));
        Assert.That(savedItem.EstimatedResaleValue, Is.EqualTo(67.89m));
    }

    [Test]
    public async Task CatalogItem_EnumConversion_ShouldWork()
    {
        // Arrange
        using var context = new VultContext(_options);
        var catalogItem = new CatalogItem
        {
            CatalogItemId = Guid.NewGuid(),
            Description = "Test Enums",
            Size = "S",
            BrandName = "Enum Brand",
            EstimatedMSRP = 50.00m,
            EstimatedResaleValue = 30.00m,
            Gender = Gender.Unisex,
            ItemType = ItemType.Hoodie,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        // Act
        context.CatalogItems.Add(catalogItem);
        await context.SaveChangesAsync();

        // Assert
        var savedItem = await context.CatalogItems.FindAsync(catalogItem.CatalogItemId);
        Assert.That(savedItem, Is.Not.Null);
        Assert.That(savedItem!.Gender, Is.EqualTo(Gender.Unisex));
        Assert.That(savedItem.ItemType, Is.EqualTo(ItemType.Hoodie));
    }

    [Test]
    public async Task CatalogItemImage_ByteArray_ShouldHandleLargeData()
    {
        // Arrange
        using var context = new VultContext(_options);
        var largeImageData = new byte[1024 * 100]; // 100 KB
        for (int i = 0; i < largeImageData.Length; i++)
        {
            largeImageData[i] = (byte)(i % 256);
        }

        var image = new CatalogItemImage
        {
            CatalogItemImageId = Guid.NewGuid(),
            CatalogItemId = Guid.NewGuid(),
            ImageData = largeImageData,
            Description = "Large image data test",
            CreatedDate = DateTime.UtcNow
        };

        // Act
        context.CatalogItemImages.Add(image);
        await context.SaveChangesAsync();

        // Assert
        var savedImage = await context.CatalogItemImages.FindAsync(image.CatalogItemImageId);
        Assert.That(savedImage, Is.Not.Null);
        Assert.That(savedImage!.ImageData.Length, Is.EqualTo(1024 * 100));
        Assert.That(savedImage.ImageData[0], Is.EqualTo(0));
        Assert.That(savedImage.ImageData[255], Is.EqualTo(255));
    }
}
