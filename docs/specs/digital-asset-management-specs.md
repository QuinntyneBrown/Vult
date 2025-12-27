# Digital Asset Management Software Requirements Specification

## Document Information

- **Project:** Vult
- **Version:** 1.0
- **Date:** 2025-12-27
- **Status:** Draft
- **Reference Implementation:** [Coop DigitalAsset](https://github.com/QuinntyneBrown/Coop/blob/master/src/Coop.Domain/Entities/DigitalAsset.cs)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Digital Asset Entity Requirements](#2-digital-asset-entity-requirements)
3. [Upload Digital Asset Requirements](#3-upload-digital-asset-requirements)
4. [Batch Upload Digital Assets Requirements](#4-batch-upload-digital-assets-requirements)
5. [Query Digital Asset by Filename Requirements](#5-query-digital-asset-by-filename-requirements)
6. [Serve Digital Asset via HTTP Requirements](#6-serve-digital-asset-via-http-requirements)
7. [Digital Asset Management Requirements](#7-digital-asset-management-requirements)
8. [Security & Authorization Requirements](#8-security--authorization-requirements)
9. [Implementation Layers](#9-implementation-layers)

---

## 1. Overview

### 1.1 Purpose

This specification defines the requirements for a Digital Asset Management (DAM) system within the Vult application. The DAM system enables storage, retrieval, and serving of digital assets (primarily images) via HTTP endpoints.

### 1.2 Scope

The DAM system shall support:
- Storage of binary file content (images) in the database
- Querying digital assets by filename
- Serving digital assets (JPG, PNG, etc.) over HTTP via API controller
- CRUD operations on digital assets

### 1.3 Reference Implementation

This specification is based on the Coop repository's DigitalAsset implementation:
- **Entity Location:** `Coop.Domain/Entities/DigitalAsset.cs`
- **Entity Properties:**
  - `DigitalAssetId` (Guid) - Primary identifier
  - `Name` (string) - Asset filename/designation
  - `Bytes` (byte[]) - Binary file content
  - `ContentType` (string) - MIME type specification
  - `Height` (float) - Vertical dimension measurement
  - `Width` (float) - Horizontal dimension measurement

---

## 2. Digital Asset Entity Requirements

### REQ-DAM-001: DigitalAsset Entity Model

**Requirement:** The system shall maintain a DigitalAsset entity for storing binary file content with associated metadata.

**Acceptance Criteria:**
- [ ] Each digital asset has a unique GUID identifier (`DigitalAssetId`)
- [ ] Asset name/filename is stored as a string (`Name`)
- [ ] Binary content is stored as a byte array (`Bytes`)
- [ ] MIME content type is stored as a string (`ContentType`)
- [ ] Image dimensions are stored as float values (`Height`, `Width`)
- [ ] Entity is defined in `Vult.Core.Model.DigitalAssetAggregate`

**DigitalAsset Entity Schema:**

| Property | Type | Constraints | Description |
|----------|------|-------------|-------------|
| DigitalAssetId | Guid | Primary Key, Required | Unique asset identifier |
| Name | string | Required, MaxLength: 500 | Asset filename/designation |
| Bytes | byte[] | Required | Binary file content |
| ContentType | string | Required, MaxLength: 100 | MIME type (e.g., "image/jpeg") |
| Height | float | Default: 0 | Image height in pixels |
| Width | float | Default: 0 | Image width in pixels |
| CreatedDate | DateTime | Required | Asset creation timestamp |

**Entity Definition:**

```csharp
namespace Vult.Core.Model.DigitalAssetAggregate;

public class DigitalAsset
{
    public Guid DigitalAssetId { get; set; }
    public string Name { get; set; } = string.Empty;
    public byte[] Bytes { get; set; } = Array.Empty<byte>();
    public string ContentType { get; set; } = string.Empty;
    public float Height { get; set; }
    public float Width { get; set; }
    public DateTime CreatedDate { get; set; }
}
```

---

### REQ-DAM-002: Entity Configuration

**Requirement:** The system shall configure the DigitalAsset entity using Entity Framework Core fluent API.

**Acceptance Criteria:**
- [ ] Table name is "DigitalAssets"
- [ ] Primary key is `DigitalAssetId`
- [ ] `Name` has maximum length of 500 characters
- [ ] `ContentType` has maximum length of 100 characters
- [ ] Configuration is in `Vult.Infrastructure.Data.Configurations`

**EF Configuration:**

```csharp
namespace Vult.Infrastructure.Data.Configurations;

public class DigitalAssetConfiguration : IEntityTypeConfiguration<DigitalAsset>
{
    public void Configure(EntityTypeBuilder<DigitalAsset> builder)
    {
        builder.ToTable("DigitalAssets");
        builder.HasKey(x => x.DigitalAssetId);
        builder.Property(x => x.Name).IsRequired().HasMaxLength(500);
        builder.Property(x => x.ContentType).IsRequired().HasMaxLength(100);
        builder.Property(x => x.Bytes).IsRequired();
    }
}
```

---

## 3. Upload Digital Asset Requirements

### REQ-DAM-003: Upload Digital Asset

**Requirement:** The system shall allow authorized users to upload digital assets (images) via HTTP multipart form data.

**Acceptance Criteria:**
- [ ] Accepts multipart/form-data file upload
- [ ] Supports image file types: .jpg, .jpeg, .png, .gif, .bmp, .webp
- [ ] Extracts and stores file content as byte array
- [ ] Determines and stores MIME content type
- [ ] Extracts image dimensions (height/width) when applicable
- [ ] Returns created DigitalAssetDto with ID
- [ ] Validates file size (configurable max, e.g., 10MB)
- [ ] Authentication required

**Authorization:**

```csharp
[AuthorizeResourceOperation(Operations.Create, AggregateNames.DigitalAsset)]
```

**Endpoint:**

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/digital-assets` | Required | Upload new digital asset |

**Request:**
- Content-Type: `multipart/form-data`
- Body: Single file field named `file`

**Success Response (201 Created):**

```json
{
    "digitalAsset": {
        "digitalAssetId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "name": "product-image.jpg",
        "contentType": "image/jpeg",
        "height": 800.0,
        "width": 1200.0,
        "createdDate": "2025-12-27T12:00:00Z"
    },
    "success": true,
    "errors": []
}
```

**Error Response (400 Bad Request):**

```json
{
    "errors": ["No file provided", "Invalid file type. Only images are allowed."]
}
```

---

## 4. Batch Upload Digital Assets Requirements

### REQ-DAM-011: Batch Upload Digital Assets

**Requirement:** The system shall allow authorized users to upload multiple digital assets in a single HTTP request.

**Acceptance Criteria:**
- [ ] Accepts multipart/form-data with multiple file fields
- [ ] Supports image file types: .jpg, .jpeg, .png, .gif, .bmp, .webp
- [ ] Processes each file independently (partial success allowed)
- [ ] Extracts and stores file content as byte array for each file
- [ ] Determines and stores MIME content type for each file
- [ ] Extracts image dimensions (height/width) for each file when applicable
- [ ] Returns list of created DigitalAssetDto with IDs
- [ ] Returns processing statistics (total, successful, failed)
- [ ] Returns per-file errors for failed uploads
- [ ] Validates individual file size (configurable max, e.g., 10MB per file)
- [ ] Validates total request size (configurable max, e.g., 100MB total)
- [ ] Authentication required

**Authorization:**

```csharp
[AuthorizeResourceOperation(Operations.Create, AggregateNames.DigitalAsset)]
```

**Endpoint:**

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/digitalassets/batch` | Required | Upload multiple digital assets |

**Request:**
- Content-Type: `multipart/form-data`
- Body: Multiple file fields named `files`

**Success Response (201 Created):**

```json
{
    "digitalAssets": [
        {
            "digitalAssetId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "name": "product-image-1.jpg",
            "contentType": "image/jpeg",
            "height": 800.0,
            "width": 1200.0,
            "createdDate": "2025-12-27T12:00:00Z"
        },
        {
            "digitalAssetId": "4fb96g75-6828-5673-c4gd-3d074g77bgb7",
            "name": "product-image-2.png",
            "contentType": "image/png",
            "height": 600.0,
            "width": 800.0,
            "createdDate": "2025-12-27T12:00:00Z"
        }
    ],
    "success": true,
    "errors": [],
    "totalProcessed": 2,
    "successfullyProcessed": 2,
    "failed": 0
}
```

**Partial Success Response (201 Created):**

```json
{
    "digitalAssets": [
        {
            "digitalAssetId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "name": "product-image-1.jpg",
            "contentType": "image/jpeg",
            "height": 800.0,
            "width": 1200.0,
            "createdDate": "2025-12-27T12:00:00Z"
        }
    ],
    "success": true,
    "errors": ["invalid-file.txt: Invalid file type. Allowed types: .jpg, .jpeg, .png, .gif, .bmp, .webp"],
    "totalProcessed": 2,
    "successfullyProcessed": 1,
    "failed": 1
}
```

**Error Response (400 Bad Request):**

```json
{
    "errors": ["No files provided"]
}
```

---

## 5. Query Digital Asset by Filename Requirements

### REQ-DAM-004: Query by Filename

**Requirement:** The system shall provide an endpoint to query digital assets by filename (Name property).

**Acceptance Criteria:**
- [ ] Accepts filename as query parameter or route parameter
- [ ] Performs case-insensitive search
- [ ] Returns matching DigitalAssetDto or 404 if not found
- [ ] Supports exact match and partial match (configurable)
- [ ] Public access allowed (for serving images)

**Endpoint:**

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/digital-assets/filename/{filename}` | AllowAnonymous | Get asset by filename |

**Path Parameters:**
- `filename` (string): The filename to search for

**Success Response (200 OK):**

```json
{
    "digitalAsset": {
        "digitalAssetId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "name": "product-image.jpg",
        "contentType": "image/jpeg",
        "height": 800.0,
        "width": 1200.0,
        "createdDate": "2025-12-27T12:00:00Z"
    }
}
```

**Error Response (404 Not Found):**

```json
{
    "message": "Digital asset with filename 'product-image.jpg' not found"
}
```

---

## 6. Serve Digital Asset via HTTP Requirements

### REQ-DAM-005: Serve File Content

**Requirement:** The system shall provide an endpoint that serves the raw binary content of a digital asset with appropriate HTTP headers for browser rendering.

**Acceptance Criteria:**
- [ ] Returns raw binary content (not JSON-wrapped)
- [ ] Sets `Content-Type` header based on stored MIME type
- [ ] Sets `Content-Length` header based on file size
- [ ] Supports browser caching via `Cache-Control` header
- [ ] Supports `ETag` for conditional requests (optional)
- [ ] Returns 404 if asset not found
- [ ] Public access allowed
- [ ] Supports serving by ID or by filename

**Endpoints:**

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/digital-assets/{id}/serve` | AllowAnonymous | Serve asset by ID |
| GET | `/api/digital-assets/serve/{filename}` | AllowAnonymous | Serve asset by filename |

**Response Headers:**

```
HTTP/1.1 200 OK
Content-Type: image/jpeg
Content-Length: 125432
Cache-Control: public, max-age=86400
```

**Response Body:** Raw binary content of the image file.

**Error Response (404 Not Found):**
Standard HTTP 404 response.

**Implementation Example:**

```csharp
[HttpGet("{id:guid}/serve")]
[AllowAnonymous]
public async Task<IActionResult> ServeDigitalAsset(Guid id)
{
    var result = await _mediator.Send(new GetDigitalAssetByIdQuery { DigitalAssetId = id });

    if (result.DigitalAsset == null)
        return NotFound();

    return File(result.DigitalAsset.Bytes, result.DigitalAsset.ContentType);
}

[HttpGet("serve/{filename}")]
[AllowAnonymous]
public async Task<IActionResult> ServeDigitalAssetByFilename(string filename)
{
    var result = await _mediator.Send(new GetDigitalAssetByFilenameQuery { Filename = filename });

    if (result.DigitalAsset == null)
        return NotFound();

    return File(result.DigitalAsset.Bytes, result.DigitalAsset.ContentType);
}
```

---

## 7. Digital Asset Management Requirements

### REQ-DAM-006: Get Digital Asset by ID

**Requirement:** The system shall allow retrieval of digital asset metadata by unique identifier.

**Acceptance Criteria:**
- [ ] Accepts GUID as route parameter
- [ ] Returns DigitalAssetDto with all metadata
- [ ] Returns 404 if not found
- [ ] Public access allowed

**Endpoint:**

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/digital-assets/{id}` | AllowAnonymous | Get asset metadata by ID |

---

### REQ-DAM-007: List All Digital Assets

**Requirement:** The system shall provide paginated listing of all digital assets.

**Acceptance Criteria:**
- [ ] Supports pagination (pageNumber, pageSize)
- [ ] Returns list of DigitalAssetDto (without Bytes to reduce payload)
- [ ] Authentication required for listing
- [ ] Supports sorting by name, date

**Endpoint:**

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/digital-assets` | Required | Get paginated list of assets |

**Query Parameters:**
- `pageNumber` (int, default: 1)
- `pageSize` (int, default: 10, max: 100)
- `sortBy` (string, optional): "name", "name_desc", "date", "date_desc"

**Success Response (200 OK):**

```json
{
    "items": [
        {
            "digitalAssetId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "name": "product-image.jpg",
            "contentType": "image/jpeg",
            "height": 800.0,
            "width": 1200.0,
            "createdDate": "2025-12-27T12:00:00Z"
        }
    ],
    "totalCount": 50,
    "pageNumber": 1,
    "pageSize": 10,
    "totalPages": 5
}
```

---

### REQ-DAM-008: Delete Digital Asset

**Requirement:** The system shall allow authorized users to delete digital assets.

**Acceptance Criteria:**
- [ ] Accepts GUID as route parameter
- [ ] Permanently removes asset from database
- [ ] Returns 204 No Content on success
- [ ] Returns 404 if not found
- [ ] Authentication and authorization required

**Authorization:**

```csharp
[AuthorizeResourceOperation(Operations.Delete, AggregateNames.DigitalAsset)]
```

**Endpoint:**

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| DELETE | `/api/digital-assets/{id}` | Required | Delete digital asset |

---

## 8. Security & Authorization Requirements

### REQ-DAM-009: Authorization Controls

**Requirement:** The system shall enforce role-based access control for digital asset operations.

**Acceptance Criteria:**
- [ ] Upload requires `Create` privilege on `DigitalAsset` aggregate
- [ ] Delete requires `Delete` privilege on `DigitalAsset` aggregate
- [ ] Listing requires authentication
- [ ] Serving and metadata retrieval are public (AllowAnonymous)
- [ ] Add "DigitalAsset" to `AggregateNames` constants

**Authorization Matrix:**

| Operation | Endpoint | Required Privilege |
|-----------|----------|-------------------|
| Upload | POST /api/digital-assets | Create + DigitalAsset |
| Batch Upload | POST /api/digital-assets/batch | Create + DigitalAsset |
| List | GET /api/digital-assets | Authenticated |
| Get by ID | GET /api/digital-assets/{id} | AllowAnonymous |
| Get by Filename | GET /api/digital-assets/filename/{filename} | AllowAnonymous |
| Serve by ID | GET /api/digital-assets/{id}/serve | AllowAnonymous |
| Serve by Filename | GET /api/digital-assets/serve/{filename} | AllowAnonymous |
| Delete | DELETE /api/digital-assets/{id} | Delete + DigitalAsset |

---

### REQ-DAM-010: File Validation

**Requirement:** The system shall validate uploaded files for security and compatibility.

**Acceptance Criteria:**
- [ ] Validate file extension matches allowed types
- [ ] Validate MIME type from content headers
- [ ] Validate file signature (magic bytes) matches declared type
- [ ] Enforce maximum file size limit (configurable, default 10MB)
- [ ] Reject files with suspicious characteristics

**Allowed File Types:**

| Extension | MIME Type | Magic Bytes |
|-----------|-----------|-------------|
| .jpg, .jpeg | image/jpeg | FF D8 FF |
| .png | image/png | 89 50 4E 47 |
| .gif | image/gif | 47 49 46 |
| .bmp | image/bmp | 42 4D |
| .webp | image/webp | 52 49 46 46 |

---

## 9. Implementation Layers

### 9.1 Vult.Core Layer

**Files to Create/Modify:**

| File | Action | Description |
|------|--------|-------------|
| `Model/DigitalAssetAggregate/DigitalAsset.cs` | Create | Entity definition |
| `IVultContext.cs` | Modify | Add DbSet<DigitalAsset> |
| `Services/Authorization/AggregateNames.cs` | Modify | Add "DigitalAsset" constant |

---

### 9.2 Vult.Infrastructure Layer

**Files to Create/Modify:**

| File | Action | Description |
|------|--------|-------------|
| `Data/Configurations/DigitalAssetConfiguration.cs` | Create | EF Core fluent configuration |
| `VultContext.cs` | Modify | Add DbSet<DigitalAsset> |

---

### 9.3 Vult.Api Layer

**Files to Create:**

| File | Description |
|------|-------------|
| `Controllers/DigitalAssetsController.cs` | API endpoints |
| `Features/DigitalAssets/DigitalAssetDto.cs` | DTO for responses |
| `Features/DigitalAssets/UploadDigitalAssetCommand.cs` | Single upload command |
| `Features/DigitalAssets/UploadDigitalAssetCommandHandler.cs` | Single upload handler |
| `Features/DigitalAssets/UploadDigitalAssetsCommand.cs` | Batch upload command |
| `Features/DigitalAssets/UploadDigitalAssetsCommandHandler.cs` | Batch upload handler |
| `Features/DigitalAssets/GetDigitalAssetsQuery.cs` | List query |
| `Features/DigitalAssets/GetDigitalAssetsQueryHandler.cs` | List handler |
| `Features/DigitalAssets/GetDigitalAssetByIdQuery.cs` | Get by ID query |
| `Features/DigitalAssets/GetDigitalAssetByIdQueryHandler.cs` | Get by ID handler |
| `Features/DigitalAssets/GetDigitalAssetByFilenameQuery.cs` | Get by filename query |
| `Features/DigitalAssets/GetDigitalAssetByFilenameQueryHandler.cs` | Get by filename handler |
| `Features/DigitalAssets/DeleteDigitalAssetCommand.cs` | Delete command |
| `Features/DigitalAssets/DeleteDigitalAssetCommandHandler.cs` | Delete handler |
| `Features/DigitalAssets/DigitalAssetExtensions.cs` | Entity to DTO mapping |

---

## 10. Unit Test Requirements

### 10.1 Entity Tests (Vult.Core.Tests)

**Test Cases:**

| Test | Description |
|------|-------------|
| `DigitalAsset_DefaultValues_AreSetCorrectly` | Verify default property values |
| `DigitalAsset_SetDigitalAssetId_StoresValue` | Verify ID property |
| `DigitalAsset_SetName_StoresValue` | Verify Name property |
| `DigitalAsset_SetBytes_StoresValue` | Verify Bytes property |
| `DigitalAsset_SetContentType_StoresValue` | Verify ContentType property |
| `DigitalAsset_SetDimensions_StoresValues` | Verify Height and Width properties |

---

### 10.2 Handler Tests (Vult.Api.Tests)

**Test Cases:**

| Test | Description |
|------|-------------|
| `UploadDigitalAssetCommandHandler_ValidFile_CreatesAsset` | Single upload success scenario |
| `UploadDigitalAssetCommandHandler_NoFile_ReturnsError` | Single upload no file validation |
| `UploadDigitalAssetCommandHandler_InvalidType_ReturnsError` | Single upload file type validation |
| `UploadDigitalAssetsCommandHandler_ValidFiles_CreatesAssets` | Batch upload success scenario |
| `UploadDigitalAssetsCommandHandler_NoFiles_ReturnsError` | Batch upload no files validation |
| `UploadDigitalAssetsCommandHandler_MixedFiles_PartialSuccess` | Batch upload partial success |
| `UploadDigitalAssetsCommandHandler_InvalidTypes_ReturnsErrors` | Batch upload file type validation |
| `UploadDigitalAssetsCommandHandler_FileSizeExceeded_ReturnsError` | Batch upload size validation |
| `GetDigitalAssetByIdQueryHandler_ExistingId_ReturnsAsset` | Get by ID success |
| `GetDigitalAssetByIdQueryHandler_NonExistingId_ReturnsNull` | Get by ID not found |
| `GetDigitalAssetByFilenameQueryHandler_ExistingFilename_ReturnsAsset` | Get by filename success |
| `GetDigitalAssetByFilenameQueryHandler_NonExistingFilename_ReturnsNull` | Get by filename not found |
| `GetDigitalAssetsQueryHandler_ReturnsPagedResults` | List pagination |
| `DeleteDigitalAssetCommandHandler_ExistingAsset_DeletesSuccessfully` | Delete success |
| `DeleteDigitalAssetCommandHandler_NonExistingAsset_ReturnsError` | Delete not found |

---

## DOCUMENT METADATA

**Document Version**: 1.1
**Feature Name**: Digital Asset Management
**Last Updated**: 2025-12-27
**Total Endpoints**: 8
**Total Requirements**: 11
**Implementation Layers**: Vult.Core, Vult.Infrastructure, Vult.Api

---

## APPENDIX A: Sample cURL Commands

### Upload Digital Asset
```bash
curl -X POST http://localhost:5000/api/digital-assets \
  -H "Authorization: Bearer <token>" \
  -F "file=@product-image.jpg"
```

### Upload Multiple Digital Assets (Batch)
```bash
curl -X POST http://localhost:5000/api/digital-assets/batch \
  -H "Authorization: Bearer <token>" \
  -F "files=@product-image-1.jpg" \
  -F "files=@product-image-2.png" \
  -F "files=@product-image-3.gif"
```

### Get Digital Asset by Filename
```bash
curl -X GET "http://localhost:5000/api/digital-assets/filename/product-image.jpg"
```

### Serve Digital Asset (Display Image)
```bash
curl -X GET "http://localhost:5000/api/digital-assets/serve/product-image.jpg" \
  --output displayed-image.jpg
```

### List Digital Assets
```bash
curl -X GET "http://localhost:5000/api/digital-assets?pageNumber=1&pageSize=10" \
  -H "Authorization: Bearer <token>"
```

### Delete Digital Asset
```bash
curl -X DELETE "http://localhost:5000/api/digital-assets/3fa85f64-5717-4562-b3fc-2c963f66afa6" \
  -H "Authorization: Bearer <token>"
```
