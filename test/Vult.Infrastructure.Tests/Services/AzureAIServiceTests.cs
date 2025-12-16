// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Vult.Infrastructure.Services;

namespace Vult.Infrastructure.Tests.Services;

[TestFixture]
public class AzureAIServiceTests
{
    private Mock<ILogger<AzureAIService>> _loggerMock = null!;
    private Mock<IConfiguration> _configurationMock = null!;

    [SetUp]
    public void SetUp()
    {
        _loggerMock = new Mock<ILogger<AzureAIService>>();
        _configurationMock = new Mock<IConfiguration>();
    }

    [Test]
    public void Constructor_ShouldThrowException_WhenEndpointIsMissing()
    {
        // Arrange
        _configurationMock.Setup(c => c["AzureAI:Endpoint"]).Returns((string?)null);
        _configurationMock.Setup(c => c["AzureAI:ApiKey"]).Returns("test-key");

        // Act & Assert
        Assert.Throws<InvalidOperationException>(() => new AzureAIService(_configurationMock.Object, _loggerMock.Object));
    }

    [Test]
    public void Constructor_ShouldThrowException_WhenApiKeyIsMissing()
    {
        // Arrange
        _configurationMock.Setup(c => c["AzureAI:Endpoint"]).Returns("https://test.cognitiveservices.azure.com/");
        _configurationMock.Setup(c => c["AzureAI:ApiKey"]).Returns((string?)null);

        // Act & Assert
        Assert.Throws<InvalidOperationException>(() => new AzureAIService(_configurationMock.Object, _loggerMock.Object));
    }

    [Test]
    public async Task AnalyzeImageAsync_ShouldReturnError_WhenImageDataIsNull()
    {
        // Arrange
        _configurationMock.Setup(c => c["AzureAI:Endpoint"]).Returns("https://test.cognitiveservices.azure.com/");
        _configurationMock.Setup(c => c["AzureAI:ApiKey"]).Returns("test-key");
        _configurationMock.Setup(c => c["AzureAI:MaxRetries"]).Returns("3");
        _configurationMock.Setup(c => c["AzureAI:RetryDelayMs"]).Returns("1000");

        var service = new AzureAIService(_configurationMock.Object, _loggerMock.Object);

        // Act
        var result = await service.AnalyzeImageAsync(null!);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.ErrorMessage, Is.EqualTo("Image data cannot be null or empty"));
    }

    [Test]
    public async Task AnalyzeImageAsync_ShouldReturnError_WhenImageDataIsEmpty()
    {
        // Arrange
        _configurationMock.Setup(c => c["AzureAI:Endpoint"]).Returns("https://test.cognitiveservices.azure.com/");
        _configurationMock.Setup(c => c["AzureAI:ApiKey"]).Returns("test-key");
        _configurationMock.Setup(c => c["AzureAI:MaxRetries"]).Returns("3");
        _configurationMock.Setup(c => c["AzureAI:RetryDelayMs"]).Returns("1000");

        var service = new AzureAIService(_configurationMock.Object, _loggerMock.Object);

        // Act
        var result = await service.AnalyzeImageAsync(Array.Empty<byte>());

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.ErrorMessage, Is.EqualTo("Image data cannot be null or empty"));
    }
}
