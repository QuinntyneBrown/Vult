// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import {
  PageHeaderComponent,
  ProductGridComponent,
  ProductCardData,
  FilterSidebarComponent,
  FilterSection,
  SortDropdownComponent,
  SortOption,
  MobileFilterToggleComponent,
  PaginationComponent,
  ResultCounterComponent
} from 'vult-components';

export type ProductsSortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc';

export interface ProductsFilterState {
  categories: string[];
  colors: string[];
  sizes: string[];
  priceRanges: string[];
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PageHeaderComponent,
    ProductGridComponent,
    FilterSidebarComponent,
    SortDropdownComponent,
    MobileFilterToggleComponent,
    PaginationComponent,
    ResultCounterComponent
  ],
  templateUrl: './products.html',
  styleUrls: ['./products.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Products {
  // State signals
  isLoading = signal(false);
  isMobileFilterOpen = signal(false);
  currentPage = signal(1);
  selectedSortId = signal<string>('featured');

  // Filter state
  filterState = signal<ProductsFilterState>({
    categories: [],
    colors: [],
    sizes: [],
    priceRanges: []
  });

  // Sort options
  sortOptions: SortOption[] = [
    { id: 'featured', label: 'Featured' },
    { id: 'newest', label: 'Newest' },
    { id: 'price-asc', label: 'Price: Low to High' },
    { id: 'price-desc', label: 'Price: High to Low' }
  ];

  // Filter sections configuration
  filterSections = signal<FilterSection[]>([
    {
      id: 'category',
      title: 'Category',
      type: 'checkbox',
      expanded: true,
      options: [
        { id: 'shoes', label: 'Shoes', count: 124, checked: false },
        { id: 'clothing', label: 'Clothing', count: 89, checked: false },
        { id: 'accessories', label: 'Accessories', count: 35, checked: false },
        { id: 'equipment', label: 'Equipment', count: 12, checked: false }
      ]
    },
    {
      id: 'gender',
      title: 'Gender',
      type: 'checkbox',
      expanded: true,
      options: [
        { id: 'men', label: 'Men', count: 248, checked: true },
        { id: 'women', label: 'Women', count: 0, checked: false },
        { id: 'unisex', label: 'Unisex', count: 42, checked: false }
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
        { id: 'price-0-50', label: '$0 - $50', count: 45, checked: false },
        { id: 'price-50-100', label: '$50 - $100', count: 89, checked: false },
        { id: 'price-100-150', label: '$100 - $150', count: 72, checked: false },
        { id: 'price-150-plus', label: 'Over $150', count: 42, checked: false }
      ]
    }
  ]);

  // Mock product data
  products = signal<ProductCardData[]>([
    {
      id: 'nike-air-max-90',
      name: 'Nike Air Max 90',
      category: "Men's Shoes",
      colorCount: 3,
      price: 130,
      imageUrl: 'assets/images/product-1.jpg',
      badge: 'New',
      badgeType: 'new'
    },
    {
      id: 'nike-dri-fit-primary',
      name: 'Nike Dri-FIT Primary',
      category: "Men's Training T-Shirt",
      colorCount: 5,
      price: 40,
      imageUrl: 'assets/images/product-2.jpg',
      badge: 'Best Seller',
      badgeType: 'sale'
    },
    {
      id: 'nike-pegasus-41',
      name: 'Nike Pegasus 41',
      category: "Men's Road Running Shoes",
      colorCount: 8,
      price: 140,
      imageUrl: 'assets/images/product-3.jpg'
    },
    {
      id: 'nike-windrunner',
      name: 'Nike Windrunner',
      category: "Men's Running Jacket",
      colorCount: 4,
      price: 89,
      originalPrice: 120,
      imageUrl: 'assets/images/product-4.jpg',
      badge: 'New',
      badgeType: 'new'
    },
    {
      id: 'nike-air-force-1-07',
      name: "Nike Air Force 1 '07",
      category: "Men's Shoes",
      colorCount: 2,
      price: 115,
      imageUrl: 'assets/images/product-5.jpg'
    },
    {
      id: 'nike-challenger',
      name: 'Nike Challenger',
      category: "Men's Running Shorts",
      colorCount: 6,
      price: 45,
      imageUrl: 'assets/images/product-6.jpg'
    },
    {
      id: 'nike-dunk-low-retro',
      name: 'Nike Dunk Low Retro',
      category: "Men's Shoes",
      colorCount: 12,
      price: 115,
      imageUrl: 'assets/images/product-7.jpg',
      badge: 'New',
      badgeType: 'new'
    },
    {
      id: 'nike-brasilia-95',
      name: 'Nike Brasilia 9.5',
      category: 'Training Backpack (Large)',
      colorCount: 3,
      price: 50,
      imageUrl: 'assets/images/product-8.jpg'
    }
  ]);

  // Computed properties
  totalProducts = computed(() => this.products().length);
  itemsPerPage = 8;
  totalPages = computed(() => Math.ceil(this.totalProducts() / this.itemsPerPage));

  activeFilterCount = computed(() => {
    const state = this.filterState();
    return state.categories.length + state.colors.length + state.sizes.length + state.priceRanges.length;
  });

  filteredProducts = computed(() => {
    const state = this.filterState();
    let result = this.products();

    // Apply filters (simplified - in a real app this would filter based on actual product properties)
    if (state.categories.length > 0 || state.sizes.length > 0 || state.priceRanges.length > 0) {
      // Filter logic would go here
    }

    // Apply sorting
    const sortId = this.selectedSortId();
    result = [...result].sort((a, b) => {
      switch (sortId) {
        case 'newest':
          return 0; // Would sort by date in real implementation
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return 0; // Featured - default order
      }
    });

    return result;
  });

  paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredProducts().slice(start, end);
  });

  constructor(private router: Router, private route: ActivatedRoute) {}

  onSortChange(option: SortOption): void {
    this.selectedSortId.set(option.id);
    this.currentPage.set(1);
  }

  onFilterChange(event: { section: FilterSection; option: any; checked: boolean }): void {
    const state = this.filterState();
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

    this.filterState.set(updatedState);
    this.currentPage.set(1);

    // Update filter section options
    const sections = this.filterSections();
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
    this.filterSections.set(updatedSections);
  }

  onClearFilters(): void {
    this.filterState.set({
      categories: [],
      colors: [],
      sizes: [],
      priceRanges: []
    });

    // Reset all filter options
    const sections = this.filterSections();
    const resetSections = sections.map(section => ({
      ...section,
      options: section.options?.map(opt => ({ ...opt, checked: false }))
    }));
    this.filterSections.set(resetSections);
    this.currentPage.set(1);
  }

  onMobileFilterToggle(isOpen: boolean): void {
    this.isMobileFilterOpen.set(isOpen);
  }

  onCloseMobileFilter(): void {
    this.isMobileFilterOpen.set(false);
  }

  onProductClick(product: ProductCardData): void {
    this.router.navigate(['/product', product.id]);
  }

  onFavoriteToggle(event: { product: ProductCardData; isFavorite: boolean }): void {
    // In a real app, this would call a service to update favorites
    console.log('Favorite toggled:', event.product.id, event.isFavorite);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    // Scroll to top of grid (safely handle test environment)
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
