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
  TypographyDisplay,
} from 'vult-components';
import { TestimonialService, ProductService } from '../../core/services';
import { Testimonial as TestimonialModel, Product, ItemType } from '../../core/models';

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
    CommonModule,
    HeroSection,
    ProductCard,
    TypographyDisplay,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private _testimonialService = inject(TestimonialService);
  private _productService = inject(ProductService);
  private _router = inject(Router);

  heroImage = 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=1920&q=80';
  heroTitle = 'Buy Premium Used Products';
  heroOverlay = 'linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0) 100%)';

  featuredProducts$ = this._productService.getFeaturedProducts(1, 10).pipe(
    map(response => response.items.map(this.mapToProductCard))
  );

  testimonials$ = this._testimonialService.getTestimonials(1, 10, { sortBy: 'rating_desc' }).pipe(
    map(response => response.items.map(this.mapToTestimonial))
  );

  private mapToTestimonial(model: TestimonialModel): Testimonial {
    return {
      id: model.testimonialId,
      customerName: model.customerName,
      photoUrl: model.photoUrl,
      rating: model.rating,
      text: model.text,
    };
  }

  private mapToProductCard(product: Product): ProductCardData {
    const itemTypeCategories: Record<ItemType, string> = {
      [ItemType.Shoe]: 'Footwear',
      [ItemType.Pants]: 'Bottoms',
      [ItemType.Jacket]: 'Outerwear',
      [ItemType.Shirt]: 'Tops',
      [ItemType.Shorts]: 'Bottoms',
      [ItemType.Dress]: 'Dresses',
      [ItemType.Skirt]: 'Bottoms',
      [ItemType.Sweater]: 'Tops',
      [ItemType.Hoodie]: 'Tops',
      [ItemType.Coat]: 'Outerwear',
    };

    const imageUrl = product.productImages && product.productImages.length > 0 && product.productImages[0].imageData
      ? `data:image/jpeg;base64,${product.productImages[0].imageData}`
      : 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80';

    return {
      id: product.productId,
      name: product.description || 'Product',
      category: product.itemType !== undefined ? itemTypeCategories[product.itemType] : 'General',
      price: product.estimatedResaleValue || product.estimatedMSRP || 0,
      originalPrice: product.estimatedResaleValue && product.estimatedMSRP && product.estimatedMSRP > product.estimatedResaleValue
        ? product.estimatedMSRP
        : undefined,
      imageUrl,
      badge: product.estimatedResaleValue && product.estimatedMSRP && product.estimatedMSRP > product.estimatedResaleValue
        ? 'Sale'
        : undefined,
      badgeType: product.estimatedResaleValue && product.estimatedMSRP && product.estimatedMSRP > product.estimatedResaleValue
        ? 'sale'
        : undefined,
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

  getStarArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }
}
