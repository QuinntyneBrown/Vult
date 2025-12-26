// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ProductDetail } from './product-detail';
import { ColorOption, SizeOption, ProductImage } from 'vult-components';

describe('ProductDetail', () => {
  let component: ProductDetail;
  let fixture: ComponentFixture<ProductDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetail],
      providers: [
        provideRouter([]),
        provideAnimations(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'test-product-id' }),
            snapshot: { params: { id: 'test-product-id' } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default state', () => {
      expect(component.isLoading()).toBe(false);
      expect(component.selectedColorId()).toBe('color-1');
      expect(component.selectedSizeIds()).toEqual([]);
      expect(component.isFavorited()).toBe(false);
      expect(component.addToBagState()).toBe('default');
    });

    it('should have product data loaded', () => {
      const product = component.product();
      expect(product).toBeTruthy();
      expect(product.title).toBe('Nike Tech');
      expect(product.subtitle).toBe("Men's Dri-FIT Woven Color-Block Windrunner Loose Jacket");
    });
  });

  describe('Product Information Display', () => {
    it('should display product title', () => {
      const productInfoElement = fixture.debugElement.query(By.css('[data-testid="product-info"]'));
      expect(productInfoElement).toBeTruthy();
    });

    it('should display product images gallery', () => {
      const galleryElement = fixture.debugElement.query(By.css('[data-testid="product-image-gallery"]'));
      expect(galleryElement).toBeTruthy();
    });

    it('should have correct number of product images', () => {
      const product = component.product();
      expect(product.images.length).toBe(5);
    });

    it('should display price information correctly', () => {
      const product = component.product();
      expect(product.price.current).toBe(160);
      expect(product.price.original).toBe(200);
      expect(product.price.salePercentage).toBe(20);
    });
  });

  describe('Color Selection', () => {
    it('should display color selector', () => {
      const colorSelectorSection = fixture.debugElement.query(By.css('[data-testid="color-selector-section"]'));
      expect(colorSelectorSection).toBeTruthy();
    });

    it('should have correct number of color options', () => {
      const product = component.product();
      expect(product.colors.length).toBe(4);
    });

    it('should update selected color when onColorSelect is called', () => {
      const newColor: ColorOption = {
        id: 'color-2',
        name: 'Black/White',
        color: '#222222'
      };

      component.onColorSelect(newColor);
      expect(component.selectedColorId()).toBe('color-2');
    });

    it('should compute selected color name correctly', () => {
      expect(component.selectedColorName()).toBe('Smoke Grey/Black');

      const newColor: ColorOption = {
        id: 'color-3',
        name: 'Navy Blue',
        color: '#1a365d'
      };

      component.onColorSelect(newColor);
      expect(component.selectedColorName()).toBe('Navy Blue');
    });

    it('should reset image index when color changes', () => {
      component.selectedImageIndex.set(3);
      expect(component.selectedImageIndex()).toBe(3);

      const newColor: ColorOption = {
        id: 'color-2',
        name: 'Black/White',
        color: '#222222'
      };

      component.onColorSelect(newColor);
      expect(component.selectedImageIndex()).toBe(0);
    });
  });

  describe('Size Selection', () => {
    it('should display size selector', () => {
      const sizeSelectorSection = fixture.debugElement.query(By.css('[data-testid="size-selector-section"]'));
      expect(sizeSelectorSection).toBeTruthy();
    });

    it('should have correct number of size options', () => {
      const product = component.product();
      expect(product.sizes.length).toBe(7);
    });

    it('should have one unavailable size (3XL)', () => {
      const product = component.product();
      const unavailableSizes = product.sizes.filter(s => s.available === false);
      expect(unavailableSizes.length).toBe(1);
      expect(unavailableSizes[0].label).toBe('3XL');
    });

    it('should update selected size when onSizeSelectionChange is called', () => {
      component.onSizeSelectionChange(['size-m']);
      expect(component.selectedSizeIds()).toEqual(['size-m']);
    });

    it('should clear error when size is selected', () => {
      // Set an error first
      component.addToBagError.set('Please select a size');
      component.addToBagState.set('error');

      // Select a size
      component.onSizeSelectionChange(['size-l']);

      expect(component.addToBagError()).toBe('');
      expect(component.addToBagState()).toBe('default');
    });

    it('should display size guide link', () => {
      const sizeGuideLink = fixture.debugElement.query(By.css('[data-testid="size-guide-link"]'));
      expect(sizeGuideLink).toBeTruthy();
    });
  });

  describe('Add to Bag Functionality', () => {
    it('should display add to bag button', () => {
      const addToBagButton = fixture.debugElement.query(By.css('[data-testid="add-to-bag-button"]'));
      expect(addToBagButton).toBeTruthy();
    });

    it('should disable add to bag button when no size is selected', () => {
      expect(component.isAddToBagDisabled()).toBe(true);
    });

    it('should enable add to bag button when size is selected', () => {
      component.onSizeSelectionChange(['size-m']);
      expect(component.isAddToBagDisabled()).toBe(false);
    });

    it('should show error when adding to bag without size selected', () => {
      component.onAddToBag();
      expect(component.addToBagError()).toBe('Please select a size');
      expect(component.addToBagState()).toBe('error');
    });

    it('should set loading state when adding to bag with size selected', fakeAsync(() => {
      component.onSizeSelectionChange(['size-m']);
      component.onAddToBag();

      expect(component.addToBagState()).toBe('loading');
      expect(component.addToBagError()).toBe('');

      tick(1500);
      expect(component.addToBagState()).toBe('success');

      tick(2000);
      expect(component.addToBagState()).toBe('default');
    }));

    it('should transition through correct states on successful add', fakeAsync(() => {
      component.onSizeSelectionChange(['size-l']);
      component.onAddToBag();

      // Initially loading
      expect(component.addToBagState()).toBe('loading');

      // After API call completes
      tick(1500);
      expect(component.addToBagState()).toBe('success');

      // After success timeout
      tick(2000);
      expect(component.addToBagState()).toBe('default');
    }));
  });

  describe('Favorites Functionality', () => {
    it('should display favorites button', () => {
      const favoritesButton = fixture.debugElement.query(By.css('[data-testid="favorites-button"]'));
      expect(favoritesButton).toBeTruthy();
    });

    it('should initialize as not favorited', () => {
      expect(component.isFavorited()).toBe(false);
    });

    it('should toggle favorite state', fakeAsync(() => {
      component.onFavoriteToggle(true);

      expect(component.isFavoriteLoading()).toBe(true);

      tick(500);

      expect(component.isFavorited()).toBe(true);
      expect(component.isFavoriteLoading()).toBe(false);
    }));

    it('should unfavorite when already favorited', fakeAsync(() => {
      // First favorite
      component.onFavoriteToggle(true);
      tick(500);
      expect(component.isFavorited()).toBe(true);

      // Then unfavorite
      component.onFavoriteToggle(false);
      tick(500);
      expect(component.isFavorited()).toBe(false);
    }));
  });

  describe('Image Gallery', () => {
    it('should display image gallery', () => {
      const imageGallery = fixture.debugElement.query(By.css('[data-testid="product-image-gallery"]'));
      expect(imageGallery).toBeTruthy();
    });

    it('should update selected image index on image change', () => {
      component.onImageChange(2);
      expect(component.selectedImageIndex()).toBe(2);
    });

    it('should handle image click', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const testImage: ProductImage = {
        id: 'img-1',
        url: 'test-url.jpg',
        altText: 'Test image'
      };

      component.onImageClick(testImage);

      expect(consoleSpy).toHaveBeenCalledWith('Image clicked:', testImage);
      consoleSpy.mockRestore();
    });
  });

  describe('Accordion Sections', () => {
    it('should display accordion section', () => {
      const accordionSection = fixture.debugElement.query(By.css('[data-testid="accordion-section"]'));
      expect(accordionSection).toBeTruthy();
    });

    it('should have correct number of accordion sections', () => {
      const product = component.product();
      expect(product.accordionSections.length).toBe(4);
    });

    it('should have description section expanded by default', () => {
      expect(component.expandedAccordionIds()).toContain('description');
    });

    it('should have all required accordion sections', () => {
      const product = component.product();
      const sectionIds = product.accordionSections.map(s => s.id);

      expect(sectionIds).toContain('description');
      expect(sectionIds).toContain('benefits');
      expect(sectionIds).toContain('details');
      expect(sectionIds).toContain('shipping');
    });
  });

  describe('Loading State', () => {
    it('should not show loading state initially', () => {
      const loadingElement = fixture.debugElement.query(By.css('[data-testid="loading-state"]'));
      expect(loadingElement).toBeFalsy();
    });

    it('should show loading state when isLoading is true', () => {
      component.isLoading.set(true);
      fixture.detectChanges();

      const loadingElement = fixture.debugElement.query(By.css('[data-testid="loading-state"]'));
      expect(loadingElement).toBeTruthy();
    });

    it('should hide product container when loading', () => {
      component.isLoading.set(true);
      fixture.detectChanges();

      const productContainer = fixture.debugElement.query(By.css('[data-testid="product-container"]'));
      expect(productContainer).toBeFalsy();
    });

    it('should show product container when not loading', () => {
      component.isLoading.set(false);
      fixture.detectChanges();

      const productContainer = fixture.debugElement.query(By.css('[data-testid="product-container"]'));
      expect(productContainer).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have main landmark with appropriate role', () => {
      const mainElement = fixture.debugElement.query(By.css('main'));
      expect(mainElement).toBeTruthy();
    });

    it('should have aria-label on image gallery section', () => {
      const gallerySection = fixture.debugElement.query(By.css('section[aria-label="Product images"]'));
      expect(gallerySection).toBeTruthy();
    });

    it('should have aria-label on product info section', () => {
      const infoSection = fixture.debugElement.query(By.css('section[aria-label="Product information"]'));
      expect(infoSection).toBeTruthy();
    });
  });

  describe('Product Data Structure', () => {
    it('should have valid product ID', () => {
      const product = component.product();
      expect(product.id).toBe('IH8461-072');
    });

    it('should have correct currency information', () => {
      const product = component.product();
      expect(product.price.currency).toBe('USD');
      expect(product.price.currencySymbol).toBe('$');
    });

    it('should have valid color image URLs', () => {
      const product = component.product();
      product.colors.forEach(color => {
        expect(color.imageUrl).toBeDefined();
        expect(color.imageUrl).toContain('assets/images/');
      });
    });

    it('should have all sizes with availability defined', () => {
      const product = component.product();
      product.sizes.forEach(size => {
        expect(size.available).toBeDefined();
        expect(typeof size.available).toBe('boolean');
      });
    });
  });
});
