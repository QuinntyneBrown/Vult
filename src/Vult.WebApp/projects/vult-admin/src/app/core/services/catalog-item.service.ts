// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CatalogItem,
  CreateCatalogItemRequest,
  UpdateCatalogItemRequest,
  PaginatedResponse
} from '../models';

export interface CatalogItemFilters {
  brandName?: string;
  itemType?: number;
  gender?: number;
  sortBy?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogItemService {
  private readonly API_URL = '/api';

  constructor(private http: HttpClient) {}

  getCatalogItems(
    pageNumber: number = 1,
    pageSize: number = 10,
    filters?: CatalogItemFilters
  ): Observable<PaginatedResponse<CatalogItem>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (filters) {
      if (filters.brandName) params = params.set('brandName', filters.brandName);
      if (filters.itemType !== undefined) params = params.set('itemType', filters.itemType.toString());
      if (filters.gender !== undefined) params = params.set('gender', filters.gender.toString());
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    }

    return this.http.get<PaginatedResponse<CatalogItem>>(`${this.API_URL}/catalogitems`, { params });
  }

  getCatalogItemById(catalogItemId: string): Observable<CatalogItem> {
    return this.http.get<CatalogItem>(`${this.API_URL}/catalogitems/${catalogItemId}`);
  }

  createCatalogItem(request: CreateCatalogItemRequest): Observable<CatalogItem> {
    return this.http.post<CatalogItem>(`${this.API_URL}/catalogitems`, request);
  }

  updateCatalogItem(catalogItemId: string, request: UpdateCatalogItemRequest): Observable<CatalogItem> {
    return this.http.put<CatalogItem>(`${this.API_URL}/catalogitems/${catalogItemId}`, request);
  }

  deleteCatalogItem(catalogItemId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/catalogitems/${catalogItemId}`);
  }
}
