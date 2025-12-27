// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, of, delay } from 'rxjs';
import { Product, IngestionResult, PaginatedResponse, Gender, ItemType } from '../models';

export interface ProductFilters {
  brandName?: string;
  itemType?: number;
  gender?: number;
  sortBy?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = '/api';

  constructor(private http: HttpClient) {}

  getProducts(
    pageNumber: number = 1,
    pageSize: number = 10,
    filters?: ProductFilters
  ): Observable<PaginatedResponse<Product>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (filters) {
      if (filters.brandName) params = params.set('brandName', filters.brandName);
      if (filters.itemType !== undefined) params = params.set('itemType', filters.itemType.toString());
      if (filters.gender !== undefined) params = params.set('gender', filters.gender.toString());
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    }

    return this.http.get<PaginatedResponse<Product>>(`${this.API_URL}/products`, { params });
  }

  getProductById(id: string): Observable<Product> {
    const mockProducts: Record<string, Product> = {
      '1': {
        productId: '1',
        name: 'Air Force 1 Low',
        description: "Men's Shoes - The radiance lives on in the Air Force 1 Low. This b-ball original puts a fresh spin on what you know best: crisp leather, bold colors and the perfect amount of flash to make you shine.",
        estimatedMSRP: 110,
        brandName: 'Vult',
        gender: Gender.Mens,
        itemType: ItemType.Shoe,
        size: '7,8,9,10,11,12',
        isFeatured: true,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        productImages: [
          { productImageId: 'img-1', productId: '1', url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/AIR+FORCE+1+%2707.png', description: 'Front view', createdDate: new Date().toISOString() },
          { productImageId: 'img-2', productId: '1', url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/00375837-849f-4f17-ba24-d201571535e0/AIR+FORCE+1+%2707.png', description: 'Side view', createdDate: new Date().toISOString() },
          { productImageId: 'img-3', productId: '1', url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/33533fe2-1157-4f37-b3ea-c32af199acb0/AIR+FORCE+1+%2707.png', description: 'Back view', createdDate: new Date().toISOString() }
        ]
      },
      '2': {
        productId: '2',
        name: 'Dunk Low Retro',
        description: "Men's Shoes - Created for the hardwood but taken to the streets, the Dunk Low Retro returns with crisp overlays and original team colors.",
        estimatedMSRP: 115,
        brandName: 'Vult',
        gender: Gender.Mens,
        itemType: ItemType.Shoe,
        size: '8,9,10,11',
        isFeatured: true,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        productImages: [
          { productImageId: 'img-1', productId: '2', url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b1bcbca4-e853-4df7-b329-5be3c61ee057/DUNK+LOW+RETRO.png', description: 'Front view', createdDate: new Date().toISOString() },
          { productImageId: 'img-2', productId: '2', url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e9cb46ee-8e6e-4d67-9cb0-763a8a475617/DUNK+LOW+RETRO.png', description: 'Side view', createdDate: new Date().toISOString() }
        ]
      },
      '3': {
        productId: '3',
        name: 'Air Zoom Pegasus 41',
        description: "Men's Road Running Shoes - The Pegasus 41 is a responsive running shoe that delivers a smooth, springy ride mile after mile. Zoom Air cushioning and a breathable mesh upper keep you comfortable from start to finish.",
        estimatedMSRP: 140,
        estimatedResaleValue: 160,
        brandName: 'Vult',
        gender: Gender.Mens,
        itemType: ItemType.Shoe,
        size: '8,9,10,11,12',
        isFeatured: true,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        productImages: [
          { productImageId: 'img-1', productId: '3', url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/a7459fe2-baa3-4d76-8bc3-4ce4917850b4/PEGASUS+41.png', description: 'Front view', createdDate: new Date().toISOString() },
          { productImageId: 'img-2', productId: '3', url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/81a31a51-323a-4f0d-b6e7-e448a7d8a48f/PEGASUS+41.png', description: 'Side view', createdDate: new Date().toISOString() }
        ]
      }
    };

    const defaultProduct: Product = {
      productId: id,
      name: 'Product Not Found',
      description: 'This product could not be found',
      estimatedMSRP: 0,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      productImages: []
    };

    const product = mockProducts[id] || defaultProduct;
    return of(product).pipe(delay(500));
  }

  getFeaturedProducts(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<PaginatedResponse<Product>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedResponse<Product>>(`${this.API_URL}/products/featured`, { params })
    .pipe(
      tap(response => console.log('Featured Products Response:', response))
    );
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.API_URL}/products`, product);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/products/${id}`, product);
  }

  uploadPhotos(files: File[]): Observable<IngestionResult> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file, file.name);
    });

    return this.http.post<IngestionResult>(`${this.API_URL}/products/photos`, formData);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/products/${id}`);
  }
}
