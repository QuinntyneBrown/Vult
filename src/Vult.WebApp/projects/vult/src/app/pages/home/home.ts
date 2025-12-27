// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import {
  HeroSection,
  ProductCard,
  ProductCardData,
  TestimonialCard,
  TestimonialCardData,
  TypographyDisplay,
} from 'vult-components';
import { TestimonialService } from '../../core/services';
import { Testimonial as TestimonialModel } from '../../core/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroSection,
    ProductCard,
    TestimonialCard,
    TypographyDisplay,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private _testimonialService = inject(TestimonialService);
  private _router = inject(Router);

  heroImage = 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=1920&q=80';
  heroTitle = 'Buy Premium Used Products';
  heroOverlay = 'linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0) 100%)';

  featuredProducts: ProductCardData[] = [
    {
      id: '1',
      name: 'New Era Blue Jays Cap',
      category: 'Headwear',
      price: 45.00,
      imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80',
      badge: 'New',
      badgeType: 'new',
    },
    {
      id: '2',
      name: 'Vintage Leather Jacket',
      category: 'Outerwear',
      price: 189.00,
      originalPrice: 250.00,
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',
      badge: 'Sale',
      badgeType: 'sale',
    },
    {
      id: '3',
      name: 'Classic Denim Jeans',
      category: 'Bottoms',
      price: 75.00,
      imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80',
    },
    {
      id: '4',
      name: 'Retro Sneakers',
      category: 'Footwear',
      price: 120.00,
      imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80',
      badge: 'Member',
      badgeType: 'member',
    },
    {
      id: '5',
      name: 'Designer Sunglasses',
      category: 'Accessories',
      price: 95.00,
      imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
    },
    {
      id: '6',
      name: 'Vintage Watch',
      category: 'Accessories',
      price: 299.00,
      imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80',
    },
    {
      id: '7',
      name: 'Canvas Backpack',
      category: 'Bags',
      price: 85.00,
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    },
    {
      id: '8',
      name: 'Wool Sweater',
      category: 'Tops',
      price: 110.00,
      imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
    },
  ];

  testimonials$ = this._testimonialService.getTestimonials(1, 10, { sortBy: 'rating_desc' }).pipe(
    map(response => response.items.map(this.mapToTestimonial))
  );

  private mapToTestimonial(model: TestimonialModel): TestimonialCardData {
    return {
      id: model.testimonialId,
      customerName: model.customerName,
      photoUrl: model.photoUrl,
      rating: model.rating,
      text: model.text,
    };
  }

  onShopClick(): void {
    this._router.navigate(['/products']);
  }

  onProductClick(product: ProductCardData): void {
    this._router.navigate(['/product', product.id]);
  }

  onFavoriteToggle(event: { product: ProductCardData; isFavorite: boolean }): void {
    console.log('Favorite toggled:', event.product.name, event.isFavorite);
  }
}
