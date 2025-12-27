// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { LocalStorageService } from './local-storage.service';
import { Product, Gender, ItemType } from '../models';

describe('CartService', () => {
  let service: CartService;
  let localStorageSpy: jest.Mocked<LocalStorageService>;

  const mockProduct: Product = {
    productId: 'prod-123',
    name: 'Test Shoe',
    estimatedMSRP: 150,
    estimatedResaleValue: 120,
    description: 'A test shoe',
    gender: Gender.Mens,
    itemType: ItemType.Shoe,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    productImages: [
      {
        productImageId: 'img-1',
        productId: 'prod-123',
        url: 'https://example.com/image.jpg',
        createdDate: new Date().toISOString()
      }
    ]
  };

  beforeEach(() => {
    const localStorageMock = {
      get: jest.fn().mockReturnValue(null),
      set: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: LocalStorageService, useValue: localStorageMock }
      ]
    });

    service = TestBed.inject(CartService);
    localStorageSpy = TestBed.inject(LocalStorageService) as jest.Mocked<LocalStorageService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should start with an empty cart', () => {
      expect(service.isEmpty()).toBe(true);
      expect(service.itemCount()).toBe(0);
      expect(service.subtotal()).toBe(0);
    });

    it('should load cart from localStorage if available', () => {
      const storedCart = {
        cart: {
          items: [{
            cartItemId: 'cart-1',
            productId: 'prod-123',
            name: 'Test Product',
            subtitle: "Men's Shoes",
            imageUrl: '',
            color: 'Black',
            colorId: 'black',
            size: '10',
            sizeId: '10',
            price: 100,
            quantity: 2,
            maxQuantity: 10,
            isLowStock: false,
            addedAt: new Date().toISOString()
          }],
          subtotal: 200,
          itemCount: 2,
          lastUpdated: new Date().toISOString()
        },
        expiresAt: new Date(Date.now() + 86400000).toISOString() // Tomorrow
      };

      localStorageSpy.get.mockReturnValue(storedCart);

      // Recreate service to trigger initialization
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          CartService,
          { provide: LocalStorageService, useValue: localStorageSpy }
        ]
      });

      const newService = TestBed.inject(CartService);
      expect(newService.itemCount()).toBe(2);
      expect(newService.subtotal()).toBe(200);
    });
  });

  describe('addItem', () => {
    it('should add a new item to the cart', () => {
      service.addItem(mockProduct, 'Black', 'black', '10', 'size-10', 1);

      expect(service.isEmpty()).toBe(false);
      expect(service.itemCount()).toBe(1);
      expect(service.subtotal()).toBe(150);
      expect(service.items().length).toBe(1);
      expect(service.items()[0].name).toBe('Test Shoe');
    });

    it('should update quantity when adding same item', () => {
      service.addItem(mockProduct, 'Black', 'black', '10', 'size-10', 1);
      service.addItem(mockProduct, 'Black', 'black', '10', 'size-10', 2);

      expect(service.items().length).toBe(1);
      expect(service.items()[0].quantity).toBe(3);
      expect(service.itemCount()).toBe(3);
      expect(service.subtotal()).toBe(450);
    });

    it('should add separate items for different colors', () => {
      service.addItem(mockProduct, 'Black', 'black', '10', 'size-10', 1);
      service.addItem(mockProduct, 'White', 'white', '10', 'size-10', 1);

      expect(service.items().length).toBe(2);
      expect(service.itemCount()).toBe(2);
    });

    it('should add separate items for different sizes', () => {
      service.addItem(mockProduct, 'Black', 'black', '10', 'size-10', 1);
      service.addItem(mockProduct, 'Black', 'black', '11', 'size-11', 1);

      expect(service.items().length).toBe(2);
      expect(service.itemCount()).toBe(2);
    });

    it('should not exceed max quantity', () => {
      service.addItem(mockProduct, 'Black', 'black', '10', 'size-10', 8);
      service.addItem(mockProduct, 'Black', 'black', '10', 'size-10', 5);

      expect(service.items()[0].quantity).toBe(10); // Max is 10
    });

    it('should save cart to localStorage after adding item', () => {
      service.addItem(mockProduct, 'Black', 'black', '10', 'size-10', 1);

      expect(localStorageSpy.set).toHaveBeenCalled();
    });

    it('should emit last added item for notification', (done) => {
      service.lastAddedItem$.subscribe(item => {
        if (item) {
          expect(item.name).toBe('Test Shoe');
          done();
        }
      });

      service.addItem(mockProduct, 'Black', 'black', '10', 'size-10', 1);
    });
  });

  describe('updateQuantity', () => {
    beforeEach(() => {
      service.addItem(mockProduct, 'Black', 'black', '10', 'size-10', 2);
    });

    it('should update item quantity', () => {
      const cartItemId = service.items()[0].cartItemId;
      service.updateQuantity(cartItemId, 5);

      expect(service.items()[0].quantity).toBe(5);
      expect(service.itemCount()).toBe(5);
      expect(service.subtotal()).toBe(750);
    });

    it('should not exceed max quantity', () => {
      const cartItemId = service.items()[0].cartItemId;
      service.updateQuantity(cartItemId, 15);

      expect(service.items()[0].quantity).toBe(10); // Max is 10
    });

    it('should remove item when quantity is 0', () => {
      const cartItemId = service.items()[0].cartItemId;
      service.updateQuantity(cartItemId, 0);

      expect(service.isEmpty()).toBe(true);
    });

    it('should remove item when quantity is negative', () => {
      const cartItemId = service.items()[0].cartItemId;
      service.updateQuantity(cartItemId, -1);

      expect(service.isEmpty()).toBe(true);
    });
  });

  describe('removeItem', () => {
    beforeEach(() => {
      service.addItem(mockProduct, 'Black', 'black', '10', 'size-10', 2);
    });

    it('should remove item from cart', () => {
      const cartItemId = service.items()[0].cartItemId;
      service.removeItem(cartItemId);

      expect(service.isEmpty()).toBe(true);
      expect(service.itemCount()).toBe(0);
    });

    it('should update subtotal after removal', () => {
      const product2: Product = { ...mockProduct, productId: 'prod-456', estimatedMSRP: 100 };
      service.addItem(product2, 'White', 'white', '9', 'size-9', 1);

      const cartItemId = service.items()[0].cartItemId;
      service.removeItem(cartItemId);

      expect(service.subtotal()).toBe(100);
    });
  });

  describe('clearCart', () => {
    beforeEach(() => {
      service.addItem(mockProduct, 'Black', 'black', '10', 'size-10', 2);
    });

    it('should clear all items', () => {
      service.clearCart();

      expect(service.isEmpty()).toBe(true);
      expect(service.itemCount()).toBe(0);
      expect(service.subtotal()).toBe(0);
    });

    it('should remove cart from localStorage', () => {
      service.clearCart();

      expect(localStorageSpy.remove).toHaveBeenCalled();
    });
  });

  describe('getItem', () => {
    it('should return item by id', () => {
      service.addItem(mockProduct, 'Black', 'black', '10', 'size-10', 1);
      const cartItemId = service.items()[0].cartItemId;

      const item = service.getItem(cartItemId);

      expect(item).toBeDefined();
      expect(item?.name).toBe('Test Shoe');
    });

    it('should return undefined for non-existent id', () => {
      const item = service.getItem('non-existent');

      expect(item).toBeUndefined();
    });
  });

  describe('dismissNotification', () => {
    it('should clear last added item', (done) => {
      service.addItem(mockProduct, 'Black', 'black', '10', 'size-10', 1);
      service.dismissNotification();

      service.lastAddedItem$.subscribe(item => {
        expect(item).toBeNull();
        done();
      });
    });
  });

  describe('computed values', () => {
    it('should calculate total correctly with promo discount', () => {
      service.addItem(mockProduct, 'Black', 'black', '10', 'size-10', 2);

      expect(service.subtotal()).toBe(300);
      expect(service.promoDiscount()).toBe(0);
      expect(service.total()).toBe(300);
    });
  });
});
