// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute, Router } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Products } from './products';
import { FilterSection, SortOption, ProductCardData } from 'vult-components';

describe('Products', () => {
  let component: Products;
  let fixture: ComponentFixture<Products>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Products],
      providers: [
        provideRouter([]),
        provideAnimations(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: { params: {}, queryParams: {} }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Products);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default state', () => {
      expect(component.isLoading()).toBe(false);
      expect(component.isMobileFilterOpen()).toBe(false);
      expect(component.currentPage()).toBe(1);
      expect(component.selectedSortId()).toBe('featured');
    });

    it('should have products loaded', () => {
      expect(component.products().length).toBeGreaterThan(0);
    });

    it('should have filter sections configured', () => {
      expect(component.filterSections().length).toBeGreaterThan(0);
    });
  });

  describe('Page Structure', () => {
    it('should display products page', () => {
      const pageElement = fixture.debugElement.query(By.css('[data-testid="products-page"]'));
      expect(pageElement).toBeTruthy();
    });

    it('should display page header', () => {
      const headerElement = fixture.debugElement.query(By.css('[data-testid="page-header"]'));
      expect(headerElement).toBeTruthy();
    });

    it('should display product grid', () => {
      const gridElement = fixture.debugElement.query(By.css('[data-testid="product-grid"]'));
      expect(gridElement).toBeTruthy();
    });

    it('should display filter sidebar', () => {
      const sidebarElement = fixture.debugElement.query(By.css('[data-testid="filter-sidebar"]'));
      expect(sidebarElement).toBeTruthy();
    });

    it('should display sort dropdown', () => {
      const sortElement = fixture.debugElement.query(By.css('[data-testid="sort-dropdown"]'));
      expect(sortElement).toBeTruthy();
    });

    it('should display result counter', () => {
      const counterElement = fixture.debugElement.query(By.css('[data-testid="result-counter"]'));
      expect(counterElement).toBeTruthy();
    });

    it('should have main landmark', () => {
      const mainElement = fixture.debugElement.query(By.css('main'));
      expect(mainElement).toBeTruthy();
    });
  });

  describe('Sort Functionality', () => {
    it('should have all sort options configured', () => {
      expect(component.sortOptions.length).toBe(4);
      expect(component.sortOptions.map(o => o.id)).toContain('featured');
      expect(component.sortOptions.map(o => o.id)).toContain('newest');
      expect(component.sortOptions.map(o => o.id)).toContain('price-asc');
      expect(component.sortOptions.map(o => o.id)).toContain('price-desc');
    });

    it('should update selected sort when onSortChange is called', () => {
      const newSort: SortOption = { id: 'price-asc', label: 'Price: Low to High' };
      component.onSortChange(newSort);
      expect(component.selectedSortId()).toBe('price-asc');
    });

    it('should reset to page 1 when sort changes', () => {
      component.currentPage.set(3);
      const newSort: SortOption = { id: 'newest', label: 'Newest' };
      component.onSortChange(newSort);
      expect(component.currentPage()).toBe(1);
    });

    it('should sort products by price ascending', () => {
      component.onSortChange({ id: 'price-asc', label: 'Price: Low to High' });
      const products = component.filteredProducts();
      for (let i = 1; i < products.length; i++) {
        expect(products[i].price).toBeGreaterThanOrEqual(products[i - 1].price);
      }
    });

    it('should sort products by price descending', () => {
      component.onSortChange({ id: 'price-desc', label: 'Price: High to Low' });
      const products = component.filteredProducts();
      for (let i = 1; i < products.length; i++) {
        expect(products[i].price).toBeLessThanOrEqual(products[i - 1].price);
      }
    });
  });

  describe('Filter Functionality', () => {
    it('should have filter sections', () => {
      const sections = component.filterSections();
      expect(sections.length).toBe(4);
    });

    it('should have category filter section', () => {
      const sections = component.filterSections();
      const categorySection = sections.find(s => s.id === 'category');
      expect(categorySection).toBeTruthy();
      expect(categorySection?.options?.length).toBeGreaterThan(0);
    });

    it('should have gender filter section', () => {
      const sections = component.filterSections();
      const genderSection = sections.find(s => s.id === 'gender');
      expect(genderSection).toBeTruthy();
    });

    it('should have size filter section', () => {
      const sections = component.filterSections();
      const sizeSection = sections.find(s => s.id === 'size');
      expect(sizeSection).toBeTruthy();
    });

    it('should have price filter section', () => {
      const sections = component.filterSections();
      const priceSection = sections.find(s => s.id === 'price');
      expect(priceSection).toBeTruthy();
    });

    it('should update filter state when filter changes', () => {
      const section: FilterSection = {
        id: 'category',
        title: 'Category',
        type: 'checkbox',
        options: [{ id: 'shoes', label: 'Shoes', checked: false }]
      };
      const option = { id: 'shoes', label: 'Shoes', checked: false };

      component.onFilterChange({ section, option, checked: true });

      expect(component.filterState().categories).toContain('shoes');
    });

    it('should remove filter when unchecked', () => {
      // First add a filter
      const section: FilterSection = {
        id: 'category',
        title: 'Category',
        type: 'checkbox',
        options: [{ id: 'shoes', label: 'Shoes', checked: true }]
      };
      const option = { id: 'shoes', label: 'Shoes', checked: true };

      component.onFilterChange({ section, option, checked: true });
      expect(component.filterState().categories).toContain('shoes');

      // Then remove it
      component.onFilterChange({ section, option, checked: false });
      expect(component.filterState().categories).not.toContain('shoes');
    });

    it('should reset page to 1 when filter changes', () => {
      component.currentPage.set(3);

      const section: FilterSection = {
        id: 'category',
        title: 'Category',
        type: 'checkbox',
        options: [{ id: 'shoes', label: 'Shoes', checked: false }]
      };
      const option = { id: 'shoes', label: 'Shoes', checked: false };

      component.onFilterChange({ section, option, checked: true });

      expect(component.currentPage()).toBe(1);
    });

    it('should clear all filters when onClearFilters is called', () => {
      // Add some filters first
      const section: FilterSection = {
        id: 'category',
        title: 'Category',
        type: 'checkbox',
        options: [{ id: 'shoes', label: 'Shoes', checked: false }]
      };
      const option = { id: 'shoes', label: 'Shoes', checked: false };

      component.onFilterChange({ section, option, checked: true });
      expect(component.filterState().categories.length).toBeGreaterThan(0);

      // Clear all
      component.onClearFilters();

      expect(component.filterState().categories).toEqual([]);
      expect(component.filterState().sizes).toEqual([]);
      expect(component.filterState().colors).toEqual([]);
      expect(component.filterState().priceRanges).toEqual([]);
    });

    it('should compute active filter count correctly', () => {
      expect(component.activeFilterCount()).toBe(0);

      // Add category filter
      component.filterState.set({
        categories: ['shoes', 'clothing'],
        colors: [],
        sizes: ['m'],
        priceRanges: []
      });

      expect(component.activeFilterCount()).toBe(3);
    });
  });

  describe('Mobile Filter', () => {
    it('should display mobile filter toggle', () => {
      const toggleElement = fixture.debugElement.query(By.css('[data-testid="mobile-filter-toggle"]'));
      expect(toggleElement).toBeTruthy();
    });

    it('should toggle mobile filter state', () => {
      expect(component.isMobileFilterOpen()).toBe(false);

      component.onMobileFilterToggle(true);
      expect(component.isMobileFilterOpen()).toBe(true);

      component.onMobileFilterToggle(false);
      expect(component.isMobileFilterOpen()).toBe(false);
    });

    it('should close mobile filter', () => {
      component.isMobileFilterOpen.set(true);
      component.onCloseMobileFilter();
      expect(component.isMobileFilterOpen()).toBe(false);
    });

    it('should show overlay when mobile filter is open', () => {
      component.isMobileFilterOpen.set(true);
      fixture.detectChanges();

      const overlayElement = fixture.debugElement.query(By.css('[data-testid="filter-overlay"]'));
      expect(overlayElement).toBeTruthy();
    });

    it('should not show overlay when mobile filter is closed', () => {
      component.isMobileFilterOpen.set(false);
      fixture.detectChanges();

      const overlayElement = fixture.debugElement.query(By.css('[data-testid="filter-overlay"]'));
      expect(overlayElement).toBeFalsy();
    });
  });

  describe('Pagination', () => {
    it('should compute total pages correctly', () => {
      const totalProducts = component.totalProducts();
      const expectedPages = Math.ceil(totalProducts / component.itemsPerPage);
      expect(component.totalPages()).toBe(expectedPages);
    });

    it('should update current page when onPageChange is called', () => {
      component.onPageChange(2);
      expect(component.currentPage()).toBe(2);
    });

    it('should paginate products correctly', () => {
      const paginatedProducts = component.paginatedProducts();
      expect(paginatedProducts.length).toBeLessThanOrEqual(component.itemsPerPage);
    });

    it('should show different products on different pages', () => {
      const page1Products = component.paginatedProducts();
      const firstProductPage1 = page1Products[0];

      // Go to page 2 if there are enough products
      if (component.totalPages() > 1) {
        component.onPageChange(2);
        const page2Products = component.paginatedProducts();
        expect(page2Products[0]).not.toEqual(firstProductPage1);
      }
    });
  });

  describe('Product Grid', () => {
    it('should have products', () => {
      expect(component.products().length).toBeGreaterThan(0);
    });

    it('should have correct product structure', () => {
      const products = component.products();
      products.forEach(product => {
        expect(product.id).toBeDefined();
        expect(product.name).toBeDefined();
        expect(product.price).toBeDefined();
        expect(product.imageUrl).toBeDefined();
      });
    });

    it('should have products with categories', () => {
      const products = component.products();
      const productsWithCategory = products.filter(p => p.category);
      expect(productsWithCategory.length).toBeGreaterThan(0);
    });

    it('should have some products with badges', () => {
      const products = component.products();
      const productsWithBadge = products.filter(p => p.badge);
      expect(productsWithBadge.length).toBeGreaterThan(0);
    });

    it('should have some products with sale prices', () => {
      const products = component.products();
      const productsWithSale = products.filter(p => p.originalPrice);
      expect(productsWithSale.length).toBeGreaterThan(0);
    });
  });

  describe('Product Click Navigation', () => {
    it('should navigate to product detail on product click', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      const product: ProductCardData = {
        id: 'test-product',
        name: 'Test Product',
        price: 100,
        imageUrl: 'test.jpg'
      };

      component.onProductClick(product);

      expect(navigateSpy).toHaveBeenCalledWith(['/product', 'test-product']);
    });
  });

  describe('Favorite Toggle', () => {
    it('should handle favorite toggle', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const product: ProductCardData = {
        id: 'test-product',
        name: 'Test Product',
        price: 100,
        imageUrl: 'test.jpg'
      };

      component.onFavoriteToggle({ product, isFavorite: true });

      expect(consoleSpy).toHaveBeenCalledWith('Favorite toggled:', 'test-product', true);
      consoleSpy.mockRestore();
    });
  });

  describe('Loading State', () => {
    it('should not show loading state by default', () => {
      expect(component.isLoading()).toBe(false);
    });

    it('should pass loading state to product grid', () => {
      component.isLoading.set(true);
      fixture.detectChanges();

      const gridElement = fixture.debugElement.query(By.css('[data-testid="product-grid"]'));
      expect(gridElement.componentInstance.loading).toBe(true);
    });
  });

  describe('Computed Properties', () => {
    it('should compute total products correctly', () => {
      const products = component.products();
      expect(component.totalProducts()).toBe(products.length);
    });

    it('should compute filtered products', () => {
      const filteredProducts = component.filteredProducts();
      expect(Array.isArray(filteredProducts)).toBe(true);
    });

    it('should compute paginated products', () => {
      const paginatedProducts = component.paginatedProducts();
      expect(Array.isArray(paginatedProducts)).toBe(true);
      expect(paginatedProducts.length).toBeLessThanOrEqual(component.itemsPerPage);
    });
  });

  describe('Accessibility', () => {
    it('should have main landmark', () => {
      const mainElement = fixture.debugElement.query(By.css('main'));
      expect(mainElement).toBeTruthy();
    });

    it('should have products section with aria-label', () => {
      const section = fixture.debugElement.query(By.css('section[aria-label="Products"]'));
      expect(section).toBeTruthy();
    });

    it('should have filter sidebar with id for aria-controls', () => {
      const sidebar = fixture.debugElement.query(By.css('#filter-sidebar'));
      expect(sidebar).toBeTruthy();
    });
  });
});
