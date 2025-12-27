// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  CheckoutStep,
  FormField
} from 'vult-components';
import { CartService, CheckoutService } from '../../core/services';
import { DeliveryInfo, PaymentInfo, ShippingOption } from '../../core/models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, CheckoutStep, FormField],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Checkout {
  cartService = inject(CartService);
  checkoutService = inject(CheckoutService);
  private router = inject(Router);

  selectedShipping = signal<ShippingOption | null>(this.checkoutService.shippingOptions[0]);

  deliveryForm: DeliveryInfo = {
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    useSameForBilling: true
  };

  paymentForm: PaymentInfo & { cardNumber?: string; expiryDate?: string; cvv?: string; cardholderName?: string } = {
    method: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  };

  ngOnInit(): void {
    if (this.cartService.isEmpty()) {
      this.router.navigate(['/cart']);
    }
  }

  getStepStatus(step: 'delivery' | 'payment' | 'review'): 'pending' | 'active' | 'completed' {
    const currentStep = this.checkoutService.currentStep();

    if (step === currentStep) return 'active';
    if (this.checkoutService.isStepComplete(step)) return 'completed';
    return 'pending';
  }

  getDeliverySummary(): string {
    const info = this.checkoutService.deliveryInfo();
    if (!info) return '';
    return `${info.firstName} ${info.lastName}, ${info.city}, ${info.state}`;
  }

  getPaymentSummary(): string {
    const info = this.checkoutService.paymentInfo();
    if (!info) return '';
    if (info.method === 'card') {
      return `Card ending in ${this.getLastFourDigits()}`;
    }
    return info.method === 'paypal' ? 'PayPal' : 'Klarna';
  }

  getLastFourDigits(): string {
    return this.paymentForm.cardNumber?.slice(-4) || '****';
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isDeliveryFormValid(): boolean {
    return !!(
      this.deliveryForm.email &&
      this.isValidEmail(this.deliveryForm.email) &&
      this.deliveryForm.phone &&
      this.deliveryForm.firstName &&
      this.deliveryForm.lastName &&
      this.deliveryForm.address1 &&
      this.deliveryForm.city &&
      this.deliveryForm.state &&
      this.deliveryForm.zipCode &&
      this.deliveryForm.country
    );
  }

  isPaymentFormValid(): boolean {
    if (this.paymentForm.method === 'card') {
      return !!(
        this.paymentForm.cardNumber &&
        this.paymentForm.expiryDate &&
        this.paymentForm.cvv &&
        this.paymentForm.cardholderName
      );
    }
    return true;
  }

  selectShipping(option: ShippingOption): void {
    this.selectedShipping.set(option);
    this.checkoutService.setShippingOption(option);
  }

  saveDelivery(): void {
    if (this.isDeliveryFormValid()) {
      this.checkoutService.setDeliveryInfo(this.deliveryForm);
    }
  }

  savePayment(): void {
    if (this.isPaymentFormValid()) {
      this.checkoutService.setPaymentInfo(this.paymentForm);
    }
  }

  editStep(step: 'delivery' | 'payment'): void {
    this.checkoutService.goToStep(step);
  }

  placeOrder(): void {
    this.checkoutService.placeOrder().subscribe({
      next: (result) => {
        if (result.success) {
          this.router.navigate(['/order-confirmation', result.orderId], {
            state: {
              orderNumber: result.orderNumber,
              email: this.deliveryForm.email,
              estimatedDelivery: result.estimatedDelivery
            }
          });
        }
      },
      error: (error) => {
        console.error('Order placement failed:', error);
      }
    });
  }

  onLogoClick(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/home']);
  }
}
