// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  ProductImageGallery,
  ProductImage,
  ProductInfoSection,
  ProductPrice,
  ColorSwatchSelector,
  ColorOption,
  SizeSelector,
  SizeOption,
  AddToBagButton,
  AddToBagButtonState,
  FavoritesButton,
  ProductDetailsAccordion,
  AccordionSection
} from 'vult-components';
import { ProductService } from '../../core/services/product.service';

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
    ProductImageGallery,
    ProductInfoSection,
    ColorSwatchSelector,
    SizeSelector,
    AddToBagButton,
    FavoritesButton,
    ProductDetailsAccordion
  ],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);

  // State signals
  isLoading = signal(true);
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

  // Product data loaded from service
  product = signal<ProductDetailData>({
    id: '',
    title: '',
    subtitle: '',
    price: {
      current: 0,
      currency: 'USD',
      currencySymbol: '$'
    },
    images: [],
    colors: [],
    sizes: [],
    accordionSections: []
  });

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    }
  }

  private loadProduct(id: string): void {
    this.isLoading.set(true);
    this.productService.getMockProductById(id).subscribe({
      next: (product) => {
        this.product.set(product);
        if (product.colors.length > 0) {
          this.selectedColorId.set(product.colors[0].id);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.isLoading.set(false);
      }
    });
  }

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
