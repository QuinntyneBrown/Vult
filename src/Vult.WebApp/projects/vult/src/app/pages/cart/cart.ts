// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  CartItem,
  CartSummary,
  CartSummaryData,
  CartItemData
} from 'vult-components';
import { CartService } from '../../core/services';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    CartItem,
    CartSummary
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cart {
  cartService = inject(CartService);
  private router = inject(Router);

  isPromoLoading = false;
  promoError = '';

  mapToCartItemData(item: any): CartItemData {
    return {
      cartItemId: item.cartItemId,
      productId: item.productId,
      name: item.name,
      subtitle: item.subtitle,
      imageUrl: item.imageUrl,
      color: item.color,
      size: item.size,
      price: item.price,
      originalPrice: item.originalPrice,
      quantity: item.quantity,
      maxQuantity: item.maxQuantity,
      isLowStock: item.isLowStock
    };
  }

  getSummaryData(): CartSummaryData {
    return {
      subtotal: this.cartService.subtotal(),
      shipping: this.cartService.subtotal() >= 50 ? 'free' : 8,
      tax: 'calculated',
      discount: this.cartService.promoDiscount(),
      promoCode: this.cartService.cart().promoCode
    };
  }

  getDeliveryEstimate(): string {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 5);
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 7);

    const formatDate = (date: Date) =>
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return `${formatDate(minDate)} - ${formatDate(maxDate)}`;
  }

  getFreeShippingMessage(): string {
    const subtotal = this.cartService.subtotal();
    if (subtotal >= 50) {
      return '';
    }
    const remaining = 50 - subtotal;
    return `Spend $${remaining.toFixed(2)} more for free shipping`;
  }

  onQuantityChange(event: { cartItemId: string; quantity: number }): void {
    this.cartService.updateQuantity(event.cartItemId, event.quantity);
  }

  onRemoveItem(cartItemId: string): void {
    this.cartService.removeItem(cartItemId);
  }

  onMoveToFavorites(cartItemId: string): void {
    console.log('Move to favorites:', cartItemId);
  }

  onProductClick(productId: string): void {
    this.router.navigate(['/product', productId]);
  }

  onCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  onPayPalClick(): void {
    console.log('PayPal checkout clicked');
  }

  onPromoApply(code: string): void {
    this.isPromoLoading = true;
    this.promoError = '';

    this.cartService.applyPromoCode(code).subscribe({
      next: (result) => {
        this.isPromoLoading = false;
        if (!result.isValid) {
          this.promoError = result.message;
        }
      },
      error: () => {
        this.isPromoLoading = false;
        this.promoError = 'Failed to apply promo code';
      }
    });
  }

  onPromoRemove(): void {
    this.cartService.removePromoCode();
    this.promoError = '';
  }

  onCartClick(): void {
    // Already on cart page
  }

  onLogoClick(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/home']);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
