// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Vult.Core;

namespace Vult.Api.Features.CatalogItems;

public static class CatalogItemExtensions
{
    public static CatalogItemDto ToDto(this CatalogItem catalogItem)
    {
        return new CatalogItemDto
        {
            CatalogItemId = catalogItem.CatalogItemId,
            EstimatedMSRP = catalogItem.EstimatedMSRP,
            EstimatedResaleValue = catalogItem.EstimatedResaleValue,
            Description = catalogItem.Description,
            Size = catalogItem.Size,
            BrandName = catalogItem.BrandName,
            Gender = catalogItem.Gender,
            ItemType = catalogItem.ItemType,
            CreatedDate = catalogItem.CreatedDate,
            UpdatedDate = catalogItem.UpdatedDate,
            Images = catalogItem.CatalogItemImages?.Select(x => x.ToDto()).ToList() ?? new List<CatalogItemImageDto>()
        };
    }

    public static CatalogItemImageDto ToDto(this CatalogItemImage image)
    {
        return new CatalogItemImageDto
        {
            CatalogItemImageId = image.CatalogItemImageId,
            CatalogItemId = image.CatalogItemId,
            ImageData = image.ImageData,
            Description = image.Description,
            CreatedDate = image.CreatedDate
        };
    }

    public static CatalogItem ToCatalogItem(this CreateCatalogItemDto dto)
    {
        return new CatalogItem
        {
            CatalogItemId = Guid.NewGuid(),
            EstimatedMSRP = dto.EstimatedMSRP,
            EstimatedResaleValue = dto.EstimatedResaleValue,
            Description = dto.Description,
            Size = dto.Size,
            BrandName = dto.BrandName,
            Gender = dto.Gender,
            ItemType = dto.ItemType,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };
    }

    public static void UpdateFromDto(this CatalogItem catalogItem, UpdateCatalogItemDto dto)
    {
        catalogItem.EstimatedMSRP = dto.EstimatedMSRP;
        catalogItem.EstimatedResaleValue = dto.EstimatedResaleValue;
        catalogItem.Description = dto.Description;
        catalogItem.Size = dto.Size;
        catalogItem.BrandName = dto.BrandName;
        catalogItem.Gender = dto.Gender;
        catalogItem.ItemType = dto.ItemType;
        catalogItem.UpdatedDate = DateTime.UtcNow;
    }
}
