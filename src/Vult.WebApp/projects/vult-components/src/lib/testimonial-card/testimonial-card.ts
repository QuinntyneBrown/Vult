// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRating } from '../star-rating/star-rating';

export interface TestimonialCardData {
  id: string;
  customerName: string;
  photoUrl: string;
  rating: number;
  text: string;
}

@Component({
  selector: 'v-testimonial-card',
  standalone: true,
  imports: [CommonModule, StarRating],
  template: `
    <article class="testimonial-card">
      <div class="testimonial-card__image">
        <img
          [src]="testimonial.photoUrl"
          [alt]="testimonial.customerName + ' - Vult customer'"
          loading="lazy"
        />
      </div>
      <div class="testimonial-card__content">
        <v-star-rating
          [rating]="testimonial.rating"
          size="medium"
        ></v-star-rating>
        <p class="testimonial-card__text">{{ testimonial.text }}</p>
      </div>
    </article>
  `,
  styles: [`
    .testimonial-card {
      background-color: #ffffff;
      border-radius: 0;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      aspect-ratio: 3 / 4;
      display: flex;
      flex-direction: column;
      transition: box-shadow 0.2s ease;
    }

    .testimonial-card:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .testimonial-card__image {
      flex: 0 0 50%;
      overflow: hidden;
    }

    .testimonial-card__image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }

    .testimonial-card__content {
      flex: 0 0 50%;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .testimonial-card__text {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      font-weight: 400;
      color: #000000;
      line-height: 1.5;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    @media (max-width: 768px) {
      .testimonial-card__content {
        padding: 12px;
        gap: 8px;
      }

      .testimonial-card__text {
        font-size: 13px;
        -webkit-line-clamp: 3;
      }
    }

    @media (max-width: 400px) {
      .testimonial-card__content {
        padding: 10px;
        gap: 6px;
      }

      .testimonial-card__text {
        font-size: 12px;
        line-height: 1.4;
        -webkit-line-clamp: 4;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .testimonial-card {
        transition: none;
      }
    }

    @media (prefers-contrast: high) {
      .testimonial-card {
        box-shadow: 0 0 0 1px #000000;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialCard {
  @Input({ required: true }) testimonial!: TestimonialCardData;
}
