// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Moq;
using Vult.Api.Features.DigitalAssets;
using Vult.Infrastructure.Data;

namespace Vult.Api.Tests.Features.DigitalAssets;

[TestFixture]
public class UploadDigitalAssetCommandHandlerTests
{
    private VultContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<VultContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new VultContext(options);
    }

    private IFormFile CreateMockFile(string filename, byte[] content)
    {
        var stream = new MemoryStream(content);
        var mockFile = new Mock<IFormFile>();
        mockFile.Setup(f => f.FileName).Returns(filename);
        mockFile.Setup(f => f.Length).Returns(content.Length);
        mockFile.Setup(f => f.ContentType).Returns("image/jpeg");
        mockFile.Setup(f => f.OpenReadStream()).Returns(stream);
        mockFile.Setup(f => f.CopyToAsync(It.IsAny<Stream>(), It.IsAny<CancellationToken>()))
            .Callback<Stream, CancellationToken>((s, ct) =>
            {
                stream.Position = 0;
                stream.CopyTo(s);
            })
            .Returns(Task.CompletedTask);

        return mockFile.Object;
    }

    [Test]
    public async Task HandleAsync_ShouldCreateDigitalAsset_WhenValidJpeg()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new UploadDigitalAssetCommandHandler(context);

        // JPEG magic bytes
        var jpegBytes = new byte[] { 0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10 };
        var mockFile = CreateMockFile("test-image.jpg", jpegBytes);

        var command = new UploadDigitalAssetCommand { File = mockFile };

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        Assert.That(result.Success, Is.True);
        Assert.That(result.DigitalAsset, Is.Not.Null);
        Assert.That(result.DigitalAsset!.Name, Is.EqualTo("test-image.jpg"));
        Assert.That(result.DigitalAsset.ContentType, Is.EqualTo("image/jpeg"));

        var assetInDb = await context.DigitalAssets.FirstOrDefaultAsync();
        Assert.That(assetInDb, Is.Not.Null);
    }

    [Test]
    public async Task HandleAsync_ShouldReturnError_WhenNoFileProvided()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new UploadDigitalAssetCommandHandler(context);
        var command = new UploadDigitalAssetCommand { File = null };

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Contains.Item("No file provided"));
    }

    [Test]
    public async Task HandleAsync_ShouldReturnError_WhenInvalidFileExtension()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new UploadDigitalAssetCommandHandler(context);

        var mockFile = CreateMockFile("test-file.txt", new byte[] { 0x00, 0x01, 0x02 });
        var command = new UploadDigitalAssetCommand { File = mockFile };

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors.Any(e => e.Contains("Invalid file type")), Is.True);
    }

    [Test]
    public async Task HandleAsync_ShouldReturnError_WhenFileTooLarge()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new UploadDigitalAssetCommandHandler(context);

        // Create a mock file that reports being 11MB (over the 10MB limit)
        var stream = new MemoryStream(new byte[] { 0xFF, 0xD8, 0xFF });
        var mockFile = new Mock<IFormFile>();
        mockFile.Setup(f => f.FileName).Returns("large-image.jpg");
        mockFile.Setup(f => f.Length).Returns(11 * 1024 * 1024); // 11MB
        mockFile.Setup(f => f.OpenReadStream()).Returns(stream);

        var command = new UploadDigitalAssetCommand { File = mockFile.Object };

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors.Any(e => e.Contains("exceeds maximum")), Is.True);
    }

    [Test]
    public async Task HandleAsync_ShouldReturnError_WhenEmptyFile()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new UploadDigitalAssetCommandHandler(context);

        var stream = new MemoryStream(Array.Empty<byte>());
        var mockFile = new Mock<IFormFile>();
        mockFile.Setup(f => f.FileName).Returns("empty.jpg");
        mockFile.Setup(f => f.Length).Returns(0);
        mockFile.Setup(f => f.OpenReadStream()).Returns(stream);

        var command = new UploadDigitalAssetCommand { File = mockFile.Object };

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Contains.Item("No file provided"));
    }

    [Test]
    public async Task HandleAsync_ShouldCreateDigitalAsset_WhenValidPng()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new UploadDigitalAssetCommandHandler(context);

        // PNG magic bytes
        var pngBytes = new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A };

        // Add enough bytes for PNG header including dimensions
        var fullPngBytes = new byte[32];
        Array.Copy(pngBytes, fullPngBytes, pngBytes.Length);

        var stream = new MemoryStream(fullPngBytes);
        var mockFile = new Mock<IFormFile>();
        mockFile.Setup(f => f.FileName).Returns("test-image.png");
        mockFile.Setup(f => f.Length).Returns(fullPngBytes.Length);
        mockFile.Setup(f => f.ContentType).Returns("image/png");
        mockFile.Setup(f => f.OpenReadStream()).Returns(stream);
        mockFile.Setup(f => f.CopyToAsync(It.IsAny<Stream>(), It.IsAny<CancellationToken>()))
            .Callback<Stream, CancellationToken>((s, ct) =>
            {
                stream.Position = 0;
                stream.CopyTo(s);
            })
            .Returns(Task.CompletedTask);

        var command = new UploadDigitalAssetCommand { File = mockFile.Object };

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        Assert.That(result.Success, Is.True);
        Assert.That(result.DigitalAsset, Is.Not.Null);
        Assert.That(result.DigitalAsset!.Name, Is.EqualTo("test-image.png"));
        Assert.That(result.DigitalAsset.ContentType, Is.EqualTo("image/png"));
    }

    [Test]
    public async Task HandleAsync_ShouldReturnError_WhenFileSignatureDoesNotMatch()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new UploadDigitalAssetCommandHandler(context);

        // File has .jpg extension but wrong content
        var wrongBytes = new byte[] { 0x00, 0x01, 0x02, 0x03, 0x04 };
        var mockFile = CreateMockFile("fake-image.jpg", wrongBytes);

        var command = new UploadDigitalAssetCommand { File = mockFile };

        // Act
        var result = await handler.Handle(command, default);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors.Any(e => e.Contains("does not match")), Is.True);
    }

    [Test]
    public async Task HandleAsync_ShouldGenerateUniqueId_ForEachUpload()
    {
        // Arrange
        await using var context = GetInMemoryContext();
        var handler = new UploadDigitalAssetCommandHandler(context);

        var jpegBytes = new byte[] { 0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10 };

        // Upload first file
        var mockFile1 = CreateMockFile("image1.jpg", jpegBytes);
        var result1 = await handler.Handle(new UploadDigitalAssetCommand { File = mockFile1 }, default);

        // Upload second file
        var mockFile2 = CreateMockFile("image2.jpg", jpegBytes);
        var result2 = await handler.Handle(new UploadDigitalAssetCommand { File = mockFile2 }, default);

        // Assert
        Assert.That(result1.Success, Is.True);
        Assert.That(result2.Success, Is.True);
        Assert.That(result1.DigitalAsset!.DigitalAssetId, Is.Not.EqualTo(result2.DigitalAsset!.DigitalAssetId));
    }
}
