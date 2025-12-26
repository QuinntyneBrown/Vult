# Azure AI Services Configuration

This document explains how to configure Azure AI services for image analysis in the Vult application.

## Prerequisites

1. An Azure subscription
2. An Azure AI Computer Vision resource

## Setting Up Azure AI Computer Vision

1. **Create a Computer Vision Resource**:
   - Navigate to the [Azure Portal](https://portal.azure.com)
   - Click "Create a resource"
   - Search for "Computer Vision"
   - Click "Create" and fill in the required information
   - Choose a pricing tier (F0 for free tier or S1 for standard)
   - Click "Review + create"

2. **Get Your Credentials**:
   - Once the resource is created, navigate to it
   - Go to "Keys and Endpoint" in the left menu
   - Copy the "Endpoint" and one of the "Keys"

## Configuring the Application

### Option 1: Using User Secrets (Development)

Recommended for local development:

```bash
cd src/Vult.Api
dotnet user-secrets set "AzureAI:Endpoint" "https://your-resource-name.cognitiveservices.azure.com/"
dotnet user-secrets set "AzureAI:ApiKey" "your-api-key-here"
```

### Option 2: Using Environment Variables (Production)

For production deployments:

```bash
# Linux/macOS
export AzureAI__Endpoint="https://your-resource-name.cognitiveservices.azure.com/"
export AzureAI__ApiKey="your-api-key-here"

# Windows
set AzureAI__Endpoint=https://your-resource-name.cognitiveservices.azure.com/
set AzureAI__ApiKey=your-api-key-here
```

## Configuration Options

The following configuration options are available in `appsettings.json`:

```json
{
  "AzureAI": {
    "Endpoint": "",
    "ApiKey": "",
    "MaxRetries": 3,
    "RetryDelayMs": 1000
  }
}
```

## Using the Services

See the inline code documentation for detailed usage examples of IAzureAIService and ICatalogItemIngestionService.

## AI Response Mapping

The service analyzes images and maps Azure AI responses to catalog item fields:

- **Estimated MSRP**: Calculated based on detected item type and brand
- **Estimated Resale Value**: 60% of MSRP by default
- **Description**: Friendly reseller perspective generated from image caption
- **Size**: Extracted from tags or defaults to "M"
- **Brand Name**: Detected from image tags (Adidas, Puma, etc.)
- **Gender**: Detected from image tags (Mens, Womens, Unisex)
- **Item Type**: Detected from image tags (Shoe, Jacket, Shirt, etc.)
- **Image Description**: AI-generated description for each photo

## Security Best Practices

1. **Never commit credentials** to source control
2. **Use User Secrets** for local development
3. **Use Azure Key Vault** or environment variables for production
4. **Rotate API keys** regularly
5. **Monitor usage** to detect unauthorized access
