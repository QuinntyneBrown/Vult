// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import {
  CheckoutState,
  DeliveryInfo,
  PaymentInfo,
  ShippingOption,
  OrderResult
} from '../models/cart';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private stateSignal = signal<CheckoutState>({
    currentStep: 'delivery',
    deliveryInfo: null,
    paymentInfo: null,
    shippingOption: null,
    isProcessing: false
  });

  public readonly state = this.stateSignal.asReadonly();
  public readonly currentStep = computed(() => this.stateSignal().currentStep);
  public readonly deliveryInfo = computed(() => this.stateSignal().deliveryInfo);
  public readonly paymentInfo = computed(() => this.stateSignal().paymentInfo);
  public readonly shippingOption = computed(() => this.stateSignal().shippingOption);
  public readonly isProcessing = computed(() => this.stateSignal().isProcessing);

  public readonly shippingOptions: ShippingOption[] = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: '5-7 business days',
      price: 0,
      estimatedDays: '5-7 business days'
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: '2-3 business days',
      price: 15,
      estimatedDays: '2-3 business days'
    },
    {
      id: 'nextday',
      name: 'Next Day Delivery',
      description: '1 business day',
      price: 25,
      estimatedDays: '1 business day'
    }
  ];

  public readonly shippingCost = computed(() =>
    this.stateSignal().shippingOption?.price ?? 0
  );

  constructor(private cartService: CartService) {
    // Default to standard shipping
    this.setShippingOption(this.shippingOptions[0]);
  }

  setDeliveryInfo(info: DeliveryInfo): void {
    this.stateSignal.update(state => ({
      ...state,
      deliveryInfo: info,
      currentStep: 'payment'
    }));
  }

  setPaymentInfo(info: PaymentInfo): void {
    this.stateSignal.update(state => ({
      ...state,
      paymentInfo: info,
      currentStep: 'review'
    }));
  }

  setShippingOption(option: ShippingOption): void {
    this.stateSignal.update(state => ({
      ...state,
      shippingOption: option
    }));
  }

  goToStep(step: 'delivery' | 'payment' | 'review'): void {
    const state = this.stateSignal();

    // Validate that previous steps are complete
    if (step === 'payment' && !state.deliveryInfo) {
      return;
    }
    if (step === 'review' && (!state.deliveryInfo || !state.paymentInfo)) {
      return;
    }

    this.stateSignal.update(s => ({ ...s, currentStep: step }));
  }

  calculateTax(subtotal: number): number {
    // MVP: Simple 8.875% tax rate (NY)
    return subtotal * 0.08875;
  }

  calculateTotal(): number {
    const subtotal = this.cartService.subtotal();
    const discount = this.cartService.promoDiscount();
    const shipping = this.shippingCost();
    const tax = this.calculateTax(subtotal - discount);

    return subtotal - discount + shipping + tax;
  }

  getEstimatedDeliveryDate(): string {
    const option = this.stateSignal().shippingOption;
    if (!option) return '';

    const today = new Date();
    let minDays: number;
    let maxDays: number;

    switch (option.id) {
      case 'nextday':
        minDays = 1;
        maxDays = 1;
        break;
      case 'express':
        minDays = 2;
        maxDays = 3;
        break;
      default:
        minDays = 5;
        maxDays = 7;
    }

    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + minDays);

    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + maxDays);

    const formatDate = (date: Date) =>
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    if (minDays === maxDays) {
      return formatDate(minDate);
    }

    return `${formatDate(minDate)} - ${formatDate(maxDate)}`;
  }

  placeOrder(): Observable<OrderResult> {
    this.stateSignal.update(state => ({ ...state, isProcessing: true }));

    // MVP: Mock order placement
    // In a real implementation, this would call an API
    return of(null).pipe(
      delay(2000),
      map(() => {
        const orderNumber = `VLT-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

        // Clear the cart after successful order
        this.cartService.clearCart();

        // Reset checkout state
        this.reset();

        return {
          success: true,
          orderId: crypto.randomUUID(),
          orderNumber,
          message: 'Your order has been placed successfully!',
          estimatedDelivery: this.getEstimatedDeliveryDate()
        } as OrderResult;
      })
    );
  }

  reset(): void {
    this.stateSignal.set({
      currentStep: 'delivery',
      deliveryInfo: null,
      paymentInfo: null,
      shippingOption: this.shippingOptions[0],
      isProcessing: false
    });
  }

  canProceedToCheckout(): boolean {
    return !this.cartService.isEmpty();
  }

  isStepComplete(step: 'delivery' | 'payment' | 'review'): boolean {
    const state = this.stateSignal();
    switch (step) {
      case 'delivery':
        return state.deliveryInfo !== null;
      case 'payment':
        return state.paymentInfo !== null;
      case 'review':
        return false; // Review is never "complete" until order is placed
    }
  }

  isStepAccessible(step: 'delivery' | 'payment' | 'review'): boolean {
    const state = this.stateSignal();
    switch (step) {
      case 'delivery':
        return true;
      case 'payment':
        return state.deliveryInfo !== null;
      case 'review':
        return state.deliveryInfo !== null && state.paymentInfo !== null;
    }
  }
}
