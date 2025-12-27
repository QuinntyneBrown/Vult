// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import {
  Testimonial,
  CreateTestimonialRequest,
  UpdateTestimonialRequest,
  TestimonialResponse,
  GetTestimonialByIdResponse,
  PaginatedResponse,
} from '../models';

export interface TestimonialFilters {
  minRating?: number;
  sortBy?: string;
}

// Mock data for when backend is not available
const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    testimonialId: '1',
    customerName: 'Sarah M.',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    rating: 5,
    text: 'Amazing quality! The vintage jacket I bought looks brand new. Fast shipping and excellent customer service.',
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
  },
  {
    testimonialId: '2',
    customerName: 'James K.',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    rating: 5,
    text: 'Found exactly what I was looking for. The authentication process gave me confidence in my purchase.',
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
  },
  {
    testimonialId: '3',
    customerName: 'Emily R.',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    rating: 4,
    text: 'Great selection of premium items. Prices are fair and the condition descriptions are accurate.',
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
  },
  {
    testimonialId: '4',
    customerName: 'Michael T.',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    rating: 5,
    text: 'Best marketplace for used premium goods. Everything I ordered exceeded my expectations.',
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
  },
];

@Injectable({
  providedIn: 'root',
})
export class TestimonialService {
  private readonly API_URL = '/api';
  private useMockData = false;

  constructor(private http: HttpClient) {}

  getTestimonials(
    pageNumber: number = 1,
    pageSize: number = 10,
    filters?: TestimonialFilters
  ): Observable<PaginatedResponse<Testimonial>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (filters) {
      if (filters.minRating !== undefined)
        params = params.set('minRating', filters.minRating.toString());
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    }

    return this.http
      .get<PaginatedResponse<Testimonial>>(`${this.API_URL}/testimonials`, { params })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.warn('Backend not available, using mock data for testimonials');
          this.useMockData = true;
          return of(this.getMockPaginatedResponse(pageNumber, pageSize, filters));
        })
      );
  }

  getTestimonialById(id: string): Observable<GetTestimonialByIdResponse> {
    return this.http
      .get<GetTestimonialByIdResponse>(`${this.API_URL}/testimonials/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.warn('Backend not available, using mock data for testimonial');
          const testimonial = MOCK_TESTIMONIALS.find((t) => t.testimonialId === id);
          return of({ testimonial: testimonial || MOCK_TESTIMONIALS[0] });
        })
      );
  }

  createTestimonial(testimonial: CreateTestimonialRequest): Observable<TestimonialResponse> {
    return this.http.post<TestimonialResponse>(`${this.API_URL}/testimonials`, testimonial);
  }

  updateTestimonial(
    id: string,
    testimonial: UpdateTestimonialRequest
  ): Observable<TestimonialResponse> {
    return this.http.put<TestimonialResponse>(`${this.API_URL}/testimonials/${id}`, testimonial);
  }

  deleteTestimonial(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/testimonials/${id}`);
  }

  private getMockPaginatedResponse(
    pageNumber: number,
    pageSize: number,
    filters?: TestimonialFilters
  ): PaginatedResponse<Testimonial> {
    let filteredData = [...MOCK_TESTIMONIALS];

    // Apply filters
    if (filters?.minRating !== undefined) {
      filteredData = filteredData.filter((t) => t.rating >= filters.minRating!);
    }

    // Apply sorting
    if (filters?.sortBy) {
      switch (filters.sortBy.toLowerCase()) {
        case 'rating':
          filteredData.sort((a, b) => a.rating - b.rating);
          break;
        case 'rating_desc':
          filteredData.sort((a, b) => b.rating - a.rating);
          break;
        case 'name':
          filteredData.sort((a, b) => a.customerName.localeCompare(b.customerName));
          break;
        case 'name_desc':
          filteredData.sort((a, b) => b.customerName.localeCompare(a.customerName));
          break;
        case 'date':
          filteredData.sort(
            (a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
          );
          break;
        case 'date_desc':
        default:
          filteredData.sort(
            (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
          );
          break;
      }
    }

    const totalCount = filteredData.length;
    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;
    const items = filteredData.slice(start, end);

    return {
      items,
      totalCount,
      pageNumber,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  }
}
