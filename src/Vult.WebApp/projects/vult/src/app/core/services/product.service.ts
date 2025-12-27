// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, of, delay } from 'rxjs';
import { Product, IngestionResult, PaginatedResponse } from '../models';
import { ProductDetailData } from '../../pages/product-detail/product-detail';

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
    return this.http.get<Product>(`${this.API_URL}/products/${id}`);
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

  getMockProductById(id: string): Observable<ProductDetailData> {
    const mockProducts: Record<string, ProductDetailData> = {
      '1': {
        id: 'AF1-001',
        title: 'Air Force 1 Low',
        subtitle: "Men's Shoes",
        price: {
          current: 110,
          currency: 'USD',
          currencySymbol: '$'
        },
        images: [
          { id: 'img-1', url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/AIR+FORCE+1+%2707.png', altText: 'Front view' },
          { id: 'img-2', url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/00375837-849f-4f17-ba24-d201571535e0/AIR+FORCE+1+%2707.png', altText: 'Side view' },
          { id: 'img-3', url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/33533fe2-1157-4f37-b3ea-c32af199acb0/AIR+FORCE+1+%2707.png', altText: 'Back view' }
        ],
        colors: [
          { id: 'color-1', name: 'White/White', color: '#FFFFFF', imageUrl: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/AIR+FORCE+1+%2707.png' },
          { id: 'color-2', name: 'Black/Black', color: '#222222', imageUrl: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/AIR+FORCE+1+%2707.png' }
        ],
        sizes: [
          { id: 'size-7', label: '7', available: true },
          { id: 'size-8', label: '8', available: true },
          { id: 'size-9', label: '9', available: true },
          { id: 'size-10', label: '10', available: true },
          { id: 'size-11', label: '11', available: false },
          { id: 'size-12', label: '12', available: true }
        ],
        accordionSections: [
          {
            id: 'description',
            title: 'Product Description',
            content: '<p>The radiance lives on in the Air Force 1 Low. This b-ball original puts a fresh spin on what you know best: crisp leather, bold colors and the perfect amount of flash to make you shine.</p>',
            isExpanded: true
          },
          {
            id: 'details',
            title: 'Product Details',
            content: '<ul><li>Full-grain leather upper</li><li>Foam midsole</li><li>Perforations on toe</li><li>Rubber outsole</li></ul>'
          }
        ]
      },
      '2': {
        id: 'DUNK-002',
        title: 'Dunk Low Retro',
        subtitle: "Men's Shoes",
        price: {
          current: 115,
          currency: 'USD',
          currencySymbol: '$'
        },
        images: [
          { id: 'img-1', url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b1bcbca4-e853-4df7-b329-5be3c61ee057/DUNK+LOW+RETRO.png', altText: 'Front view' },
          { id: 'img-2', url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e9cb46ee-8e6e-4d67-9cb0-763a8a475617/DUNK+LOW+RETRO.png', altText: 'Side view' }
        ],
        colors: [
          { id: 'color-1', name: 'Black/White', color: '#222222', imageUrl: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b1bcbca4-e853-4df7-b329-5be3c61ee057/DUNK+LOW+RETRO.png' }
        ],
        sizes: [
          { id: 'size-8', label: '8', available: true },
          { id: 'size-9', label: '9', available: true },
          { id: 'size-10', label: '10', available: true },
          { id: 'size-11', label: '11', available: true }
        ],
        accordionSections: [
          {
            id: 'description',
            title: 'Product Description',
            content: '<p>Created for the hardwood but taken to the streets, the Dunk Low Retro returns with crisp overlays and original team colors.</p>',
            isExpanded: true
          }
        ]
      },
      '3': {
        id: 'PEGASUS-003',
        title: 'Air Zoom Pegasus 41',
        subtitle: "Men's Road Running Shoes",
        price: {
          current: 140,
          original: 160,
          currency: 'USD',
          currencySymbol: '$',
          salePercentage: 12
        },
        images: [
          { id: 'img-1', url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/a7459fe2-baa3-4d76-8bc3-4ce4917850b4/PEGASUS+41.png', altText: 'Front view' },
          { id: 'img-2', url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/81a31a51-323a-4f0d-b6e7-e448a7d8a48f/PEGASUS+41.png', altText: 'Side view' }
        ],
        colors: [
          { id: 'color-1', name: 'Black/White/Anthracite', color: '#222222', imageUrl: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/a7459fe2-baa3-4d76-8bc3-4ce4917850b4/PEGASUS+41.png' },
          { id: 'color-2', name: 'Wolf Grey/Volt', color: '#999999', imageUrl: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/a7459fe2-baa3-4d76-8bc3-4ce4917850b4/PEGASUS+41.png' }
        ],
        sizes: [
          { id: 'size-8', label: '8', available: true },
          { id: 'size-9', label: '9', available: true },
          { id: 'size-10', label: '10', available: false },
          { id: 'size-11', label: '11', available: true },
          { id: 'size-12', label: '12', available: true }
        ],
        accordionSections: [
          {
            id: 'description',
            title: 'Product Description',
            content: '<p>The Pegasus 41 is a responsive running shoe that delivers a smooth, springy ride mile after mile. Zoom Air cushioning and a breathable mesh upper keep you comfortable from start to finish.</p>',
            isExpanded: true
          },
          {
            id: 'benefits',
            title: 'Benefits',
            content: '<ul><li>Zoom Air unit in the forefoot for responsive cushioning</li><li>React foam midsole for lightweight comfort</li><li>Engineered mesh upper for breathability</li></ul>'
          }
        ],
        promotionalMessage: 'Limited time offer!'
      }
    };

    // Default product for unknown IDs
    const defaultProduct: ProductDetailData = {
      id: id,
      title: 'Product Not Found',
      subtitle: 'This product could not be found',
      price: {
        current: 0,
        currency: 'USD',
        currencySymbol: '$'
      },
      images: [],
      colors: [],
      sizes: [],
      accordionSections: []
    };

    const product = mockProducts[id] || defaultProduct;

    // Simulate network delay
    return of(product).pipe(delay(500));
  }
}
