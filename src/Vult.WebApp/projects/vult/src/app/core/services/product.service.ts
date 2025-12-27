// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, IngestionResult, PaginatedResponse } from '../models';

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

    return this.http.get<PaginatedResponse<Product>>(`${this.API_URL}/products/featured`, { params });
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
