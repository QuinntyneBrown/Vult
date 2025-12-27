// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Cart } from './cart';
import { CartService } from '../../core/services';
import { signal } from '@angular/core';

describe('Cart', () => {
  let component: Cart;
  let fixture: ComponentFixture<Cart>;
  let routerSpy: jest.Mocked<Router>;
  let cartServiceMock: any;

  const mockCartItems = [
    {
      cartItemId: 'cart-1',
      productId: 'prod-1',
      name: 'Test Shoe',
      subtitle: "Men's Shoes",
      imageUrl: 'https://example.com/shoe.jpg',
      color: 'Black',
      colorId: 'black',
      size: '10',
      sizeId: 'size-10',
      price: 150,
      quantity: 2,
      maxQuantity: 10,
      isLowStock: false,
      addedAt: new Date().toISOString()
    }
  ];

  beforeEach(async () => {
    const itemsSignal = signal(mockCartItems);
    const itemCountSignal = signal(2);
    const subtotalSignal = signal(300);
    const isEmptySignal = signal(false);
    const promoDiscountSignal = signal(0);
    const cartSignal = signal({
      items: mockCartItems,
      subtotal: 300,
      itemCount: 2,
      lastUpdated: new Date().toISOString()
    });

    cartServiceMock = {
      items: itemsSignal,
      itemCount: itemCountSignal,
      subtotal: subtotalSignal,
      isEmpty: isEmptySignal,
      promoDiscount: promoDiscountSignal,
      cart: cartSignal,
      updateQuantity: jest.fn(),
      removeItem: jest.fn(),
      applyPromoCode: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
      removePromoCode: jest.fn()
    };

    routerSpy = {
      navigate: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [Cart],
      providers: [
        { provide: CartService, useValue: cartServiceMock },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Cart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display cart page', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="cart-page"]')).toBeTruthy();
  });

  it('should display cart items when cart is not empty', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="cart-items"]')).toBeTruthy();
  });

  it('should display cart count', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const countElement = compiled.querySelector('[data-testid="cart-count"]');
    expect(countElement?.textContent).toContain('2');
  });

  describe('when cart is empty', () => {
    beforeEach(() => {
      (cartServiceMock.isEmpty as any).set(true);
      (cartServiceMock.items as any).set([]);
      (cartServiceMock.itemCount as any).set(0);
      (cartServiceMock.subtotal as any).set(0);
      fixture.detectChanges();
    });

    it('should display empty cart message', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="empty-cart"]')).toBeTruthy();
    });
  });

  describe('cart actions', () => {
    it('should update quantity when onQuantityChange is called', () => {
      component.onQuantityChange({ cartItemId: 'cart-1', quantity: 3 });
      expect(cartServiceMock.updateQuantity).toHaveBeenCalledWith('cart-1', 3);
    });

    it('should remove item when onRemoveItem is called', () => {
      component.onRemoveItem('cart-1');
      expect(cartServiceMock.removeItem).toHaveBeenCalledWith('cart-1');
    });

    it('should navigate to product detail when onProductClick is called', () => {
      component.onProductClick('prod-1');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/product', 'prod-1']);
    });

    it('should navigate to checkout when onCheckout is called', () => {
      component.onCheckout();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/checkout']);
    });
  });

  describe('getSummaryData', () => {
    it('should return correct summary data', () => {
      const data = component.getSummaryData();

      expect(data.subtotal).toBe(300);
      expect(data.shipping).toBe('free'); // >= $50
      expect(data.tax).toBe('calculated');
    });

    it('should return shipping cost when under $50', () => {
      (cartServiceMock.subtotal as any).set(30);
      fixture.detectChanges();

      const data = component.getSummaryData();
      expect(data.shipping).toBe(8);
    });
  });

  describe('getFreeShippingMessage', () => {
    it('should return empty string when qualified for free shipping', () => {
      const message = component.getFreeShippingMessage();
      expect(message).toBe('');
    });

    it('should return remaining amount message when not qualified', () => {
      (cartServiceMock.subtotal as any).set(30);
      fixture.detectChanges();

      const message = component.getFreeShippingMessage();
      expect(message).toContain('20.00');
    });
  });

  describe('mapToCartItemData', () => {
    it('should map cart item correctly', () => {
      const item = mockCartItems[0];
      const mapped = component.mapToCartItemData(item);

      expect(mapped.cartItemId).toBe('cart-1');
      expect(mapped.name).toBe('Test Shoe');
      expect(mapped.price).toBe(150);
      expect(mapped.quantity).toBe(2);
    });
  });
});
