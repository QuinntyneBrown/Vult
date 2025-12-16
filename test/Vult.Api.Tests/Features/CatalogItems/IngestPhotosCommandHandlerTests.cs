// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using Vult.Api.Features.CatalogItems;
using Vult.Api.Hubs;
using Vult.Core.Interfaces;
using Vult.Core.Models;

namespace Vult.Api.Tests.Features.CatalogItems;

[TestFixture]
public class IngestPhotosCommandHandlerTests
{
    private Mock<ICatalogItemIngestionService> _mockIngestionService = null!;
    private Mock<IHubContext<IngestionHub>> _mockHubContext = null!;
    private Mock<ILogger<IngestPhotosCommandHandler>> _mockLogger = null!;
    private Mock<IHubClients> _mockClients = null!;
    private Mock<IClientProxy> _mockClientProxy = null!;
    private IngestPhotosCommandHandler _handler = null!;

    [SetUp]
    public void Setup()
    {
        _mockIngestionService = new Mock<ICatalogItemIngestionService>();
        _mockHubContext = new Mock<IHubContext<IngestionHub>>();
        _mockLogger = new Mock<ILogger<IngestPhotosCommandHandler>>();
        _mockClients = new Mock<IHubClients>();
        _mockClientProxy = new Mock<IClientProxy>();

        _mockHubContext.Setup(h => h.Clients).Returns(_mockClients.Object);
        _mockClients.Setup(c => c.All).Returns(_mockClientProxy.Object);

        _handler = new IngestPhotosCommandHandler(
            _mockIngestionService.Object,
            _mockHubContext.Object,
            _mockLogger.Object);
    }

    [Test]
    public async Task HandleAsync_WithNoPhotos_ReturnsErrorResult()
    {
        // Arrange
        var command = new IngestPhotosCommand { Photos = new List<IFormFile>() };

        // Act
        var result = await _handler.HandleAsync(command);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Errors, Has.Count.EqualTo(1));
        Assert.That(result.Errors[0], Is.EqualTo("No photos provided"));
    }

    [Test]
    public async Task HandleAsync_WithValidPhotos_ProcessesSuccessfully()
    {
        // Arrange
        var mockFile1 = CreateMockFormFile("image1.jpg", "image/jpeg");
        var mockFile2 = CreateMockFormFile("image2.jpg", "image/jpeg");
        
        var command = new IngestPhotosCommand 
        { 
            Photos = new List<IFormFile> { mockFile1.Object, mockFile2.Object }
        };

        var mockIngestionResult = new CatalogItemIngestionResult
        {
            Success = true,
            TotalProcessed = 2,
            SuccessfullyProcessed = 2,
            Failed = 0,
            CatalogItems = new List<CatalogItem>
            {
                new CatalogItem 
                { 
                    CatalogItemId = Guid.NewGuid(), 
                    BrandName = "Test Brand",
                    CreatedDate = DateTime.UtcNow,
                    UpdatedDate = DateTime.UtcNow
                }
            }
        };

        _mockIngestionService
            .Setup(s => s.IngestImagesAsync(It.IsAny<byte[][]>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockIngestionResult);

        // Act
        var result = await _handler.HandleAsync(command);

        // Assert
        Assert.That(result.Success, Is.True);
        Assert.That(result.TotalProcessed, Is.EqualTo(2));
        Assert.That(result.SuccessfullyProcessed, Is.EqualTo(2));
        Assert.That(result.Failed, Is.EqualTo(0));
        Assert.That(result.CatalogItems, Has.Count.EqualTo(1));
    }

    [Test]
    public async Task HandleAsync_SendsProgressUpdates_ViaSignalR()
    {
        // Arrange
        var mockFile = CreateMockFormFile("image.jpg", "image/jpeg");
        var command = new IngestPhotosCommand { Photos = new List<IFormFile> { mockFile.Object } };

        var mockIngestionResult = new CatalogItemIngestionResult
        {
            Success = true,
            TotalProcessed = 1,
            SuccessfullyProcessed = 1,
            Failed = 0,
            CatalogItems = new List<CatalogItem>()
        };

        _mockIngestionService
            .Setup(s => s.IngestImagesAsync(It.IsAny<byte[][]>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockIngestionResult);

        // Act
        await _handler.HandleAsync(command);

        // Assert - Verify SignalR progress notifications were sent
        _mockClientProxy.Verify(
            c => c.SendCoreAsync(
                "IngestionProgress",
                It.IsAny<object[]>(),
                It.IsAny<CancellationToken>()),
            Times.AtLeastOnce);
    }

    [Test]
    public async Task HandleAsync_OnSuccess_SendsCompleteNotification()
    {
        // Arrange
        var mockFile = CreateMockFormFile("image.jpg", "image/jpeg");
        var command = new IngestPhotosCommand { Photos = new List<IFormFile> { mockFile.Object } };

        var mockIngestionResult = new CatalogItemIngestionResult
        {
            Success = true,
            TotalProcessed = 1,
            SuccessfullyProcessed = 1,
            Failed = 0,
            CatalogItems = new List<CatalogItem>()
        };

        _mockIngestionService
            .Setup(s => s.IngestImagesAsync(It.IsAny<byte[][]>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockIngestionResult);

        // Act
        await _handler.HandleAsync(command);

        // Assert - Verify completion notification was sent
        _mockClientProxy.Verify(
            c => c.SendCoreAsync(
                "IngestionComplete",
                It.Is<object[]>(args => args.Length > 0),
                It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Test]
    public async Task HandleAsync_OnFailure_SendsErrorNotification()
    {
        // Arrange
        var mockFile = CreateMockFormFile("image.jpg", "image/jpeg");
        var command = new IngestPhotosCommand { Photos = new List<IFormFile> { mockFile.Object } };

        var mockIngestionResult = new CatalogItemIngestionResult
        {
            Success = false,
            Errors = new List<string> { "Processing failed" },
            TotalProcessed = 1,
            SuccessfullyProcessed = 0,
            Failed = 1,
            CatalogItems = new List<CatalogItem>()
        };

        _mockIngestionService
            .Setup(s => s.IngestImagesAsync(It.IsAny<byte[][]>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockIngestionResult);

        // Act
        await _handler.HandleAsync(command);

        // Assert - Verify error notification was sent
        _mockClientProxy.Verify(
            c => c.SendCoreAsync(
                "IngestionError",
                It.Is<object[]>(args => args.Length > 0 && args[0] != null && args[0].ToString()!.Contains("Processing failed")),
                It.IsAny<CancellationToken>()),
            Times.Once);
    }

    private Mock<IFormFile> CreateMockFormFile(string fileName, string contentType)
    {
        var mockFile = new Mock<IFormFile>();
        var content = "fake image content";
        var stream = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(content));
        
        mockFile.Setup(f => f.FileName).Returns(fileName);
        mockFile.Setup(f => f.ContentType).Returns(contentType);
        mockFile.Setup(f => f.Length).Returns(stream.Length);
        mockFile.Setup(f => f.OpenReadStream()).Returns(stream);
        mockFile.Setup(f => f.CopyToAsync(It.IsAny<Stream>(), It.IsAny<CancellationToken>()))
            .Returns((Stream target, CancellationToken token) =>
            {
                stream.Position = 0;
                return stream.CopyToAsync(target, token);
            });
        
        return mockFile;
    }
}
