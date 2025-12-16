// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export interface CatalogItem {
  catalogItemId: string;
  estimatedMSRP?: number;
  estimatedResaleValue?: number;
  description?: string;
  size?: string;
  brandName?: string;
  gender?: number;
  itemType?: number;
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

export interface IngestionResult {
  success: boolean;
  errors: string[];
  totalProcessed: number;
  successfullyProcessed: number;
  failed: number;
  catalogItems: CatalogItem[];
}

export interface IngestionProgress {
  current: number;
  total: number;
  status: string;
}
