// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export interface Product {
  productId: string;
  name?: string;
  estimatedMSRP?: number;
  estimatedResaleValue?: number;
  description?: string;
  size?: string;
  brandName?: string;
  gender?: Gender;
  itemType?: ItemType;
  isFeatured?: boolean;
  createdDate: string;
  updatedDate: string;
  productImages?: ProductImage[];
}

export interface ProductImage {
  productImageId: string;
  productId: string;
  imageData?: string;
  url?: string;
  description?: string;
  createdDate: string;
}

export interface CreateProductRequest {
  name?: string;
  estimatedMSRP?: number;
  estimatedResaleValue?: number;
  description?: string;
  size?: string;
  brandName?: string;
  gender?: Gender;
  itemType?: ItemType;
  isFeatured?: boolean;
  productImages?: CreateProductImageRequest[];
}

export interface CreateProductImageRequest {
  imageData: string;
  description?: string;
}

export interface UpdateProductRequest {
  name?: string;
  estimatedMSRP?: number;
  estimatedResaleValue?: number;
  description?: string;
  size?: string;
  brandName?: string;
  gender?: Gender;
  itemType?: ItemType;
  isFeatured?: boolean;
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
  Coat = 9,
  Bag = 10,
  Accessories = 11,
  Hat = 12,
  Book = 13
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
  [ItemType.Coat]: 'Coat',
  [ItemType.Bag]: 'Bag',
  [ItemType.Accessories]: 'Accessories',
  [ItemType.Hat]: 'Hat',
  [ItemType.Book]: 'Book'
};
