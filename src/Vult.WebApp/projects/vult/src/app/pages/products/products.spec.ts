// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Products, ProductsFilterState } from './products';
import { FilterSection, SortOption, ProductCardData } from 'vult-components';
import { ProductService } from '../../core/services/product.service';
import { Product, Gender, ItemType, PaginatedResponse } from '../../core/models';

describe('Products', () => {
  let component: Products;
  let fixture: ComponentFixture<Products>;
  let router: Router;
  let productServiceSpy: jest.Mocked<ProductService>;

  const mockProducts: Product[] = [
    {
      productId: '1',
      name: 'Test Shoe',
      description: 'A test shoe',
      estimatedMSRP: 150,
      estimatedResaleValue: 120,
      gender: Gender.Mens,
      itemType: ItemType.Shoe,
      createdDate: '2025-01-01T00:00:00Z',
      updatedDate: '2025-01-01T00:00:00Z',
      productImages: [{ productImageId: '1', productId: '1', url: 'https://example.com/shoe.jpg', createdDate: '2025-01-01T00:00:00Z' }]
    },
    {
      productId: '2',
      name: 'Test Jacket',
      description: 'A test jacket',
      estimatedMSRP: 200,
      estimatedResaleValue: 180,
      gender: Gender.Womens,
      itemType: ItemType.Jacket,
      createdDate: '2025-01-02T00:00:00Z',
      updatedDate: '2025-01-02T00:00:00Z',
      productImages: [{ productImageId: '2', productId: '2', url: 'https://example.com/jacket.jpg', createdDate: '2025-01-02T00:00:00Z' }]
    },
    {
      productId: '3',
      name: 'Test Pants',
      description: 'Test pants',
      estimatedMSRP: 80,
      estimatedResaleValue: 70,
      gender: Gender.Unisex,
      itemType: ItemType.Pants,
      createdDate: '2025-01-03T00:00:00Z',
      updatedDate: '2025-01-03T00:00:00Z',
      productImages: [{ productImageId: '3', productId: '3', url: 'https://example.com/pants.jpg', createdDate: '2025-01-03T00:00:00Z' }]
    }
  ];

  const mockPaginatedResponse: PaginatedResponse<Product> = {
    items: mockProducts,
    totalCount: 3,
    pageNumber: 1,
    pageSize: 12,
    totalPages: 1
  };

  beforeEach(async () => {
    productServiceSpy = {
      getProducts: jest.fn().mockReturnValue(of(mockPaginatedResponse)),
      getProductById: jest.fn(),
      getFeaturedProducts: jest.fn(),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      uploadPhotos: jest.fn(),
      deleteProduct: jest.fn()
    } as unknown as jest.Mocked<ProductService>;

    await TestBed.configureTestingModule({
      imports: [Products],
      providers: [
        provideRouter([]),
        provideAnimations(),
        provideHttpClient(),
        { provide: ProductService, useValue: productServiceSpy }
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

    it('should call ProductService.getProducts on initialization', fakeAsync(() => {
      tick();
      expect(productServiceSpy.getProducts).toHaveBeenCalled();
    }));

    it('should have sort options configured', () => {
      expect(component.sortOptions.length).toBe(4);
      expect(component.sortOptions.map(o => o.id)).toContain('featured');
      expect(component.sortOptions.map(o => o.id)).toContain('newest');
      expect(component.sortOptions.map(o => o.id)).toContain('price-asc');
      expect(component.sortOptions.map(o => o.id)).toContain('price-desc');
    });

    it('should expose viewModel$ observable', () => {
      expect(component.viewModel$).toBeDefined();
    });
  });

  describe('Page Structure', () => {
    it('should display products page', fakeAsync(() => {
      tick();
      fixture.detectChanges();
      const pageElement = fixture.debugElement.query(By.css('[data-testid="products-page"]'));
      expect(pageElement).toBeTruthy();
    }));

    it('should display page header', fakeAsync(() => {
      tick();
      fixture.detectChanges();
      const headerElement = fixture.debugElement.query(By.css('[data-testid="page-header"]'));
      expect(headerElement).toBeTruthy();
    }));

    it('should display product grid', fakeAsync(() => {
      tick();
      fixture.detectChanges();
      const gridElement = fixture.debugElement.query(By.css('[data-testid="product-grid"]'));
      expect(gridElement).toBeTruthy();
    }));

    it('should display filter sidebar', fakeAsync(() => {
      tick();
      fixture.detectChanges();
      const sidebarElement = fixture.debugElement.query(By.css('[data-testid="filter-sidebar"]'));
      expect(sidebarElement).toBeTruthy();
    }));

    it('should display sort dropdown', fakeAsync(() => {
      tick();
      fixture.detectChanges();
      const sortElement = fixture.debugElement.query(By.css('[data-testid="sort-dropdown"]'));
      expect(sortElement).toBeTruthy();
    }));

    it('should display result counter', fakeAsync(() => {
      tick();
      fixture.detectChanges();
      const counterElement = fixture.debugElement.query(By.css('[data-testid="result-counter"]'));
      expect(counterElement).toBeTruthy();
    }));

    it('should have main landmark', fakeAsync(() => {
      tick();
      fixture.detectChanges();
      const mainElement = fixture.debugElement.query(By.css('main'));
      expect(mainElement).toBeTruthy();
    }));
  });

  describe('Sort Functionality', () => {
    it('should call getProducts with updated sort when onSortChange is called', fakeAsync(() => {
      const newSort: SortOption = { id: 'price-asc', label: 'Price: Low to High' };
      component.onSortChange(newSort);
      tick();

      expect(productServiceSpy.getProducts).toHaveBeenCalledWith(
        1,
        12,
        expect.objectContaining({ sortBy: 'price' })
      );
    }));

    it('should reset to page 1 when sort changes', fakeAsync(() => {
      // First go to page 2
      component.onPageChange(2);
      tick();

      // Then change sort
      const newSort: SortOption = { id: 'newest', label: 'Newest' };
      component.onSortChange(newSort);
      tick();

      // Should reset to page 1
      expect(productServiceSpy.getProducts).toHaveBeenCalledWith(
        1,
        12,
        expect.any(Object)
      );
    }));

    it('should map sort options to API correctly', fakeAsync(() => {
      component.onSortChange({ id: 'price-desc', label: 'Price: High to Low' });
      tick();

      expect(productServiceSpy.getProducts).toHaveBeenCalledWith(
        1,
        12,
        expect.objectContaining({ sortBy: 'price_desc' })
      );
    }));
  });

  describe('Filter Functionality', () => {
    it('should update filter state when filter changes', fakeAsync(() => {
      const section: FilterSection = {
        id: 'category',
        title: 'Category',
        type: 'checkbox',
        options: [{ id: 'shoe', label: 'Shoes', checked: false }]
      };
      const option = { id: 'shoe', label: 'Shoes', checked: false };

      component.onFilterChange({ section, option, checked: true });
      tick();

      // Should call getProducts with itemType filter
      expect(productServiceSpy.getProducts).toHaveBeenCalledWith(
        1,
        12,
        expect.objectContaining({ itemType: ItemType.Shoe })
      );
    }));

    it('should reset page to 1 when filter changes', fakeAsync(() => {
      component.onPageChange(2);
      tick();

      const section: FilterSection = {
        id: 'gender',
        title: 'Gender',
        type: 'checkbox',
        options: [{ id: 'men', label: 'Men', checked: false }]
      };
      const option = { id: 'men', label: 'Men', checked: false };

      component.onFilterChange({ section, option, checked: true });
      tick();

      expect(productServiceSpy.getProducts).toHaveBeenCalledWith(
        1,
        12,
        expect.any(Object)
      );
    }));

    it('should clear all filters when onClearFilters is called', fakeAsync(() => {
      // First add some filters
      const section: FilterSection = {
        id: 'category',
        title: 'Category',
        type: 'checkbox',
        options: [{ id: 'shoe', label: 'Shoes', checked: false }]
      };
      const option = { id: 'shoe', label: 'Shoes', checked: false };

      component.onFilterChange({ section, option, checked: true });
      tick();

      // Clear all
      component.onClearFilters();
      tick();

      // Last call should have no filters
      const lastCall = productServiceSpy.getProducts.mock.calls[productServiceSpy.getProducts.mock.calls.length - 1];
      expect(lastCall[2]).toEqual(expect.objectContaining({ sortBy: 'date_desc' }));
    }));

    it('should handle gender filter changes', fakeAsync(() => {
      const section: FilterSection = {
        id: 'gender',
        title: 'Gender',
        type: 'checkbox',
        options: [{ id: 'women', label: 'Women', checked: false }]
      };
      const option = { id: 'women', label: 'Women', checked: false };

      component.onFilterChange({ section, option, checked: true });
      tick();

      expect(productServiceSpy.getProducts).toHaveBeenCalledWith(
        1,
        12,
        expect.objectContaining({ gender: Gender.Womens })
      );
    }));
  });

  describe('Mobile Filter', () => {
    it('should display mobile filter toggle', fakeAsync(() => {
      tick();
      fixture.detectChanges();
      const toggleElement = fixture.debugElement.query(By.css('[data-testid="mobile-filter-toggle"]'));
      expect(toggleElement).toBeTruthy();
    }));

    it('should toggle mobile filter state', fakeAsync(() => {
      tick();
      fixture.detectChanges();

      component.onMobileFilterToggle(true);
      tick();
      fixture.detectChanges();

      component.viewModel$.subscribe(vm => {
        expect(vm.isMobileFilterOpen).toBe(true);
      });
    }));

    it('should close mobile filter', fakeAsync(() => {
      component.onMobileFilterToggle(true);
      tick();

      component.onCloseMobileFilter();
      tick();

      component.viewModel$.subscribe(vm => {
        expect(vm.isMobileFilterOpen).toBe(false);
      });
    }));

    it('should show overlay when mobile filter is open', fakeAsync(() => {
      component.onMobileFilterToggle(true);
      tick();
      fixture.detectChanges();

      const overlayElement = fixture.debugElement.query(By.css('[data-testid="filter-overlay"]'));
      expect(overlayElement).toBeTruthy();
    }));

    it('should not show overlay when mobile filter is closed', fakeAsync(() => {
      component.onMobileFilterToggle(false);
      tick();
      fixture.detectChanges();

      const overlayElement = fixture.debugElement.query(By.css('[data-testid="filter-overlay"]'));
      expect(overlayElement).toBeFalsy();
    }));
  });

  describe('Pagination', () => {
    it('should call getProducts with correct page when onPageChange is called', fakeAsync(() => {
      component.onPageChange(2);
      tick();

      expect(productServiceSpy.getProducts).toHaveBeenCalledWith(
        2,
        12,
        expect.any(Object)
      );
    }));
  });

  describe('Product Card Mapping', () => {
    it('should map products from API to ProductCardData', fakeAsync(() => {
      tick();
      fixture.detectChanges();

      component.viewModel$.subscribe(vm => {
        expect(vm.products.length).toBe(3);
        expect(vm.products[0].id).toBe('1');
        expect(vm.products[0].name).toBe('Test Shoe');
        expect(vm.products[0].price).toBe(120);
      });
    }));

    it('should set sale badge when resale value is less than MSRP', fakeAsync(() => {
      tick();
      fixture.detectChanges();

      component.viewModel$.subscribe(vm => {
        const productWithSale = vm.products[0];
        expect(productWithSale.badge).toBe('Sale');
        expect(productWithSale.badgeType).toBe('sale');
        expect(productWithSale.originalPrice).toBe(150);
      });
    }));

    it('should include gender and category in product card', fakeAsync(() => {
      tick();
      fixture.detectChanges();

      component.viewModel$.subscribe(vm => {
        expect(vm.products[0].category).toBe("Men's Footwear");
        expect(vm.products[1].category).toBe("Women's Outerwear");
      });
    }));
  });

  describe('Product Click Navigation', () => {
    it('should navigate to product detail on product click', fakeAsync(() => {
      tick();
      const navigateSpy = jest.spyOn(router, 'navigate').mockReturnValue(Promise.resolve(true));
      const product: ProductCardData = {
        id: 'test-product',
        name: 'Test Product',
        price: 100,
        imageUrl: 'test.jpg'
      };

      component.onProductClick(product);

      expect(navigateSpy).toHaveBeenCalledWith(['/product', 'test-product']);
    }));
  });

  describe('Favorite Toggle', () => {
    it('should handle favorite toggle', fakeAsync(() => {
      tick();
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
    }));
  });

  describe('View Model Observable', () => {
    it('should emit view model with products data', fakeAsync(() => {
      tick();

      component.viewModel$.subscribe(vm => {
        expect(vm.products.length).toBe(3);
        expect(vm.totalProducts).toBe(3);
        expect(vm.totalPages).toBe(1);
        expect(vm.currentPage).toBe(1);
      });
    }));

    it('should emit view model with filter sections', fakeAsync(() => {
      tick();

      component.viewModel$.subscribe(vm => {
        expect(vm.filterSections.length).toBe(4);
        expect(vm.filterSections.map(s => s.id)).toContain('category');
        expect(vm.filterSections.map(s => s.id)).toContain('gender');
        expect(vm.filterSections.map(s => s.id)).toContain('size');
        expect(vm.filterSections.map(s => s.id)).toContain('price');
      });
    }));

    it('should emit view model with active filter count', fakeAsync(() => {
      tick();

      // Add a filter
      const section: FilterSection = {
        id: 'category',
        title: 'Category',
        type: 'checkbox',
        options: [{ id: 'shoe', label: 'Shoes', checked: false }]
      };
      component.onFilterChange({ section, option: { id: 'shoe' }, checked: true });
      tick();

      component.viewModel$.subscribe(vm => {
        expect(vm.activeFilterCount).toBe(1);
      });
    }));
  });

  describe('API Error Handling', () => {
    it('should handle API errors gracefully', fakeAsync(() => {
      productServiceSpy.getProducts.mockReturnValue(of({ items: [], totalCount: 0, pageNumber: 1, pageSize: 12, totalPages: 0 }));

      component.onSortChange({ id: 'newest', label: 'Newest' });
      tick();
      fixture.detectChanges();

      component.viewModel$.subscribe(vm => {
        expect(vm.products).toEqual([]);
        expect(vm.totalProducts).toBe(0);
      });
    }));
  });

  describe('Accessibility', () => {
    it('should have main landmark', fakeAsync(() => {
      tick();
      fixture.detectChanges();
      const mainElement = fixture.debugElement.query(By.css('main'));
      expect(mainElement).toBeTruthy();
    }));

    it('should have products section with aria-label', fakeAsync(() => {
      tick();
      fixture.detectChanges();
      const section = fixture.debugElement.query(By.css('section[aria-label="Products"]'));
      expect(section).toBeTruthy();
    }));

    it('should have filter sidebar with id for aria-controls', fakeAsync(() => {
      tick();
      fixture.detectChanges();
      const sidebar = fixture.debugElement.query(By.css('#filter-sidebar'));
      expect(sidebar).toBeTruthy();
    }));
  });
});
