// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export interface Testimonial {
  testimonialId: string;
  customerName: string;
  photoUrl: string;
  rating: number;
  text: string;
  createdDate: string;
  updatedDate: string;
}

export interface CreateTestimonialRequest {
  customerName: string;
  photoUrl: string;
  rating: number;
  text: string;
}

export interface UpdateTestimonialRequest {
  testimonialId: string;
  customerName: string;
  photoUrl: string;
  rating: number;
  text: string;
}

export interface TestimonialResponse {
  testimonial: Testimonial;
  success: boolean;
  errors: string[];
}

export interface GetTestimonialByIdResponse {
  testimonial: Testimonial;
}
