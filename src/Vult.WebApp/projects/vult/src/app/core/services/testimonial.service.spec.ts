// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestimonialService } from './testimonial.service';
import { Testimonial, PaginatedResponse } from '../models';

describe('TestimonialService', () => {
  let service: TestimonialService;
  let httpMock: HttpTestingController;

  const mockTestimonials: Testimonial[] = [
    {
      testimonialId: '1',
      customerName: 'Sarah M.',
      photoUrl: 'https://example.com/photo1.jpg',
      rating: 5,
      text: 'Amazing quality!',
      createdDate: '2025-12-26T10:00:00Z',
      updatedDate: '2025-12-26T10:00:00Z',
    },
    {
      testimonialId: '2',
      customerName: 'James K.',
      photoUrl: 'https://example.com/photo2.jpg',
      rating: 4,
      text: 'Great product!',
      createdDate: '2025-12-26T11:00:00Z',
      updatedDate: '2025-12-26T11:00:00Z',
    },
  ];

  const mockPaginatedResponse: PaginatedResponse<Testimonial> = {
    items: mockTestimonials,
    totalCount: 2,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 1,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestimonialService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TestimonialService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTestimonials', () => {
    it('should return paginated testimonials', fakeAsync(() => {
      let result: PaginatedResponse<Testimonial> | undefined;

      service.getTestimonials(1, 10).subscribe((res) => {
        result = res;
      });

      const req = httpMock.expectOne('/api/testimonials?pageNumber=1&pageSize=10');
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
      tick();

      expect(result).toEqual(mockPaginatedResponse);
    }));

    it('should apply filters to query params', fakeAsync(() => {
      service.getTestimonials(1, 10, { minRating: 4, sortBy: 'rating_desc' }).subscribe();

      const req = httpMock.expectOne(
        '/api/testimonials?pageNumber=1&pageSize=10&minRating=4&sortBy=rating_desc'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    }));

    it('should fallback to mock data on error', fakeAsync(() => {
      let result: PaginatedResponse<Testimonial> | undefined;

      service.getTestimonials(1, 10).subscribe((res) => {
        result = res;
      });

      const req = httpMock.expectOne('/api/testimonials?pageNumber=1&pageSize=10');
      req.error(new ProgressEvent('Network error'));
      tick();

      expect(result).toBeDefined();
      expect(result!.items.length).toBeGreaterThan(0);
    }));
  });

  describe('getTestimonialById', () => {
    it('should return testimonial by id', fakeAsync(() => {
      const mockResponse = { testimonial: mockTestimonials[0] };
      let result: { testimonial: Testimonial } | undefined;

      service.getTestimonialById('1').subscribe((res) => {
        result = res;
      });

      const req = httpMock.expectOne('/api/testimonials/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
      tick();

      expect(result).toEqual(mockResponse);
    }));

    it('should fallback to mock data on error', fakeAsync(() => {
      let result: { testimonial: Testimonial } | undefined;

      service.getTestimonialById('1').subscribe((res) => {
        result = res;
      });

      const req = httpMock.expectOne('/api/testimonials/1');
      req.error(new ProgressEvent('Network error'));
      tick();

      expect(result).toBeDefined();
      expect(result!.testimonial).toBeDefined();
    }));
  });

  describe('createTestimonial', () => {
    it('should create a new testimonial', fakeAsync(() => {
      const newTestimonial = {
        customerName: 'New User',
        photoUrl: 'https://example.com/new.jpg',
        rating: 5,
        text: 'Great experience!',
      };
      const mockResponse = {
        testimonial: { ...newTestimonial, testimonialId: '3' } as Testimonial,
        success: true,
        errors: [],
      };

      let result: any;
      service.createTestimonial(newTestimonial).subscribe((res) => {
        result = res;
      });

      const req = httpMock.expectOne('/api/testimonials');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newTestimonial);
      req.flush(mockResponse);
      tick();

      expect(result.success).toBe(true);
    }));
  });

  describe('updateTestimonial', () => {
    it('should update an existing testimonial', fakeAsync(() => {
      const updateRequest = {
        testimonialId: '1',
        customerName: 'Updated Name',
        photoUrl: 'https://example.com/updated.jpg',
        rating: 4,
        text: 'Updated text',
      };
      const mockResponse = {
        testimonial: updateRequest as Testimonial,
        success: true,
        errors: [],
      };

      let result: any;
      service.updateTestimonial('1', updateRequest).subscribe((res) => {
        result = res;
      });

      const req = httpMock.expectOne('/api/testimonials/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateRequest);
      req.flush(mockResponse);
      tick();

      expect(result.success).toBe(true);
    }));
  });

  describe('deleteTestimonial', () => {
    it('should delete a testimonial', fakeAsync(() => {
      let completed = false;

      service.deleteTestimonial('1').subscribe(() => {
        completed = true;
      });

      const req = httpMock.expectOne('/api/testimonials/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
      tick();

      expect(completed).toBe(true);
    }));
  });
});
