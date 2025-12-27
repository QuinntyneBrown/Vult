// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CheckoutService } from './checkout.service';
import { CartService } from './cart.service';
import { LocalStorageService } from './local-storage.service';
import { DeliveryInfo, PaymentInfo } from '../models';

describe('CheckoutService', () => {
  let service: CheckoutService;
  let cartServiceSpy: jest.Mocked<CartService>;

  const mockDeliveryInfo: DeliveryInfo = {
    email: 'test@example.com',
    phone: '555-123-4567',
    firstName: 'John',
    lastName: 'Doe',
    address1: '123 Main St',
    address2: 'Unit 4B',
    city: 'Toronto',
    state: 'ON',
    zipCode: 'M5V 3A8',
    country: 'CA',
    useSameForBilling: true
  };

  const mockPaymentInfo: PaymentInfo = {
    method: 'card',
    cardNumber: '4111111111111111',
    expiryDate: '12/25',
    cvv: '123',
    cardholderName: 'John Doe'
  };

  beforeEach(() => {
    const cartMock = {
      subtotal: jest.fn().mockReturnValue(300),
      promoDiscount: jest.fn().mockReturnValue(0),
      isEmpty: jest.fn().mockReturnValue(false),
      clearCart: jest.fn()
    };

    const localStorageMock = {
      get: jest.fn().mockReturnValue(null),
      set: jest.fn(),
      remove: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        CheckoutService,
        { provide: CartService, useValue: cartMock },
        { provide: LocalStorageService, useValue: localStorageMock }
      ]
    });

    service = TestBed.inject(CheckoutService);
    cartServiceSpy = TestBed.inject(CartService) as jest.Mocked<CartService>;
  });

  describe('initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should start on delivery step', () => {
      expect(service.currentStep()).toBe('delivery');
    });

    it('should have default shipping option', () => {
      expect(service.shippingOption()).toBeDefined();
      expect(service.shippingOption()?.id).toBe('standard');
    });

    it('should not be processing initially', () => {
      expect(service.isProcessing()).toBe(false);
    });
  });

  describe('shipping options', () => {
    it('should have three shipping options', () => {
      expect(service.shippingOptions.length).toBe(3);
    });

    it('should have standard, express, and next day options', () => {
      const ids = service.shippingOptions.map(o => o.id);
      expect(ids).toContain('standard');
      expect(ids).toContain('express');
      expect(ids).toContain('nextday');
    });

    it('should set shipping option', () => {
      const expressOption = service.shippingOptions.find(o => o.id === 'express')!;
      service.setShippingOption(expressOption);

      expect(service.shippingOption()).toBe(expressOption);
      expect(service.shippingCost()).toBe(15);
    });
  });

  describe('setDeliveryInfo', () => {
    it('should set delivery info', () => {
      service.setDeliveryInfo(mockDeliveryInfo);

      expect(service.deliveryInfo()).toEqual(mockDeliveryInfo);
    });

    it('should advance to payment step', () => {
      service.setDeliveryInfo(mockDeliveryInfo);

      expect(service.currentStep()).toBe('payment');
    });
  });

  describe('setPaymentInfo', () => {
    beforeEach(() => {
      service.setDeliveryInfo(mockDeliveryInfo);
    });

    it('should set payment info', () => {
      service.setPaymentInfo(mockPaymentInfo);

      expect(service.paymentInfo()).toEqual(mockPaymentInfo);
    });

    it('should advance to review step', () => {
      service.setPaymentInfo(mockPaymentInfo);

      expect(service.currentStep()).toBe('review');
    });
  });

  describe('goToStep', () => {
    it('should allow going to delivery step', () => {
      service.setDeliveryInfo(mockDeliveryInfo);
      service.goToStep('delivery');

      expect(service.currentStep()).toBe('delivery');
    });

    it('should allow going to payment step if delivery is complete', () => {
      service.setDeliveryInfo(mockDeliveryInfo);
      service.goToStep('payment');

      expect(service.currentStep()).toBe('payment');
    });

    it('should not allow going to payment step if delivery is incomplete', () => {
      service.goToStep('payment');

      expect(service.currentStep()).toBe('delivery');
    });

    it('should not allow going to review step if payment is incomplete', () => {
      service.setDeliveryInfo(mockDeliveryInfo);
      service.goToStep('review');

      expect(service.currentStep()).toBe('payment'); // Should stay on payment
    });

    it('should allow going to review step if both delivery and payment are complete', () => {
      service.setDeliveryInfo(mockDeliveryInfo);
      service.setPaymentInfo(mockPaymentInfo);
      service.goToStep('delivery');
      service.goToStep('review');

      expect(service.currentStep()).toBe('review');
    });
  });

  describe('calculateTax', () => {
    it('should calculate tax at 8.875%', () => {
      const tax = service.calculateTax(100);

      expect(tax).toBeCloseTo(8.875, 2);
    });

    it('should calculate tax for cart subtotal', () => {
      const tax = service.calculateTax(300);

      expect(tax).toBeCloseTo(26.625, 2);
    });
  });

  describe('calculateTotal', () => {
    it('should calculate total with subtotal, shipping, and tax', () => {
      const total = service.calculateTotal();

      // 300 (subtotal) + 0 (standard shipping) + 26.625 (tax) = 326.625
      expect(total).toBeCloseTo(326.625, 2);
    });

    it('should include shipping cost for express', () => {
      const expressOption = service.shippingOptions.find(o => o.id === 'express')!;
      service.setShippingOption(expressOption);

      const total = service.calculateTotal();

      // 300 + 15 + 26.625 = 341.625
      expect(total).toBeCloseTo(341.625, 2);
    });

    it('should subtract promo discount', () => {
      cartServiceSpy.promoDiscount.mockReturnValue(50);

      const total = service.calculateTotal();

      // 300 - 50 + 0 + 22.1875 (tax on 250) = 272.1875
      expect(total).toBeCloseTo(272.1875, 2);
    });
  });

  describe('getEstimatedDeliveryDate', () => {
    it('should return date range for standard shipping', () => {
      const estimate = service.getEstimatedDeliveryDate();

      expect(estimate).toContain('-'); // Should be a range
    });

    it('should return single date for next day shipping', () => {
      const nextDayOption = service.shippingOptions.find(o => o.id === 'nextday')!;
      service.setShippingOption(nextDayOption);

      const estimate = service.getEstimatedDeliveryDate();

      expect(estimate).not.toContain('-'); // Should be a single date
    });
  });

  describe('placeOrder', () => {
    beforeEach(() => {
      service.setDeliveryInfo(mockDeliveryInfo);
      service.setPaymentInfo(mockPaymentInfo);
    });

    it('should return order result', fakeAsync(() => {
      let result: any;
      service.placeOrder().subscribe(r => result = r);
      tick(2100);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.orderId).toBeDefined();
      expect(result.orderNumber).toMatch(/^VLT-\d{4}-\d{6}$/);
    }));

    it('should clear cart after successful order', fakeAsync(() => {
      service.placeOrder().subscribe();
      tick(2100);

      expect(cartServiceSpy.clearCart).toHaveBeenCalled();
    }));

    it('should reset checkout state after order', fakeAsync(() => {
      service.placeOrder().subscribe();
      tick(2100);

      expect(service.currentStep()).toBe('delivery');
      expect(service.deliveryInfo()).toBeNull();
      expect(service.paymentInfo()).toBeNull();
    }));
  });

  describe('reset', () => {
    it('should reset all checkout state', () => {
      service.setDeliveryInfo(mockDeliveryInfo);
      service.setPaymentInfo(mockPaymentInfo);
      service.reset();

      expect(service.currentStep()).toBe('delivery');
      expect(service.deliveryInfo()).toBeNull();
      expect(service.paymentInfo()).toBeNull();
      expect(service.isProcessing()).toBe(false);
    });
  });

  describe('canProceedToCheckout', () => {
    it('should return true when cart is not empty', () => {
      cartServiceSpy.isEmpty.mockReturnValue(false);

      expect(service.canProceedToCheckout()).toBe(true);
    });

    it('should return false when cart is empty', () => {
      cartServiceSpy.isEmpty.mockReturnValue(true);

      expect(service.canProceedToCheckout()).toBe(false);
    });
  });

  describe('isStepComplete', () => {
    it('should return false for delivery when not set', () => {
      expect(service.isStepComplete('delivery')).toBe(false);
    });

    it('should return true for delivery when set', () => {
      service.setDeliveryInfo(mockDeliveryInfo);

      expect(service.isStepComplete('delivery')).toBe(true);
    });

    it('should return false for payment when not set', () => {
      expect(service.isStepComplete('payment')).toBe(false);
    });

    it('should return true for payment when set', () => {
      service.setDeliveryInfo(mockDeliveryInfo);
      service.setPaymentInfo(mockPaymentInfo);

      expect(service.isStepComplete('payment')).toBe(true);
    });

    it('should always return false for review', () => {
      service.setDeliveryInfo(mockDeliveryInfo);
      service.setPaymentInfo(mockPaymentInfo);

      expect(service.isStepComplete('review')).toBe(false);
    });
  });

  describe('isStepAccessible', () => {
    it('should always allow access to delivery', () => {
      expect(service.isStepAccessible('delivery')).toBe(true);
    });

    it('should not allow access to payment without delivery', () => {
      expect(service.isStepAccessible('payment')).toBe(false);
    });

    it('should allow access to payment with delivery', () => {
      service.setDeliveryInfo(mockDeliveryInfo);

      expect(service.isStepAccessible('payment')).toBe(true);
    });

    it('should not allow access to review without payment', () => {
      service.setDeliveryInfo(mockDeliveryInfo);

      expect(service.isStepAccessible('review')).toBe(false);
    });

    it('should allow access to review with both delivery and payment', () => {
      service.setDeliveryInfo(mockDeliveryInfo);
      service.setPaymentInfo(mockPaymentInfo);

      expect(service.isStepAccessible('review')).toBe(true);
    });
  });
});
