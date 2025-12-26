// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import {
  HeroSectionComponent,
  ProductCardComponent,
  ProductCardData,
  TypographyDisplayComponent,
} from 'vult-components';

export interface Testimonial {
  id: string;
  customerName: string;
  photoUrl: string;
  rating: number;
  text: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroSectionComponent,
    ProductCardComponent,
    TypographyDisplayComponent,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  heroImage = 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=1920&q=80';
  heroTitle = 'Buy Premium Used Products';
  heroOverlay = 'linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0) 100%)';

  featuredProducts = signal<ProductCardData[]>([
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
  ]);

  testimonials = signal<Testimonial[]>([
    {
      id: '1',
      customerName: 'Sarah M.',
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
      rating: 5,
      text: 'Amazing quality! The vintage jacket I bought looks brand new. Fast shipping and excellent customer service.',
    },
    {
      id: '2',
      customerName: 'James K.',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      rating: 5,
      text: 'Found exactly what I was looking for. The authentication process gave me confidence in my purchase.',
    },
    {
      id: '3',
      customerName: 'Emily R.',
      photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
      rating: 4,
      text: 'Great selection of premium items. Prices are fair and the condition descriptions are accurate.',
    },
    {
      id: '4',
      customerName: 'Michael T.',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
      rating: 5,
      text: 'Best marketplace for used premium goods. Everything I ordered exceeded my expectations.',
    },
  ]);

  constructor(private router: Router) {}

  onShopNowClick(): void {
    this.router.navigate(['/catalog']);
  }

  onProductClick(product: ProductCardData): void {
    this.router.navigate(['/product', product.id]);
  }

  onFavoriteToggle(event: { product: ProductCardData; isFavorite: boolean }): void {
    console.log('Favorite toggled:', event.product.name, event.isFavorite);
  }

  getStarArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }
}
