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
  template: `
    <div class="cart-page" data-testid="cart-page">
      <!-- Simple Header -->
      <header class="cart-header">
        <a class="logo" href="/home" (click)="onLogoClick($event)">VULT</a>
        <nav class="nav-links">
          <a href="/products">New & Featured</a>
          <a href="/products?gender=0">Men</a>
          <a href="/products?gender=1">Women</a>
          <a href="/products">Kids</a>
          <a href="/products">Sale</a>
          <div class="cart-icon" (click)="onCartClick()">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            @if (cartService.itemCount() > 0) {
              <span class="cart-badge">{{ cartService.itemCount() }}</span>
            }
          </div>
        </nav>
      </header>

      <main class="cart-main">
        <div class="cart-container">
          @if (cartService.isEmpty()) {
            <!-- Empty Cart State -->
            <div class="empty-cart" data-testid="empty-cart">
              <div class="empty-cart-icon">
                <svg width="64" height="64" fill="none" viewBox="0 0 64 64" stroke="#ccc" stroke-width="2">
                  <path d="M20 20h28l2 24H18l2-24z"/>
                  <path d="M24 20v-4a8 8 0 1116 0v4"/>
                </svg>
              </div>
              <h1 class="empty-cart-title">Your Bag is Empty</h1>
              <p class="empty-cart-message">Once you add something to your bag, it will appear here. Ready to get started?</p>
              <button class="continue-shopping-btn" (click)="navigateTo('/products')">
                Continue Shopping
              </button>
            </div>
          } @else {
            <!-- Cart Content -->
            <section class="cart-section">
              <h1 class="cart-title">Bag</h1>
              <p class="cart-count" data-testid="cart-count">
                {{ cartService.itemCount() }} {{ cartService.itemCount() === 1 ? 'Item' : 'Items' }} |
                {{ cartService.subtotal() | currency }}
              </p>

              <div class="cart-items" data-testid="cart-items">
                @for (item of cartService.items(); track item.cartItemId) {
                  <v-cart-item
                    [item]="mapToCartItemData(item)"
                    [testId]="'cart-item-' + item.cartItemId"
                    (quantityChange)="onQuantityChange($event)"
                    (remove)="onRemoveItem($event)"
                    (moveToFavorites)="onMoveToFavorites($event)"
                    (productClick)="onProductClick($event)"
                  />
                }
              </div>
            </section>

            <!-- Summary Section -->
            <aside class="summary-section">
              <v-cart-summary
                [data]="getSummaryData()"
                [deliveryEstimate]="getDeliveryEstimate()"
                [freeShippingMessage]="getFreeShippingMessage()"
                [freeShippingQualified]="cartService.subtotal() >= 50"
                [isPromoLoading]="isPromoLoading"
                [promoError]="promoError"
                testId="cart-summary"
                (checkout)="onCheckout()"
                (payPalClick)="onPayPalClick()"
                (promoApply)="onPromoApply($event)"
                (promoRemove)="onPromoRemove()"
              />
            </aside>
          }
        </div>
      </main>

    </div>
  `,
  styles: [`
    .cart-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: #f5f5f5;
    }

    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 48px;
      background: #ffffff;
      border-bottom: 1px solid #e5e5e5;
    }

    .logo {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 24px;
      font-weight: 700;
      color: #111111;
      text-decoration: none;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .nav-links a {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #111111;
      text-decoration: none;
    }

    .nav-links a:hover {
      color: #707070;
    }

    .cart-icon {
      position: relative;
      cursor: pointer;
    }

    .cart-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background: #111111;
      color: #ffffff;
      font-size: 10px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .cart-main {
      flex: 1;
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 24px;
      width: 100%;
    }

    .cart-container {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 24px;
    }

    /* Empty Cart */
    .empty-cart {
      grid-column: 1 / -1;
      text-align: center;
      padding: 80px 24px;
      background: #ffffff;
    }

    .empty-cart-icon {
      width: 120px;
      height: 120px;
      margin: 0 auto 32px;
      background: #f5f5f5;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .empty-cart-title {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 28px;
      font-weight: 500;
      color: #111111;
      margin: 0 0 16px;
    }

    .empty-cart-message {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 16px;
      color: #707070;
      margin: 0 0 32px;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    .continue-shopping-btn {
      display: inline-block;
      padding: 16px 48px;
      background: #111111;
      color: #ffffff;
      border: none;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .continue-shopping-btn:hover {
      background: #333333;
    }

    /* Cart Section */
    .cart-section {
      background: #ffffff;
      padding: 24px;
    }

    .cart-title {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 28px;
      font-weight: 500;
      color: #111111;
      margin: 0 0 8px;
    }

    .cart-count {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #707070;
      margin: 0 0 24px;
    }

    /* Summary Section */
    .summary-section {
      position: sticky;
      top: 100px;
      align-self: start;
    }

    @media (max-width: 900px) {
      .cart-container {
        grid-template-columns: 1fr;
      }

      .summary-section {
        position: static;
      }
    }

    @media (max-width: 600px) {
      .cart-main {
        padding: 24px 16px;
      }

      .empty-cart {
        padding: 40px 16px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cart {
  cartService = inject(CartService);
  private router = inject(Router);

  isPromoLoading = false;
  promoError = '';

  menuItems = [
    { label: 'New & Featured', href: '/products' },
    { label: 'Men', href: '/products?gender=0' },
    { label: 'Women', href: '/products?gender=1' },
    { label: 'Kids', href: '/products' },
    { label: 'Sale', href: '/products' }
  ];


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
    // TODO: Implement favorites functionality
    console.log('Move to favorites:', cartItemId);
  }

  onProductClick(productId: string): void {
    this.router.navigate(['/product', productId]);
  }

  onCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  onPayPalClick(): void {
    // TODO: Implement PayPal checkout
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
