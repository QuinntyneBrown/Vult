import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatalogItem, IngestionResult } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CatalogItemService {
  private readonly API_URL = '/api';

  constructor(private http: HttpClient) {}

  getCatalogItems(
    pageNumber: number = 1,
    pageSize: number = 10,
    filters?: {
      brandName?: string;
      itemType?: number;
      gender?: number;
      sortBy?: string;
    }
  ): Observable<any> {
    let params: any = {
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString()
    };

    if (filters) {
      if (filters.brandName) params.brandName = filters.brandName;
      if (filters.itemType !== undefined) params.itemType = filters.itemType.toString();
      if (filters.gender !== undefined) params.gender = filters.gender.toString();
      if (filters.sortBy) params.sortBy = filters.sortBy;
    }

    return this.http.get<any>(`${this.API_URL}/catalogitems`, { params });
  }

  getCatalogItemById(id: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/catalogitems/${id}`);
  }

  uploadPhotos(files: File[]): Observable<IngestionResult> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file, file.name);
    });

    return this.http.post<IngestionResult>(`${this.API_URL}/photoupload`, formData);
  }

  deleteCatalogItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/catalogitems/${id}`);
  }
}
