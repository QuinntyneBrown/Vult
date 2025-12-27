// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject, combineLatest, map, switchMap, tap, catchError, of } from 'rxjs';
import {
  PageHeader,
  ProductGrid,
  ProductCardData,
  FilterSidebar,
  FilterSection,
  SortDropdown,
  SortOption,
  MobileFilterToggle,
  Pagination,
  ResultCounter
} from 'vult-components';
import { ProductService, ProductFilters } from '../../core/services/product.service';
import { Product, ItemType, Gender } from '../../core/models';

export type ProductsSortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc';

export interface ProductsFilterState {
  categories: string[];
  colors: string[];
  sizes: string[];
  priceRanges: string[];
  gender: number | null;
}

interface ProductsViewModel {
  products: ProductCardData[];
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  isMobileFilterOpen: boolean;
  selectedSortId: string;
  filterSections: FilterSection[];
  activeFilterCount: number;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PageHeader,
    ProductGrid,
    FilterSidebar,
    SortDropdown,
    MobileFilterToggle,
    Pagination,
    ResultCounter
  ],
  templateUrl: './products.html',
  styleUrls: ['./products.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Products {
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);

  readonly itemsPerPage = 12;

  // Sort options configuration
  readonly sortOptions: SortOption[] = [
    { id: 'featured', label: 'Featured' },
    { id: 'newest', label: 'Newest' },
    { id: 'price-asc', label: 'Price: Low to High' },
    { id: 'price-desc', label: 'Price: High to Low' }
  ];

  // UI state subjects
  private currentPage$ = new BehaviorSubject<number>(1);
  private selectedSortId$ = new BehaviorSubject<string>('featured');
  private isMobileFilterOpen$ = new BehaviorSubject<boolean>(false);
  private isLoading$ = new BehaviorSubject<boolean>(false);

  // Filter state
  private filterState$ = new BehaviorSubject<ProductsFilterState>({
    categories: [],
    colors: [],
    sizes: [],
    priceRanges: [],
    gender: null
  });

  // Filter sections configuration
  private filterSections$ = new BehaviorSubject<FilterSection[]>([
    {
      id: 'category',
      title: 'Category',
      type: 'checkbox',
      expanded: true,
      options: [
        { id: 'shoe', label: 'Shoes', count: 0, checked: false },
        { id: 'shirt', label: 'Shirts', count: 0, checked: false },
        { id: 'pants', label: 'Pants', count: 0, checked: false },
        { id: 'jacket', label: 'Jackets', count: 0, checked: false },
        { id: 'accessories', label: 'Accessories', count: 0, checked: false }
      ]
    },
    {
      id: 'gender',
      title: 'Gender',
      type: 'checkbox',
      expanded: true,
      options: [
        { id: 'men', label: 'Men', count: 0, checked: false },
        { id: 'women', label: 'Women', count: 0, checked: false },
        { id: 'unisex', label: 'Unisex', count: 0, checked: false }
      ]
    },
    {
      id: 'size',
      title: 'Size',
      type: 'size',
      expanded: true,
      options: [
        { id: 'xs', label: 'XS', checked: false },
        { id: 's', label: 'S', checked: false },
        { id: 'm', label: 'M', checked: false },
        { id: 'l', label: 'L', checked: false },
        { id: 'xl', label: 'XL', checked: false },
        { id: 'xxl', label: 'XXL', checked: false }
      ]
    },
    {
      id: 'price',
      title: 'Price',
      type: 'checkbox',
      expanded: true,
      options: [
        { id: 'price-0-50', label: '$0 - $50', count: 0, checked: false },
        { id: 'price-50-100', label: '$50 - $100', count: 0, checked: false },
        { id: 'price-100-150', label: '$100 - $150', count: 0, checked: false },
        { id: 'price-150-plus', label: 'Over $150', count: 0, checked: false }
      ]
    }
  ]);

  // Products data from API
  private productsData$ = combineLatest([
    this.currentPage$,
    this.selectedSortId$,
    this.filterState$
  ]).pipe(
    tap(() => this.isLoading$.next(true)),
    switchMap(([page, sortId, filterState]) => {
      const filters = this.buildFilters(filterState);
      const sortBy = this.mapSortIdToApiSort(sortId);

      return this.productService.getProducts(page, this.itemsPerPage, { ...filters, sortBy }).pipe(
        catchError(() => of({ items: [], totalCount: 0, pageNumber: 1, pageSize: this.itemsPerPage, totalPages: 0 }))
      );
    }),
    tap(() => this.isLoading$.next(false)),
    map(response => ({
      products: response.items.map(product => this.mapProductToCard(product)),
      totalProducts: response.totalCount,
      totalPages: Math.ceil(response.totalCount / this.itemsPerPage),
      currentPage: response.pageNumber
    }))
  );

  // Combined view model for template consumption
  viewModel$ = combineLatest([
    this.productsData$,
    this.isLoading$,
    this.isMobileFilterOpen$,
    this.selectedSortId$,
    this.filterSections$,
    this.filterState$
  ]).pipe(
    map(([productsData, isLoading, isMobileFilterOpen, selectedSortId, filterSections, filterState]): ProductsViewModel => ({
      products: productsData.products,
      totalProducts: productsData.totalProducts,
      totalPages: productsData.totalPages,
      currentPage: productsData.currentPage,
      isLoading,
      isMobileFilterOpen,
      selectedSortId,
      filterSections,
      activeFilterCount: this.calculateActiveFilterCount(filterState)
    }))
  );

  private buildFilters(filterState: ProductsFilterState): ProductFilters {
    const filters: ProductFilters = {};

    // Map category to itemType
    if (filterState.categories.length > 0) {
      const itemType = this.mapCategoryToItemType(filterState.categories[0]);
      if (itemType !== null) {
        filters.itemType = itemType;
      }
    }

    // Map gender filter
    if (filterState.gender !== null) {
      filters.gender = filterState.gender;
    }

    return filters;
  }

  private mapCategoryToItemType(category: string): number | null {
    const mapping: Record<string, ItemType> = {
      'shoe': ItemType.Shoe,
      'pants': ItemType.Pants,
      'jacket': ItemType.Jacket,
      'shirt': ItemType.Shirt,
      'shorts': ItemType.Shorts,
      'dress': ItemType.Dress,
      'skirt': ItemType.Skirt,
      'sweater': ItemType.Sweater,
      'hoodie': ItemType.Hoodie,
      'coat': ItemType.Coat,
      'bag': ItemType.Bag,
      'accessories': ItemType.Accessories,
      'hat': ItemType.Hat
    };
    return mapping[category] ?? null;
  }

  private mapGenderIdToEnum(genderId: string): number {
    const mapping: Record<string, Gender> = {
      'men': Gender.Mens,
      'women': Gender.Womens,
      'unisex': Gender.Unisex
    };
    return mapping[genderId] ?? Gender.Unisex;
  }

  private mapSortIdToApiSort(sortId: string): string {
    const mapping: Record<string, string> = {
      'featured': 'featured',
      'newest': 'date_desc',
      'price-asc': 'price',
      'price-desc': 'price_desc'
    };
    return mapping[sortId] || 'date_desc';
  }

  private mapProductToCard(product: Product): ProductCardData {
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
      [ItemType.Bag]: 'Bags',
      [ItemType.Accessories]: 'Accessories',
      [ItemType.Hat]: 'Accessories',
      [ItemType.Book]: 'Books'
    };

    const genderLabels: Record<Gender, string> = {
      [Gender.Mens]: "Men's",
      [Gender.Womens]: "Women's",
      [Gender.Unisex]: 'Unisex'
    };

    const imageUrl = product.productImages?.[0]?.url || 'assets/images/placeholder.jpg';
    const category = product.itemType !== undefined ? itemTypeCategories[product.itemType] : 'General';
    const genderLabel = product.gender !== undefined ? genderLabels[product.gender] : '';
    const fullCategory = genderLabel ? `${genderLabel} ${category}` : category;

    const hasSale = product.estimatedResaleValue &&
                    product.estimatedMSRP &&
                    product.estimatedResaleValue < product.estimatedMSRP;

    return {
      id: product.productId,
      name: product.name || product.description || 'Product',
      category: fullCategory,
      price: product.estimatedResaleValue || product.estimatedMSRP || 0,
      originalPrice: hasSale ? product.estimatedMSRP : undefined,
      imageUrl,
      badge: hasSale ? 'Sale' : undefined,
      badgeType: hasSale ? 'sale' : undefined
    };
  }

  private calculateActiveFilterCount(filterState: ProductsFilterState): number {
    return filterState.categories.length +
           filterState.colors.length +
           filterState.sizes.length +
           filterState.priceRanges.length +
           (filterState.gender !== null ? 1 : 0);
  }

  onSortChange(option: SortOption): void {
    this.selectedSortId$.next(option.id);
    this.currentPage$.next(1);
  }

  onFilterChange(event: { section: FilterSection; option: any; checked: boolean }): void {
    const state = this.filterState$.getValue();
    const sectionId = event.section.id;
    const optionId = event.option.id;

    let updatedState: ProductsFilterState;

    if (sectionId === 'category') {
      updatedState = {
        ...state,
        categories: event.checked
          ? [...state.categories, optionId]
          : state.categories.filter(id => id !== optionId)
      };
    } else if (sectionId === 'gender') {
      updatedState = {
        ...state,
        gender: event.checked ? this.mapGenderIdToEnum(optionId) : null
      };
    } else if (sectionId === 'size') {
      updatedState = {
        ...state,
        sizes: event.checked
          ? [...state.sizes, optionId]
          : state.sizes.filter(id => id !== optionId)
      };
    } else if (sectionId === 'price') {
      updatedState = {
        ...state,
        priceRanges: event.checked
          ? [...state.priceRanges, optionId]
          : state.priceRanges.filter(id => id !== optionId)
      };
    } else {
      updatedState = state;
    }

    this.filterState$.next(updatedState);
    this.currentPage$.next(1);

    // Update filter section options
    const sections = this.filterSections$.getValue();
    const updatedSections = sections.map(section => {
      if (section.id === sectionId && section.options) {
        return {
          ...section,
          options: section.options.map(opt =>
            opt.id === optionId ? { ...opt, checked: event.checked } : opt
          )
        };
      }
      return section;
    });
    this.filterSections$.next(updatedSections);
  }

  onClearFilters(): void {
    this.filterState$.next({
      categories: [],
      colors: [],
      sizes: [],
      priceRanges: [],
      gender: null
    });

    // Reset all filter options
    const sections = this.filterSections$.getValue();
    const resetSections = sections.map(section => ({
      ...section,
      options: section.options?.map(opt => ({ ...opt, checked: false }))
    }));
    this.filterSections$.next(resetSections);
    this.currentPage$.next(1);
  }

  onMobileFilterToggle(isOpen: boolean): void {
    this.isMobileFilterOpen$.next(isOpen);
    this.toggleBodyScroll(isOpen);
  }

  onCloseMobileFilter(): void {
    this.isMobileFilterOpen$.next(false);
    this.toggleBodyScroll(false);
  }

  private toggleBodyScroll(disable: boolean): void {
    if (typeof document !== 'undefined') {
      if (disable) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  onProductClick(product: ProductCardData): void {
    this.router.navigate(['/product', product.id]);
  }

  onFavoriteToggle(event: { product: ProductCardData; isFavorite: boolean }): void {
    console.log('Favorite toggled:', event.product.id, event.isFavorite);
  }

  onPageChange(page: number): void {
    this.currentPage$.next(page);
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
