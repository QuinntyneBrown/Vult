// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export interface CatalogItem {
  catalogItemId: string;
  estimatedMSRP?: number;
  estimatedResaleValue?: number;
  description?: string;
  size?: string;
  brandName?: string;
  gender?: Gender;
  itemType?: ItemType;
  createdDate: string;
  updatedDate: string;
  catalogItemImages?: CatalogItemImage[];
}

export interface CatalogItemImage {
  catalogItemImageId: string;
  catalogItemId: string;
  imageData?: string;
  description?: string;
  createdDate: string;
}

export interface CreateCatalogItemRequest {
  estimatedMSRP?: number;
  estimatedResaleValue?: number;
  description?: string;
  size?: string;
  brandName?: string;
  gender?: Gender;
  itemType?: ItemType;
  catalogItemImages?: CreateCatalogItemImageRequest[];
}

export interface CreateCatalogItemImageRequest {
  imageData: string;
  description?: string;
}

export interface UpdateCatalogItemRequest {
  estimatedMSRP?: number;
  estimatedResaleValue?: number;
  description?: string;
  size?: string;
  brandName?: string;
  gender?: Gender;
  itemType?: ItemType;
}

export enum Gender {
  Mens = 0,
  Womens = 1,
  Unisex = 2
}

export enum ItemType {
  Shoe = 0,
  Pants = 1,
  Jacket = 2,
  Shirt = 3,
  Shorts = 4,
  Dress = 5,
  Skirt = 6,
  Sweater = 7,
  Hoodie = 8,
  Coat = 9
}

export const GenderLabels: Record<Gender, string> = {
  [Gender.Mens]: 'Mens',
  [Gender.Womens]: 'Womens',
  [Gender.Unisex]: 'Unisex'
};

export const ItemTypeLabels: Record<ItemType, string> = {
  [ItemType.Shoe]: 'Shoe',
  [ItemType.Pants]: 'Pants',
  [ItemType.Jacket]: 'Jacket',
  [ItemType.Shirt]: 'Shirt',
  [ItemType.Shorts]: 'Shorts',
  [ItemType.Dress]: 'Dress',
  [ItemType.Skirt]: 'Skirt',
  [ItemType.Sweater]: 'Sweater',
  [ItemType.Hoodie]: 'Hoodie',
  [ItemType.Coat]: 'Coat'
};
