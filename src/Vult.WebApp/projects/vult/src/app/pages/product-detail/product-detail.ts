// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  ProductImageGalleryComponent,
  ProductImage,
  ProductInfoSectionComponent,
  ProductPrice,
  ColorSwatchSelectorComponent,
  ColorOption,
  SizeSelectorComponent,
  SizeOption,
  AddToBagButtonComponent,
  AddToBagButtonState,
  FavoritesButtonComponent,
  ProductDetailsAccordionComponent,
  AccordionSection
} from 'vult-components';

export interface ProductDetailData {
  id: string;
  title: string;
  subtitle: string;
  price: ProductPrice;
  images: ProductImage[];
  colors: ColorOption[];
  sizes: SizeOption[];
  accordionSections: AccordionSection[];
  isMemberExclusive?: boolean;
  promotionalMessage?: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProductImageGalleryComponent,
    ProductInfoSectionComponent,
    ColorSwatchSelectorComponent,
    SizeSelectorComponent,
    AddToBagButtonComponent,
    FavoritesButtonComponent,
    ProductDetailsAccordionComponent
  ],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetail {
  private readonly route = inject(ActivatedRoute);

  // State signals
  isLoading = signal(false);
  selectedColorId = signal<string>('color-1');
  selectedSizeIds = signal<string[]>([]);
  isFavorited = signal(false);
  isFavoriteLoading = signal(false);
  addToBagState = signal<AddToBagButtonState>('default');
  addToBagError = signal('');
  selectedImageIndex = signal(0);
  expandedAccordionIds = signal<string[]>(['description']);

  // Computed properties
  selectedColorName = computed(() => {
    const color = this.product().colors.find(c => c.id === this.selectedColorId());
    return color?.name || '';
  });

  isAddToBagDisabled = computed(() => {
    return this.selectedSizeIds().length === 0;
  });

  // Mock product data - in a real app this would come from a service
  product = signal<ProductDetailData>({
    id: 'IH8461-072',
    title: 'Tech Windrunner',
    subtitle: "Men's Dri-FIT Woven Color-Block Loose Jacket",
    price: {
      current: 160,
      original: 200,
      currency: 'USD',
      currencySymbol: '$',
      salePercentage: 20
    },
    images: [
      { id: 'img-1', url: 'assets/images/product-front.jpg', altText: 'Front view', thumbnailUrl: 'assets/images/product-front-thumb.jpg' },
      { id: 'img-2', url: 'assets/images/product-back.jpg', altText: 'Back view', thumbnailUrl: 'assets/images/product-back-thumb.jpg' },
      { id: 'img-3', url: 'assets/images/product-side.jpg', altText: 'Side view', thumbnailUrl: 'assets/images/product-side-thumb.jpg' },
      { id: 'img-4', url: 'assets/images/product-detail.jpg', altText: 'Detail view', thumbnailUrl: 'assets/images/product-detail-thumb.jpg' },
      { id: 'img-5', url: 'assets/images/product-model.jpg', altText: 'Model view', thumbnailUrl: 'assets/images/product-model-thumb.jpg' }
    ],
    colors: [
      { id: 'color-1', name: 'Smoke Grey/Black', color: '#999999', imageUrl: 'assets/images/color-smoke-grey.jpg' },
      { id: 'color-2', name: 'Black/White', color: '#222222', imageUrl: 'assets/images/color-black-white.jpg' },
      { id: 'color-3', name: 'Navy Blue', color: '#1a365d', imageUrl: 'assets/images/color-navy.jpg' },
      { id: 'color-4', name: 'Olive Green', color: '#556b2f', imageUrl: 'assets/images/color-olive.jpg' }
    ],
    sizes: [
      { id: 'size-s', label: 'S', available: true },
      { id: 'size-m', label: 'M', available: true },
      { id: 'size-l', label: 'L', available: true },
      { id: 'size-xl', label: 'XL', available: true },
      { id: 'size-xxl', label: 'XXL', available: true },
      { id: 'size-3xl', label: '3XL', available: false },
      { id: 'size-4xl', label: '4XL', available: true }
    ],
    accordionSections: [
      {
        id: 'description',
        title: 'Product Description',
        content: `<p>The Tech Windrunner updates the iconic silhouette with lightweight, Dri-FIT woven fabric that helps keep you dry and comfortable. The color-block design adds visual interest, while the loose fit allows for easy layering.</p>
        <div class="product-meta">
          <p><strong>Shown:</strong> Smoke Grey/Black</p>
          <p><strong>Style:</strong> IH8461-072</p>
        </div>`,
        isExpanded: true
      },
      {
        id: 'benefits',
        title: 'Benefits',
        content: `<ul>
          <li>Dri-FIT technology moves sweat away from your skin for quicker evaporation, helping you stay dry and comfortable.</li>
          <li>Color-block design adds visual interest to your everyday style.</li>
          <li>Loose fit provides ample room for layering and unrestricted movement.</li>
          <li>Full-length zipper allows for easy on and off.</li>
          <li>Hood with adjustable drawcord for customizable coverage.</li>
        </ul>`
      },
      {
        id: 'details',
        title: 'Product Details',
        content: `<ul>
          <li>Body: 100% polyester</li>
          <li>Panel: 100% polyester</li>
          <li>Lining: 100% polyester</li>
          <li>Machine wash</li>
          <li>Imported</li>
        </ul>`
      },
      {
        id: 'shipping',
        title: 'Shipping & Returns',
        content: `<p><strong>Free Shipping</strong> on orders over $50. Delivery in 3-5 business days.</p>
        <p><strong>Free Returns</strong> within 60 days of purchase. Items must be unworn and in original condition with tags attached.</p>`
      }
    ],
    isMemberExclusive: false,
    promotionalMessage: ''
  });

  onColorSelect(color: ColorOption): void {
    this.selectedColorId.set(color.id);
    // In a real app, this would update product images based on selected color
    this.selectedImageIndex.set(0);
  }

  onSizeSelectionChange(sizeIds: string[]): void {
    this.selectedSizeIds.set(sizeIds);
    // Clear any previous error when size is selected
    if (sizeIds.length > 0) {
      this.addToBagError.set('');
      if (this.addToBagState() === 'error') {
        this.addToBagState.set('default');
      }
    }
  }

  onImageChange(index: number): void {
    this.selectedImageIndex.set(index);
  }

  onImageClick(image: ProductImage): void {
    // In a real app, this would open a lightbox/zoom modal
    console.log('Image clicked:', image);
  }

  onAddToBag(): void {
    if (this.selectedSizeIds().length === 0) {
      this.addToBagError.set('Please select a size');
      this.addToBagState.set('error');
      return;
    }

    this.addToBagState.set('loading');
    this.addToBagError.set('');

    // Simulate API call
    setTimeout(() => {
      this.addToBagState.set('success');

      // Reset to default after showing success
      setTimeout(() => {
        this.addToBagState.set('default');
      }, 2000);
    }, 1500);
  }

  onFavoriteToggle(isFavorited: boolean): void {
    this.isFavoriteLoading.set(true);

    // Simulate API call
    setTimeout(() => {
      this.isFavorited.set(isFavorited);
      this.isFavoriteLoading.set(false);
    }, 500);
  }

  onAccordionSectionToggle(event: { id: string; isExpanded: boolean }): void {
    // Accordion component handles its own state
  }

  onSizeGuideClick(): void {
    // In a real app, this would open a size guide modal
    console.log('Size guide clicked');
  }
}
