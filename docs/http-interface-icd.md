# VULT API - HTTP INTERFACE CONTROL DOCUMENT (ICD)

## EXECUTIVE SUMMARY

This document provides a comprehensive technical specification of all HTTP endpoints, request/response formats, authentication mechanisms, and operational patterns for the Vult API. The API is built with ASP.NET Core using the MediatR CQRS pattern, incorporating JWT-based authentication, role-based access control, and resource operation authorization.

---

## 1. API PROJECT STRUCTURE

### Project Location
- **Main API Project**: `src/Vult.Api/`
- **Framework**: ASP.NET Core (.NET 10.0 / .NET 8.0)
- **Architecture Pattern**: CQRS (Command Query Responsibility Segregation) with MediatR
- **Authentication**: JWT Bearer Token
- **Database**: SQL Server

### Key Directory Structure
```
Vult.Api/
├── Controllers/              # HTTP Controller endpoints (4 controllers)
│   ├── UserController.cs
│   ├── ProductsController.cs
│   ├── InvitationTokenController.cs
│   └── TestimonialsController.cs
├── Features/                 # Feature modules (Commands/Queries/Handlers)
│   ├── Auth/
│   ├── Users/
│   ├── Products/
│   ├── InvitationTokens/
│   └── Testimonials/
├── Behaviours/              # MediatR pipeline behaviors
│   └── ResourceOperationAuthorizationBehavior.cs
├── Hubs/                    # SignalR hubs
│   └── IngestionHub.cs
├── Configuration/           # Settings classes
│   └── CorsSettings.cs
├── Program.cs              # Application startup
├── ConfigureServices.cs    # Dependency injection configuration
└── appsettings.json        # Application configuration
```

---

## 2. CONTROLLERS AND ENDPOINT ROUTES

### 2.1 UserController
**Route Base**: `/api/user`
**Location**: `src/Vult.Api/Controllers/UserController.cs`

| Method | Endpoint | Route | Auth | Description |
|--------|----------|-------|------|-------------|
| POST | Token | `/api/user/token` | AllowAnonymous | Authenticate user and obtain JWT token |
| GET | GetCurrent | `/api/user/current` | Required | Get current authenticated user details |
| GET | CheckUsernameExists | `/api/user/exists/{username}` | AllowAnonymous | Check if username exists in system |
| POST | ChangePassword | `/api/user/change-password` | Required | Change current user's password |
| GET | GetUsers | `/api/user` | Required | Get all users (paginated) |
| GET | GetById | `/api/user/{id:guid}` | Required | Get user by ID |
| POST | Create | `/api/user` | Required | Create new user |
| PUT | Update | `/api/user/{id:guid}` | Required | Update user details |
| DELETE | Delete | `/api/user/{id:guid}` | Required | Delete user (soft delete) |
| PUT | UpdatePassword | `/api/user/{id:guid}/password` | Required | Update user password by admin |

### 2.2 ProductsController
**Route Base**: `/api/products`
**Location**: `src/Vult.Api/Controllers/ProductsController.cs`

| Method | Endpoint | Route | Auth | Description |
|--------|----------|-------|------|-------------|
| POST | UploadPhotos | `/api/products/photos` | Required | Upload and ingest product photos |
| GET | GetProducts | `/api/products` | Public | Get paginated product list with filters |
| GET | GetFeaturedProducts | `/api/products/featured` | Public | Get paginated list of featured products |
| GET | GetProductById | `/api/products/{id}` | Public | Get product details by ID |
| POST | CreateProduct | `/api/products` | Required | Create new product |
| PUT | UpdateProduct | `/api/products/{id}` | Required | Update product details |
| DELETE | DeleteProduct | `/api/products/{id}` | Required | Delete product |

### 2.3 InvitationTokenController
**Route Base**: `/api/invitation-token`
**Location**: `src/Vult.Api/Controllers/InvitationTokenController.cs`

| Method | Endpoint | Route | Auth | Description |
|--------|----------|-------|------|-------------|
| GET | GetAll | `/api/invitation-token` | Required | Get all invitation tokens |
| GET | GetById | `/api/invitation-token/{id:guid}` | Required | Get token by ID |
| POST | Create | `/api/invitation-token` | Required | Create new invitation token |
| PUT | UpdateExpiry | `/api/invitation-token/{id:guid}/expiry` | Required | Update token expiry date |
| DELETE | Delete | `/api/invitation-token/{id:guid}` | Required | Delete invitation token |

### 2.4 TestimonialsController
**Route Base**: `/api/testimonials`
**Location**: `src/Vult.Api/Controllers/TestimonialsController.cs`

| Method | Endpoint | Route | Auth | Description |
|--------|----------|-------|------|-------------|
| GET | GetTestimonials | `/api/testimonials` | Public | Get paginated list of testimonials with filters |
| GET | GetTestimonialById | `/api/testimonials/{id}` | Public | Get testimonial details by ID |
| POST | CreateTestimonial | `/api/testimonials` | Required | Create new testimonial |
| PUT | UpdateTestimonial | `/api/testimonials/{id}` | Required | Update testimonial details |
| DELETE | DeleteTestimonial | `/api/testimonials/{id}` | Required | Delete testimonial |

### 2.5 DigitalAssetsController
**Route Base**: `/api/digitalassets`
**Location**: `src/Vult.Api/Controllers/DigitalAssetsController.cs`

| Method | Endpoint | Route | Auth | Description |
|--------|----------|-------|------|-------------|
| POST | UploadDigitalAsset | `/api/digitalassets` | Required | Upload new digital asset |
| GET | GetDigitalAssets | `/api/digitalassets` | Required | Get paginated list of digital assets |
| GET | GetDigitalAssetById | `/api/digitalassets/{id}` | AllowAnonymous | Get digital asset metadata by ID |
| GET | GetDigitalAssetByFilename | `/api/digitalassets/filename/{filename}` | AllowAnonymous | Get digital asset metadata by filename |
| GET | ServeDigitalAsset | `/api/digitalassets/{id}/serve` | AllowAnonymous | Serve raw file content by ID |
| GET | ServeDigitalAssetByFilename | `/api/digitalassets/serve/{filename}` | AllowAnonymous | Serve raw file content by filename |
| DELETE | DeleteDigitalAsset | `/api/digitalassets/{id}` | Required | Delete digital asset |

---

## 3. DATA TRANSFER OBJECTS (DTOs)

### 3.1 Authentication DTOs

#### AuthenticateRequest
**Location**: `src/Vult.Api/Features/Auth/AuthenticateRequest.cs`
**Used by**: `POST /api/user/token`

```json
{
    "username": "string (required)",
    "password": "string (required)"
}
```
**Validations**:
- Username is required
- Password is required

#### AuthenticateResponse
**Location**: `src/Vult.Api/Features/Auth/AuthenticateResponse.cs`

```json
{
    "token": "string (JWT token)",
    "refreshToken": "string (Base64)",
    "userId": "guid"
}
```

### 3.2 User DTOs

#### UserDto
**Location**: `src/Vult.Api/Features/Users/UserDto.cs`

```json
{
    "userId": "guid",
    "username": "string",
    "roles": [
        {
            "roleId": "guid",
            "name": "string",
            "privileges": [
                {
                    "privilegeId": "guid",
                    "roleId": "guid",
                    "aggregate": "string",
                    "accessRight": 0
                }
            ]
        }
    ],
    "defaultProfileId": "guid | null"
}
```

#### CreateUserCommand
**Location**: `src/Vult.Api/Features/Users/CreateUserCommand.cs`

```json
{
    "username": "string (required)",
    "password": "string (required)",
    "roles": ["string array of role names"]
}
```

#### UpdateUserCommand
**Location**: `src/Vult.Api/Features/Users/UpdateUserCommand.cs`

```json
{
    "userId": "guid (set from URL)",
    "username": "string (optional)",
    "roles": ["string array (optional)"]
}
```

#### ChangePasswordCommand
**Location**: `src/Vult.Api/Features/Users/ChangePasswordCommand.cs`

```json
{
    "oldPassword": "string (required, not empty)",
    "newPassword": "string (required, min 6 chars, must differ from old)",
    "confirmationPassword": "string (required, must equal newPassword)"
}
```

#### UpdatePasswordCommand
**Location**: `src/Vult.Api/Features/Users/UpdatePasswordCommand.cs`

```json
{
    "userId": "guid (set from URL)",
    "password": "string (required)"
}
```

### 3.3 Product DTOs

#### ProductDto
**Location**: `src/Vult.Api/Features/Products/ProductDto.cs`

```json
{
    "productId": "guid",
    "estimatedMSRP": "decimal",
    "estimatedResaleValue": "decimal",
    "description": "string",
    "size": "string",
    "brandName": "string",
    "gender": 0,
    "itemType": 0,
    "createdDate": "datetime",
    "updatedDate": "datetime",
    "images": [
        {
            "productImageId": "guid",
            "productId": "guid",
            "imageData": "byte[] (base64 in JSON)",
            "url": "string",
            "description": "string",
            "createdDate": "datetime"
        }
    ]
}
```

#### CreateProductDto
**Location**: `src/Vult.Api/Features/Products/CreateProductDto.cs`

```json
{
    "estimatedMSRP": "decimal",
    "estimatedResaleValue": "decimal",
    "description": "string",
    "size": "string",
    "brandName": "string",
    "gender": 0,
    "itemType": 0
}
```

#### UpdateProductDto
**Location**: `src/Vult.Api/Features/Products/UpdateProductDto.cs`

```json
{
    "productId": "guid (set from URL)",
    "estimatedMSRP": "decimal",
    "estimatedResaleValue": "decimal",
    "description": "string",
    "size": "string",
    "brandName": "string",
    "gender": 0,
    "itemType": 0
}
```

#### GetProductsQueryResult
**Location**: `src/Vult.Api/Features/Products/GetProductsQueryResult.cs`

```json
{
    "items": [ProductDto],
    "totalCount": "int",
    "pageNumber": "int",
    "pageSize": "int",
    "totalPages": "int"
}
```

#### GetFeaturedProductsQueryResult
**Location**: `src/Vult.Api/Features/Products/GetFeaturedProductsQuery.cs`

```json
{
    "items": [ProductDto],
    "totalCount": "int",
    "pageNumber": "int",
    "pageSize": "int",
    "totalPages": "int"
}
```

#### GetProductByIdQueryResult
**Location**: `src/Vult.Api/Features/Products/GetProductByIdQuery.cs`

```json
{
    "product": ProductDto
}
```

#### CreateProductCommandResult
**Location**: `src/Vult.Api/Features/Products/CreateProductCommand.cs`

```json
{
    "product": ProductDto,
    "success": "bool",
    "errors": ["string array"]
}
```

#### UpdateProductCommandResult
**Location**: `src/Vult.Api/Features/Products/UpdateProductCommand.cs`

```json
{
    "product": ProductDto,
    "success": "bool",
    "errors": ["string array"]
}
```

#### DeleteProductCommandResult
**Location**: `src/Vult.Api/Features/Products/DeleteProductCommand.cs`

```json
{
    "success": "bool",
    "errors": ["string array"]
}
```

#### IngestProductPhotosCommandResult
**Location**: `src/Vult.Api/Features/Products/IngestProductPhotosCommand.cs`

```json
{
    "success": "bool",
    "errors": ["string array"],
    "totalProcessed": "int",
    "successfullyProcessed": "int",
    "failed": "int",
    "products": [ProductDto]
}
```

### 3.4 Enumerations

#### Gender
**Location**: `src/Vult.Core/Model/ProductAggregate/Enums/Gender.cs`
- `Mens` = 0
- `Womens` = 1
- `Unisex` = 2

#### ItemType
**Location**: `src/Vult.Core/Model/ProductAggregate/Enums/ItemType.cs`
- `Shoe` = 0
- `Pants` = 1
- `Jacket` = 2
- `Shirt` = 3
- `Shorts` = 4
- `Dress` = 5
- `Skirt` = 6
- `Sweater` = 7
- `Hoodie` = 8
- `Coat` = 9

#### AccessRight
**Location**: `src/Vult.Core/Model/UserAggregate/Enums/AccessRight.cs`
- `None` = 0
- `Read` = 1
- `Write` = 2
- `Create` = 3
- `Delete` = 4

#### InvitationTokenType
**Location**: `src/Vult.Core/Model/InvitationTokenAggregate/Enums/InvitationTokenType.cs`
- `Standard` = 1

### 3.5 Invitation Token DTOs

#### InvitationTokenDto
**Location**: `src/Vult.Api/Features/InvitationTokens/InvitationTokenDto.cs`

```json
{
    "invitationTokenId": "guid",
    "value": "string (token value)",
    "expiry": "datetime | null",
    "type": 1
}
```

#### CreateInvitationTokenCommand
**Location**: `src/Vult.Api/Features/InvitationTokens/CreateInvitationTokenCommand.cs`

```json
{
    "expiry": "datetime (optional)",
    "type": 1
}
```

#### UpdateInvitationTokenExpiryCommand
**Location**: `src/Vult.Api/Features/InvitationTokens/UpdateInvitationTokenExpiryCommand.cs`

```json
{
    "invitationTokenId": "guid (set from URL)",
    "expiry": "datetime | null"
}
```

### 3.6 Testimonial DTOs

#### TestimonialDto
**Location**: `src/Vult.Api/Features/Testimonials/TestimonialDto.cs`

```json
{
    "testimonialId": "guid",
    "customerName": "string",
    "photoUrl": "string",
    "rating": 5,
    "text": "string",
    "createdDate": "datetime",
    "updatedDate": "datetime"
}
```

#### CreateTestimonialDto
**Location**: `src/Vult.Api/Features/Testimonials/CreateTestimonialDto.cs`

```json
{
    "customerName": "string (required, max 100 chars)",
    "photoUrl": "string (required, max 500 chars)",
    "rating": 5,
    "text": "string (required, max 1000 chars)"
}
```
**Validations**:
- CustomerName is required, max 100 characters
- PhotoUrl is required, max 500 characters
- Rating must be between 1 and 5
- Text is required, max 1000 characters

#### UpdateTestimonialDto
**Location**: `src/Vult.Api/Features/Testimonials/UpdateTestimonialDto.cs`

```json
{
    "testimonialId": "guid (set from URL)",
    "customerName": "string (required, max 100 chars)",
    "photoUrl": "string (required, max 500 chars)",
    "rating": 5,
    "text": "string (required, max 1000 chars)"
}
```

#### GetTestimonialsQueryResult
**Location**: `src/Vult.Api/Features/Testimonials/GetTestimonialsQuery.cs`

```json
{
    "items": [TestimonialDto],
    "totalCount": "int",
    "pageNumber": "int",
    "pageSize": "int",
    "totalPages": "int"
}
```

#### GetTestimonialByIdQueryResult
**Location**: `src/Vult.Api/Features/Testimonials/GetTestimonialByIdQuery.cs`

```json
{
    "testimonial": TestimonialDto
}
```

#### CreateTestimonialCommandResult
**Location**: `src/Vult.Api/Features/Testimonials/CreateTestimonialCommand.cs`

```json
{
    "testimonial": TestimonialDto,
    "success": "bool",
    "errors": ["string array"]
}
```

#### UpdateTestimonialCommandResult
**Location**: `src/Vult.Api/Features/Testimonials/UpdateTestimonialCommand.cs`

```json
{
    "testimonial": TestimonialDto,
    "success": "bool",
    "errors": ["string array"]
}
```

#### DeleteTestimonialCommandResult
**Location**: `src/Vult.Api/Features/Testimonials/DeleteTestimonialCommand.cs`

```json
{
    "success": "bool",
    "errors": ["string array"]
}
```

### 3.7 Digital Asset DTOs

#### DigitalAssetDto
**Location**: `src/Vult.Api/Features/DigitalAssets/DigitalAssetDto.cs`

```json
{
    "digitalAssetId": "guid",
    "name": "string",
    "contentType": "string (e.g., 'image/jpeg')",
    "height": 800.0,
    "width": 1200.0,
    "createdDate": "datetime"
}
```

#### UploadDigitalAssetCommandResult
**Location**: `src/Vult.Api/Features/DigitalAssets/UploadDigitalAssetCommand.cs`

```json
{
    "digitalAsset": DigitalAssetDto,
    "success": "bool",
    "errors": ["string array"]
}
```

#### GetDigitalAssetsQueryResult
**Location**: `src/Vult.Api/Features/DigitalAssets/GetDigitalAssetsQuery.cs`

```json
{
    "items": [DigitalAssetDto],
    "totalCount": "int",
    "pageNumber": "int",
    "pageSize": "int",
    "totalPages": "int"
}
```

#### GetDigitalAssetByIdQueryResult
**Location**: `src/Vult.Api/Features/DigitalAssets/GetDigitalAssetByIdQuery.cs`

```json
{
    "digitalAsset": DigitalAssetDto
}
```

#### GetDigitalAssetByFilenameQueryResult
**Location**: `src/Vult.Api/Features/DigitalAssets/GetDigitalAssetByFilenameQuery.cs`

```json
{
    "digitalAsset": DigitalAssetDto
}
```

#### DeleteDigitalAssetCommandResult
**Location**: `src/Vult.Api/Features/DigitalAssets/DeleteDigitalAssetCommand.cs`

```json
{
    "success": "bool",
    "errors": ["string array"]
}
```

---

## 4. AUTHENTICATION AND AUTHORIZATION

### 4.1 Authentication Mechanism

**Type**: JWT Bearer Token Authentication
**Location**: `src/Vult.Api/ConfigureServices.cs`

#### JWT Configuration
```json
{
  "Jwt": {
    "Key": "DefaultSecretKey12345678901234567890",
    "Issuer": "VultApi",
    "Audience": "VultApp",
    "ExpirationMinutes": 10080
  }
}
```

**Default Token Lifetime**: 7 days (10,080 minutes)

#### Token Structure
**Issued by**: `POST /api/user/token`

**Claims Included**:
1. `NameIdentifier` (sub) - User ID (GUID)
2. `Name` - Username
3. `sub` - User ID (standard JWT claim)
4. `jti` - Unique token ID (GUID)
5. `iat` - Issued at time (Unix timestamp)
6. `typ` - Token type ("JWT")
7. `role` - Role names (multiple claims, one per role)
8. `privilege` - Privilege codes (format: `{AccessRight}{Aggregate}`, e.g., "ReadUser", "CreateProduct")

**Algorithm**: HMAC SHA-256
**Signing**: SymmetricSecurityKey

#### Token Usage
**Header Format**:
```
Authorization: Bearer <token>
```

#### Token Validation Parameters
- `ValidateIssuerSigningKey`: true
- `ValidateIssuer`: true
- `ValidateAudience`: true
- `ValidateLifetime`: true
- `ClockSkew`: TimeSpan.Zero

### 4.2 Authorization Patterns

#### Resource Operation Authorization
**Location**: `src/Vult.Api/Behaviours/ResourceOperationAuthorizationBehavior.cs`

Implemented as MediatR Pipeline Behavior that:
1. Inspects commands/queries for `[AuthorizeResourceOperation]` attributes
2. Requires user authentication
3. Checks privilege claims in JWT token
4. Throws `UnauthorizedAccessException` on failure

#### Authorization Attributes
**Location**: `src/Vult.Core/Authorization/AuthorizeResourceOperationAttribute.cs`

**Example Usage**:
```csharp
[AuthorizeResourceOperation(Operations.Read, AggregateNames.User)]
[AuthorizeResourceOperation(Operations.Write, AggregateNames.Product)]
```

#### Authorization Operations
**Location**: `src/Vult.Core/Authorization/Operations.cs`
- `None`
- `Read`
- `Write`
- `Create`
- `Delete`

#### Authorized Resources
**Location**: `src/Vult.Core/Authorization/AggregateNames.cs`
- `User`
- `Role`
- `Product`
- `InvitationToken`

#### Privilege Format
Privileges are stored as claims in the format: `{Operation}{Resource}`

**Examples**:
- `ReadUser` - Permission to read user data
- `CreateProduct` - Permission to create products
- `WriteInvitationToken` - Permission to modify invitation tokens
- `DeleteUser` - Permission to delete users

### 4.3 Protected Endpoints

Endpoints requiring `[Authorize]` attribute (JWT token required):
- `POST /api/user/change-password`
- `GET /api/user` (GetUsers)
- `GET /api/user/{id:guid}` (GetById)
- `POST /api/user` (Create)
- `PUT /api/user/{id:guid}` (Update)
- `DELETE /api/user/{id:guid}` (Delete)
- `PUT /api/user/{id:guid}/password` (UpdatePassword)
- `GET /api/user/current`
- `POST /api/products/photos`
- `POST /api/products`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`
- All InvitationToken endpoints
- All SignalR hub connections

### 4.4 Allowed Anonymous Endpoints

Endpoints with `[AllowAnonymous]` attribute (no token required):
- `POST /api/user/token` - Obtain JWT token
- `GET /api/user/exists/{username}` - Check username availability
- `GET /api/products` - List products
- `GET /api/products/{id}` - Get product details

---

## 5. MIDDLEWARE AND FILTER CONFIGURATION

### 5.1 HTTP Request Pipeline
**Location**: `src/Vult.Api/Program.cs`

**Pipeline Order**:
1. `app.UseHttpsRedirection()` - Force HTTPS
2. `app.UseCors()` - CORS policy applied
3. `app.UseAuthentication()` - JWT validation
4. `app.UseAuthorization()` - Authorization checks
5. `app.MapControllers()` - Route to controllers
6. `app.MapHub<IngestionHub>("/hubs/ingestion")` - SignalR hub mapping

### 5.2 CORS Configuration
**Location**: `src/Vult.Api/Configuration/CorsSettings.cs`

**Default Allowed Origins**:
- http://localhost:4200
- http://localhost:4201

**Configuration Properties**:
- `AllowedOrigins` - Origin URLs
- `AllowedMethods` - HTTP methods (empty = allow any)
- `AllowedHeaders` - Request headers (empty = allow any)
- `AllowCredentials` - true
- `PolicyName` - "CorsPolicy"

### 5.3 MediatR Pipeline Behaviors
**Location**: `src/Vult.Api/ConfigureServices.cs`

**Registered Behavior**:
- `ResourceOperationAuthorizationBehavior<TRequest, TResponse>` - Applied to all MediatR requests

### 5.4 Request Constraints

#### File Upload Size Limit
- **Endpoint**: `POST /api/products/photos`
- **Limit**: 100MB (100,000,000 bytes)
- **Attribute**: `[RequestSizeLimit(100_000_000)]`

#### File Type Validation
**Allowed Extensions**:
- .jpg, .jpeg, .png, .gif, .bmp

---

## 6. ERROR HANDLING PATTERNS

### 6.1 Error Response Formats

#### Standard Error Response (400 Bad Request)
```json
{
    "errors": ["error message 1", "error message 2"]
}
```

#### Authentication Error (401 Unauthorized)
```json
{
    "message": "Invalid username or password"
}
```

#### Not Found Error (404 Not Found)
```json
{
    "message": "Product with ID {id} not found"
}
```

### 6.2 HTTP Status Codes

| Status | Meaning | Scenarios |
|--------|---------|-----------|
| 200 | OK | Successful GET/PUT operations |
| 201 | Created | Successful POST (resource creation) |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid request data, validation failure, file upload errors |
| 401 | Unauthorized | Invalid credentials, missing/expired token, insufficient privileges |
| 404 | Not Found | Resource not found (user, product, token) |

### 6.3 Common Error Scenarios

#### Authentication Failures
- Invalid username or password
- Missing JWT token
- Expired JWT token
- Invalid JWT signature

#### Authorization Failures
- Insufficient privileges for operation
- Missing required privilege claims

#### Validation Failures
- Required fields missing
- Invalid data format
- Business rule violations
- Password requirements not met

#### Not Found Errors
- User ID not found
- Product ID not found
- Invitation token not found

---

## 7. DETAILED ENDPOINT SPECIFICATIONS

### 7.1 Authentication Endpoints

#### POST /api/user/token
**Summary**: Obtain JWT access token
**Authentication**: AllowAnonymous

**Request Body**:
```json
{
    "username": "string",
    "password": "string"
}
```

**Success Response** (200 OK):
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "base64string",
    "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Response** (401 Unauthorized):
```json
{
    "message": "Invalid username or password"
}
```

---

### 7.2 User Management Endpoints

#### GET /api/user/current
**Summary**: Get current authenticated user
**Authentication**: Required (JWT Bearer)

**Success Response** (200 OK):
```json
{
    "userId": "guid",
    "username": "string",
    "roles": [
        {
            "roleId": "guid",
            "name": "string",
            "privileges": [
                {
                    "privilegeId": "guid",
                    "roleId": "guid",
                    "aggregate": "string",
                    "accessRight": 0
                }
            ]
        }
    ],
    "defaultProfileId": "guid or null"
}
```

**Error Response** (401 Unauthorized):
```json
{}
```

---

#### GET /api/user/exists/{username}
**Summary**: Check if username is available
**Authentication**: AllowAnonymous

**Path Parameters**:
- `username` (string): Username to check

**Success Response** (200 OK):
```json
true
```

---

#### POST /api/user/change-password
**Summary**: Change current user's password
**Authentication**: Required

**Request Body**:
```json
{
    "oldPassword": "string",
    "newPassword": "string",
    "confirmationPassword": "string"
}
```

**Validations**:
- `oldPassword`: Not empty
- `newPassword`: Not empty, minimum 6 characters, must differ from `oldPassword`
- `confirmationPassword`: Not empty, must equal `newPassword`

**Success Response** (200 OK):
```json
{}
```

**Error Response** (401 Unauthorized):
```json
{
    "message": "Invalid credentials or password mismatch"
}
```

**Error Response** (400 Bad Request):
```json
{
    "errors": ["New password must be different from old password"]
}
```

---

#### GET /api/user
**Summary**: Get all users
**Authentication**: Required
**Authorization**: Read permission on User aggregate

**Success Response** (200 OK):
```json
{
    "users": [
        {
            "userId": "guid",
            "username": "string",
            "roles": [],
            "defaultProfileId": "guid or null"
        }
    ]
}
```

---

#### GET /api/user/{id:guid}
**Summary**: Get user by ID
**Authentication**: Required
**Authorization**: Read permission on User aggregate

**Path Parameters**:
- `id` (guid): User ID

**Success Response** (200 OK): UserDto
**Error Response** (404 Not Found):
```json
{}
```

---

#### POST /api/user
**Summary**: Create new user
**Authentication**: Required
**Authorization**: Create permission on User aggregate

**Request Body**:
```json
{
    "username": "string",
    "password": "string",
    "roles": ["string array of role names"]
}
```

**Success Response** (201 Created):
```json
{
    "userId": "guid",
    "username": "string",
    "roles": [],
    "defaultProfileId": null
}
```

**Error Response** (400 Bad Request):
```json
{
    "message": "Username already exists or other validation error"
}
```

---

#### PUT /api/user/{id:guid}
**Summary**: Update user
**Authentication**: Required
**Authorization**: Write permission on User aggregate

**Path Parameters**:
- `id` (guid): User ID

**Request Body**:
```json
{
    "username": "string (optional)",
    "roles": ["string array (optional)"]
}
```

**Success Response** (200 OK): UserDto
**Error Response** (404 Not Found):
```json
{}
```

---

#### DELETE /api/user/{id:guid}
**Summary**: Delete user (soft delete)
**Authentication**: Required
**Authorization**: Delete permission on User aggregate

**Path Parameters**:
- `id` (guid): User ID

**Success Response** (204 No Content):
```
(empty)
```

**Error Response** (404 Not Found):
```json
{}
```

---

#### PUT /api/user/{id:guid}/password
**Summary**: Update user password (admin operation)
**Authentication**: Required
**Authorization**: Write permission on User aggregate

**Path Parameters**:
- `id` (guid): User ID

**Request Body**:
```json
{
    "password": "string"
}
```

**Success Response** (200 OK):
```json
{}
```

**Error Response** (404 Not Found):
```json
{}
```

---

### 7.3 Product Management Endpoints

#### POST /api/products/photos
**Summary**: Upload and ingest product photos using AI analysis
**Authentication**: Required
**Content-Type**: multipart/form-data

**Request Body**:
- `files` (array of files): Image files (.jpg, .jpeg, .png, .gif, .bmp)

**Constraints**:
- Maximum upload size: 100MB
- Valid file extensions: .jpg, .jpeg, .png, .gif, .bmp

**Success Response** (200 OK):
```json
{
    "success": true,
    "errors": [],
    "totalProcessed": 5,
    "successfullyProcessed": 4,
    "failed": 1,
    "products": [
        {
            "productId": "guid",
            "estimatedMSRP": 120.00,
            "estimatedResaleValue": 85.50,
            "description": "Air Max 90",
            "size": "10",
            "brandName": "Vult",
            "gender": 0,
            "itemType": 0,
            "createdDate": "2025-12-26T12:00:00Z",
            "updatedDate": "2025-12-26T12:00:00Z",
            "images": []
        }
    ]
}
```

**Error Response** (400 Bad Request):
```json
{
    "errors": ["No files provided"]
}
```

**Error Response** (400 Bad Request - Invalid file types):
```json
{
    "errors": ["Invalid file types. Only image files are allowed: .jpg, .jpeg, .png, .gif, .bmp"]
}
```

**SignalR Events**: Progress updates sent via `/hubs/ingestion`

---

#### GET /api/products
**Summary**: Get paginated list of products with optional filtering
**Authentication**: AllowAnonymous

**Query Parameters**:
- `pageNumber` (int, default: 1): Page number (must be >= 1)
- `pageSize` (int, default: 10): Items per page (max: 100)
- `brandName` (string, optional): Filter by brand
- `itemType` (int, optional): Filter by item type (enum value)
- `gender` (int, optional): Filter by gender (enum value)
- `sortBy` (string, optional): Sort field ("price", "date", "price_desc", "date_desc")

**Success Response** (200 OK):
```json
{
    "items": [
        {
            "productId": "guid",
            "estimatedMSRP": 150.00,
            "estimatedResaleValue": 95.00,
            "description": "Shoe",
            "size": "10",
            "brandName": "Vult",
            "gender": 0,
            "itemType": 0,
            "createdDate": "2025-12-26T10:00:00Z",
            "updatedDate": "2025-12-26T10:00:00Z",
            "images": []
        }
    ],
    "totalCount": 150,
    "pageNumber": 1,
    "pageSize": 10,
    "totalPages": 15
}
```

---

#### GET /api/products/featured
**Summary**: Get paginated list of featured products
**Authentication**: AllowAnonymous

**Query Parameters**:
- `pageNumber` (int, default: 1): Page number (must be >= 1)
- `pageSize` (int, default: 10): Items per page (max: 100)

**Success Response** (200 OK):
```json
{
    "items": [
        {
            "productId": "guid",
            "estimatedMSRP": 150.00,
            "estimatedResaleValue": 95.00,
            "description": "Featured Premium Shoe",
            "size": "10",
            "brandName": "Vult",
            "gender": 0,
            "itemType": 0,
            "isFeatured": true,
            "createdDate": "2025-12-26T10:00:00Z",
            "updatedDate": "2025-12-26T10:00:00Z",
            "images": []
        }
    ],
    "totalCount": 8,
    "pageNumber": 1,
    "pageSize": 10,
    "totalPages": 1
}
```

---

#### GET /api/products/{id}
**Summary**: Get product details by ID
**Authentication**: AllowAnonymous

**Path Parameters**:
- `id` (guid): Product ID

**Success Response** (200 OK):
```json
{
    "product": {
        "productId": "guid",
        "estimatedMSRP": 150.00,
        "estimatedResaleValue": 95.00,
        "description": "Shoe",
        "size": "10",
        "brandName": "Vult",
        "gender": 0,
        "itemType": 0,
        "createdDate": "2025-12-26T10:00:00Z",
        "updatedDate": "2025-12-26T10:00:00Z",
        "images": []
    }
}
```

**Error Response** (404 Not Found):
```json
{
    "message": "Product with ID {id} not found"
}
```

---

#### POST /api/products
**Summary**: Create new product
**Authentication**: Required

**Request Body**:
```json
{
    "estimatedMSRP": 150.00,
    "estimatedResaleValue": 95.00,
    "description": "Air Max 90",
    "size": "10",
    "brandName": "Vult",
    "gender": 0,
    "itemType": 0
}
```

**Success Response** (201 Created):
```json
{
    "product": {
        "productId": "guid",
        "estimatedMSRP": 150.00,
        "estimatedResaleValue": 95.00,
        "description": "Air Max 90",
        "size": "10",
        "brandName": "Vult",
        "gender": 0,
        "itemType": 0,
        "createdDate": "2025-12-26T12:00:00Z",
        "updatedDate": "2025-12-26T12:00:00Z",
        "images": []
    },
    "success": true,
    "errors": []
}
```

**Error Response** (400 Bad Request):
```json
{
    "errors": ["Validation error message"]
}
```

---

#### PUT /api/products/{id}
**Summary**: Update product details
**Authentication**: Required

**Path Parameters**:
- `id` (guid): Product ID

**Request Body**:
```json
{
    "productId": "guid or empty",
    "estimatedMSRP": 160.00,
    "estimatedResaleValue": 100.00,
    "description": "Updated Air Max 90",
    "size": "10",
    "brandName": "Vult",
    "gender": 0,
    "itemType": 0
}
```

**Validation**: If `productId` in body is provided and differs from URL ID, returns 400

**Success Response** (200 OK):
```json
{
    "product": {...},
    "success": true,
    "errors": []
}
```

**Error Response** (400 Bad Request - ID mismatch):
```json
{
    "errors": ["The ID in the URL does not match the ID in the request body"]
}
```

**Error Response** (404 Not Found):
```json
{
    "errors": ["Product with ID {id} not found"]
}
```

---

#### DELETE /api/products/{id}
**Summary**: Delete product
**Authentication**: Required

**Path Parameters**:
- `id` (guid): Product ID

**Success Response** (204 No Content):
```
(empty)
```

**Error Response** (404 Not Found):
```json
{
    "errors": ["Product not found"]
}
```

---

### 7.4 Invitation Token Endpoints

#### GET /api/invitation-token
**Summary**: Get all invitation tokens
**Authentication**: Required
**Authorization**: Read permission on InvitationToken aggregate

**Success Response** (200 OK):
```json
{
    "invitationTokens": [
        {
            "invitationTokenId": "guid",
            "value": "token-string",
            "expiry": "2025-12-31T23:59:59Z",
            "type": 1
        }
    ]
}
```

---

#### GET /api/invitation-token/{id:guid}
**Summary**: Get invitation token by ID
**Authentication**: Required
**Authorization**: Read permission on InvitationToken aggregate

**Path Parameters**:
- `id` (guid): Token ID

**Success Response** (200 OK): InvitationTokenDto
**Error Response** (404 Not Found):
```json
{}
```

---

#### POST /api/invitation-token
**Summary**: Create new invitation token
**Authentication**: Required
**Authorization**: Create permission on InvitationToken aggregate

**Request Body**:
```json
{
    "expiry": "2025-12-31T23:59:59Z (optional)",
    "type": 1
}
```

**Success Response** (201 Created): InvitationTokenDto

---

#### PUT /api/invitation-token/{id:guid}/expiry
**Summary**: Update token expiry date
**Authentication**: Required
**Authorization**: Write permission on InvitationToken aggregate

**Path Parameters**:
- `id` (guid): Token ID

**Request Body**:
```json
{
    "expiry": "2025-12-31T23:59:59Z or null"
}
```

**Success Response** (200 OK): InvitationTokenDto
**Error Response** (404 Not Found):
```json
{}
```

---

#### DELETE /api/invitation-token/{id:guid}
**Summary**: Delete invitation token
**Authentication**: Required
**Authorization**: Delete permission on InvitationToken aggregate

**Path Parameters**:
- `id` (guid): Token ID

**Success Response** (204 No Content):
```
(empty)
```

**Error Response** (404 Not Found):
```json
{}
```

---

### 7.5 Testimonial Endpoints

#### GET /api/testimonials
**Summary**: Get paginated list of testimonials with optional filtering
**Authentication**: AllowAnonymous

**Query Parameters**:
- `pageNumber` (int, default: 1): Page number (must be >= 1)
- `pageSize` (int, default: 10): Items per page (max: 100)
- `minRating` (int, optional): Filter by minimum rating (1-5)
- `sortBy` (string, optional): Sort field ("rating", "rating_desc", "date", "date_desc", "name", "name_desc")

**Success Response** (200 OK):
```json
{
    "items": [
        {
            "testimonialId": "guid",
            "customerName": "Sarah M.",
            "photoUrl": "https://example.com/photo.jpg",
            "rating": 5,
            "text": "Amazing quality!",
            "createdDate": "2025-12-26T10:00:00Z",
            "updatedDate": "2025-12-26T10:00:00Z"
        }
    ],
    "totalCount": 50,
    "pageNumber": 1,
    "pageSize": 10,
    "totalPages": 5
}
```

---

#### GET /api/testimonials/{id}
**Summary**: Get testimonial details by ID
**Authentication**: AllowAnonymous

**Path Parameters**:
- `id` (guid): Testimonial ID

**Success Response** (200 OK):
```json
{
    "testimonial": {
        "testimonialId": "guid",
        "customerName": "Sarah M.",
        "photoUrl": "https://example.com/photo.jpg",
        "rating": 5,
        "text": "Amazing quality!",
        "createdDate": "2025-12-26T10:00:00Z",
        "updatedDate": "2025-12-26T10:00:00Z"
    }
}
```

**Error Response** (404 Not Found):
```json
{
    "message": "Testimonial with ID {id} not found"
}
```

---

#### POST /api/testimonials
**Summary**: Create new testimonial
**Authentication**: Required

**Request Body**:
```json
{
    "customerName": "Sarah M.",
    "photoUrl": "https://example.com/photo.jpg",
    "rating": 5,
    "text": "Amazing quality! The vintage jacket I bought looks brand new."
}
```

**Success Response** (201 Created):
```json
{
    "testimonial": {
        "testimonialId": "guid",
        "customerName": "Sarah M.",
        "photoUrl": "https://example.com/photo.jpg",
        "rating": 5,
        "text": "Amazing quality! The vintage jacket I bought looks brand new.",
        "createdDate": "2025-12-26T12:00:00Z",
        "updatedDate": "2025-12-26T12:00:00Z"
    },
    "success": true,
    "errors": []
}
```

**Error Response** (400 Bad Request):
```json
{
    "errors": ["Rating must be between 1 and 5"]
}
```

---

#### PUT /api/testimonials/{id}
**Summary**: Update testimonial details
**Authentication**: Required

**Path Parameters**:
- `id` (guid): Testimonial ID

**Request Body**:
```json
{
    "testimonialId": "guid or empty",
    "customerName": "Sarah M.",
    "photoUrl": "https://example.com/photo.jpg",
    "rating": 5,
    "text": "Updated testimonial text."
}
```

**Validation**: If `testimonialId` in body is provided and differs from URL ID, returns 400

**Success Response** (200 OK):
```json
{
    "testimonial": {...},
    "success": true,
    "errors": []
}
```

**Error Response** (400 Bad Request - ID mismatch):
```json
{
    "errors": ["The ID in the URL does not match the ID in the request body"]
}
```

**Error Response** (404 Not Found):
```json
{
    "errors": ["Testimonial not found"]
}
```

---

#### DELETE /api/testimonials/{id}
**Summary**: Delete testimonial
**Authentication**: Required

**Path Parameters**:
- `id` (guid): Testimonial ID

**Success Response** (204 No Content):
```
(empty)
```

**Error Response** (404 Not Found):
```json
{
    "errors": ["Testimonial not found"]
}
```

---

### 7.6 Digital Asset Endpoints

#### POST /api/digitalassets
**Summary**: Upload a digital asset (image file)
**Authentication**: Required
**Authorization**: Create permission on DigitalAsset aggregate
**Content-Type**: multipart/form-data

**Request Body**:
- `file` (IFormFile): Image file to upload

**Constraints**:
- Maximum upload size: 10MB
- Valid file extensions: .jpg, .jpeg, .png, .gif, .bmp, .webp
- File signature validation: Content must match declared file type

**Success Response** (201 Created):
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

**Error Response** (400 Bad Request):
```json
{
    "errors": ["No file provided"]
}
```

---

#### GET /api/digitalassets
**Summary**: Get paginated list of digital assets
**Authentication**: Required

**Query Parameters**:
- `pageNumber` (int, default: 1): Page number
- `pageSize` (int, default: 10, max: 100): Items per page
- `sortBy` (string, optional): Sort field ("name", "name_desc", "date", "date_desc")

**Success Response** (200 OK):
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

#### GET /api/digitalassets/{id}
**Summary**: Get digital asset metadata by ID
**Authentication**: AllowAnonymous

**Path Parameters**:
- `id` (guid): Digital asset ID

**Success Response** (200 OK):
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

**Error Response** (404 Not Found):
```json
{
    "message": "Digital asset with ID {id} not found"
}
```

---

#### GET /api/digitalassets/filename/{filename}
**Summary**: Get digital asset metadata by filename
**Authentication**: AllowAnonymous

**Path Parameters**:
- `filename` (string): Asset filename to search for (case-insensitive)

**Success Response** (200 OK):
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

**Error Response** (404 Not Found):
```json
{
    "message": "Digital asset with filename 'product-image.jpg' not found"
}
```

---

#### GET /api/digitalassets/{id}/serve
**Summary**: Serve digital asset file content by ID
**Authentication**: AllowAnonymous

**Path Parameters**:
- `id` (guid): Digital asset ID

**Response Headers**:
```
Content-Type: image/jpeg
Cache-Control: public, max-age=86400
```

**Success Response** (200 OK):
Raw binary content of the image file.

**Error Response** (404 Not Found):
Standard HTTP 404 response.

---

#### GET /api/digitalassets/serve/{filename}
**Summary**: Serve digital asset file content by filename
**Authentication**: AllowAnonymous

**Path Parameters**:
- `filename` (string): Asset filename to search for

**Response Headers**:
```
Content-Type: image/jpeg
Cache-Control: public, max-age=86400
```

**Success Response** (200 OK):
Raw binary content of the image file.

**Error Response** (404 Not Found):
Standard HTTP 404 response.

---

#### DELETE /api/digitalassets/{id}
**Summary**: Delete digital asset
**Authentication**: Required
**Authorization**: Delete permission on DigitalAsset aggregate

**Path Parameters**:
- `id` (guid): Digital asset ID

**Success Response** (204 No Content):
```
(empty)
```

**Error Response** (404 Not Found):
```json
{
    "errors": ["Digital asset not found"]
}
```

---

## 8. SIGNALR HUB SPECIFICATION

### 8.1 Ingestion Hub
**Hub Path**: `/hubs/ingestion`
**Authentication**: Required (JWT Bearer token via query parameter)
**Location**: `src/Vult.Api/Hubs/IngestionHub.cs`

### 8.2 Connection

**URL**: `ws://localhost:5000/hubs/ingestion?access_token={jwt_token}`

**Query Parameters**:
- `access_token` (string): JWT Bearer token

### 8.3 Server-to-Client Events

#### IngestionProgress
**Event Name**: "IngestionProgress"
**Payload**:
```json
{
    "current": 5,
    "total": 10,
    "status": "Processing images..."
}
```

#### IngestionComplete
**Event Name**: "IngestionComplete"
**Payload**: Result object

#### IngestionError
**Event Name**: "IngestionError"
**Payload**: Error message string

#### SendIngestionUpdate
**Method**: `SendIngestionUpdate(string message)`
**Purpose**: Broadcast ingestion progress update

---

## 9. SECURITY CONSIDERATIONS

### 9.1 Password Security
- **Hashing Algorithm**: PBKDF2 with SHA256
- **Iterations**: 10,000
- **Salt Size**: 128 bits
- **Hash Size**: 256 bits
- **Storage**: Salted hash stored in database

### 9.2 Token Security
- **Algorithm**: HMAC SHA-256
- **Expiration**: 7 days (configurable)
- **Claims**: Include user ID, username, roles, privileges
- **Validation**: Full validation on every request
- **Clock Skew**: Zero (no tolerance for time drift)

### 9.3 Authorization
- **Pattern**: Role-based with privilege claims
- **Verification**: Privilege claims checked in format `{Operation}{Resource}`
- **Scope**: Per-operation and per-resource

### 9.4 CORS
- **Restricted Origins**: Configured to specific localhost ports
- **Credentials**: Allowed
- **Methods/Headers**: Any

---

## 10. CONFIGURATION SETTINGS

### 10.1 appsettings.json Structure

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=VultDb;..."
  },
  "Jwt": {
    "Key": "DefaultSecretKey12345678901234567890",
    "Issuer": "VultApi",
    "Audience": "VultApp",
    "ExpirationMinutes": 10080
  },
  "AzureAI": {
    "Endpoint": "",
    "ApiKey": "",
    "MaxRetries": 3,
    "RetryDelayMs": 1000
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "Cors": {
    "PolicyName": "CorsPolicy",
    "AllowedOrigins": [
      "http://localhost:4200",
      "http://localhost:4201"
    ],
    "AllowedMethods": [],
    "AllowedHeaders": [],
    "AllowCredentials": true
  },
  "AllowedHosts": "*"
}
```

---

## 11. API VERSIONING

**Current Status**: No API versioning implemented

**Implementation Details**:
- No version prefix in routes (e.g., no `/api/v1/`)
- No API version headers
- No deprecated endpoints

**Recommendation**: Consider implementing versioning strategy for future backward compatibility.

---

## 12. FILE LOCATIONS REFERENCE

| Component | Location |
|-----------|----------|
| Main Project File | `src/Vult.Api/Vult.Api.csproj` |
| Program Startup | `src/Vult.Api/Program.cs` |
| Service Configuration | `src/Vult.Api/ConfigureServices.cs` |
| User Controller | `src/Vult.Api/Controllers/UserController.cs` |
| Products Controller | `src/Vult.Api/Controllers/ProductsController.cs` |
| InvitationToken Controller | `src/Vult.Api/Controllers/InvitationTokenController.cs` |
| Testimonials Controller | `src/Vult.Api/Controllers/TestimonialsController.cs` |
| DigitalAssets Controller | `src/Vult.Api/Controllers/DigitalAssetsController.cs` |
| Auth Features | `src/Vult.Api/Features/Auth/` |
| User Features | `src/Vult.Api/Features/Users/` |
| Product Features | `src/Vult.Api/Features/Products/` |
| InvitationToken Features | `src/Vult.Api/Features/InvitationTokens/` |
| Testimonial Features | `src/Vult.Api/Features/Testimonials/` |
| DigitalAsset Features | `src/Vult.Api/Features/DigitalAssets/` |
| Authorization Behavior | `src/Vult.Api/Behaviours/ResourceOperationAuthorizationBehavior.cs` |
| SignalR Hub | `src/Vult.Api/Hubs/IngestionHub.cs` |
| CORS Configuration | `src/Vult.Api/Configuration/CorsSettings.cs` |

---

## DOCUMENT METADATA

**Document Version**: 1.3
**API Name**: Vult API
**Framework**: ASP.NET Core
**Last Updated**: 2025-12-27
**Frameworks Supported**: .NET 10.0, .NET 8.0
**Total Endpoints**: 34
**Total Controllers**: 5
**Authentication Method**: JWT Bearer Token
**Database**: SQL Server

---

## APPENDIX A: QUICK REFERENCE

### Authentication Flow
1. Client sends credentials to `POST /api/user/token`
2. Server validates credentials
3. Server returns JWT token with user claims
4. Client includes token in Authorization header for subsequent requests
5. Server validates token and checks privilege claims

### Common HTTP Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
Content-Type: multipart/form-data (for file uploads)
```

### Sample cURL Commands

#### Obtain Token
```bash
curl -X POST http://localhost:5000/api/user/token \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

#### Get Current User
```bash
curl -X GET http://localhost:5000/api/user/current \
  -H "Authorization: Bearer <token>"
```

#### Get Products
```bash
curl -X GET "http://localhost:5000/api/products?pageNumber=1&pageSize=10"
```

#### Upload Product Photos
```bash
curl -X POST http://localhost:5000/api/products/photos \
  -H "Authorization: Bearer <token>" \
  -F "files=@image1.jpg" \
  -F "files=@image2.jpg"
```

#### Upload Digital Asset
```bash
curl -X POST http://localhost:5000/api/digitalassets \
  -H "Authorization: Bearer <token>" \
  -F "file=@product-image.jpg"
```

#### Get Digital Asset by Filename
```bash
curl -X GET "http://localhost:5000/api/digitalassets/filename/product-image.jpg"
```

#### Serve Digital Asset (Display Image)
```bash
curl -X GET "http://localhost:5000/api/digitalassets/serve/product-image.jpg" \
  --output displayed-image.jpg
```

#### List Digital Assets
```bash
curl -X GET "http://localhost:5000/api/digitalassets?pageNumber=1&pageSize=10" \
  -H "Authorization: Bearer <token>"
```

---

END OF DOCUMENT