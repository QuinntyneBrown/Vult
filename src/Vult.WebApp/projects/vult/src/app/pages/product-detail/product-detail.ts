// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BehaviorSubject, combineLatest, map, switchMap } from 'rxjs';
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
import { Product, Gender } from '../../core/models';

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

interface ProductDetailViewModel {
  product: ProductDetailData;
  selectedColorId: string;
  selectedColorName: string;
  selectedSizeIds: string[];
  selectedImageIndex: number;
  isFavorited: boolean;
  isFavoriteLoading: boolean;
  addToBagState: AddToBagButtonState;
  addToBagError: string;
  isAddToBagDisabled: boolean;
  expandedAccordionIds: string[];
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
export class ProductDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);

  // UI state subjects
  private selectedColorId$ = new BehaviorSubject<string>('color-1');
  private selectedSizeIds$ = new BehaviorSubject<string[]>([]);
  private selectedImageIndex$ = new BehaviorSubject<number>(0);
  private isFavorited$ = new BehaviorSubject<boolean>(false);
  private isFavoriteLoading$ = new BehaviorSubject<boolean>(false);
  private addToBagState$ = new BehaviorSubject<AddToBagButtonState>('default');
  private addToBagError$ = new BehaviorSubject<string>('');
  private expandedAccordionIds$ = new BehaviorSubject<string[]>(['description']);

  // Product data observable from route params
  private product$ = this.route.paramMap.pipe(
    map(params => params.get('id') || ''),
    switchMap(id => this.productService.getProductById(id)),
    map(product => {
      return this.mapProductToDetailData(product);
    })
  );

  // Combined view model for template consumption
  viewModel$ = combineLatest([
    this.product$,
    this.selectedColorId$,
    this.selectedSizeIds$,
    this.selectedImageIndex$,
    this.isFavorited$,
    this.isFavoriteLoading$,
    this.addToBagState$,
    this.addToBagError$,
    this.expandedAccordionIds$
  ]).pipe(
    map(([product, selectedColorId, selectedSizeIds, selectedImageIndex, isFavorited, isFavoriteLoading, addToBagState, addToBagError, expandedAccordionIds]): ProductDetailViewModel => {
      const selectedColor = product.colors.find(c => c.id === selectedColorId);
      return {
        product,
        selectedColorId,
        selectedColorName: selectedColor?.name || '',
        selectedSizeIds,
        selectedImageIndex,
        isFavorited,
        isFavoriteLoading,
        addToBagState,
        addToBagError,
        isAddToBagDisabled: selectedSizeIds.length === 0,
        expandedAccordionIds
      };
    })
  );

  private mapProductToDetailData(product: Product): ProductDetailData {

      const genderLabel = this.getGenderLabel(product.gender);
      const sizes = this.parseSizes(product.size);

      console.log((product as any).product);
      var model = {
        id: product.productId,
        title: product.name || 'Unknown Product',
        subtitle: genderLabel,
        price: {
          current: product.estimatedMSRP || 0,
          original: product.estimatedResaleValue,
          currency: 'USD',
          currencySymbol: '$',
          salePercentage: product.estimatedResaleValue && product.estimatedMSRP
            ? Math.round((1 - product.estimatedMSRP / product.estimatedResaleValue) * 100)
            : undefined
        },
        images: (product.productImages || []).map((img, index) => ({
          id: img.productImageId,
          url: img.url || '',
          altText: img.description || `Product image ${index + 1}`
        })),
        colors: [
          { id: 'color-1', name: 'Default', color: '#222222', imageUrl: product.productImages?.[0]?.url }
        ],
        sizes: sizes,
        accordionSections: [
          {
            id: 'description',
            title: 'Product Description',
            content: `<p>${product.description || 'No description available.'}</p>`,
            isExpanded: true
          }
        ]
      };

      return model;

  }

  private getGenderLabel(gender?: Gender): string {
    switch (gender) {
      case Gender.Mens: return "Men's";
      case Gender.Womens: return "Women's";
      case Gender.Unisex: return "Unisex";
      default: return '';
    }
  }

  private parseSizes(sizeString?: string): SizeOption[] {
    if (!sizeString) return [];
    return sizeString.split(',').map((size) => ({
      id: `size-${size.trim()}`,
      label: size.trim(),
      available: true
    }));
  }

  onColorSelect(color: ColorOption): void {
    this.selectedColorId$.next(color.id);
    this.selectedImageIndex$.next(0);
  }

  onSizeSelectionChange(sizeIds: string[]): void {
    this.selectedSizeIds$.next(sizeIds);
    if (sizeIds.length > 0) {
      this.addToBagError$.next('');
      if (this.addToBagState$.getValue() === 'error') {
        this.addToBagState$.next('default');
      }
    }
  }

  onImageChange(index: number): void {
    this.selectedImageIndex$.next(index);
  }

  onImageClick(image: ProductImage): void {
    console.log('Image clicked:', image);
  }

  onAddToBag(): void {
    if (this.selectedSizeIds$.getValue().length === 0) {
      this.addToBagError$.next('Please select a size');
      this.addToBagState$.next('error');
      return;
    }

    this.addToBagState$.next('loading');
    this.addToBagError$.next('');

    setTimeout(() => {
      this.addToBagState$.next('success');
      setTimeout(() => {
        this.addToBagState$.next('default');
      }, 2000);
    }, 1500);
  }

  onFavoriteToggle(isFavorited: boolean): void {
    this.isFavoriteLoading$.next(true);
    setTimeout(() => {
      this.isFavorited$.next(isFavorited);
      this.isFavoriteLoading$.next(false);
    }, 500);
  }

  onAccordionSectionToggle(event: { id: string; isExpanded: boolean }): void {
    // Accordion component handles its own state
  }

  onSizeGuideClick(): void {
    console.log('Size guide clicked');
  }
}
