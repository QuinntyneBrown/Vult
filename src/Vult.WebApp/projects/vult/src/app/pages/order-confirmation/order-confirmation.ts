// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="confirmation-page" data-testid="order-confirmation-page">
      <!-- Header -->
      <header class="confirmation-header">
        <a class="logo" href="/home" (click)="onLogoClick($event)">VULT</a>
      </header>

      <main class="confirmation-main">
        <!-- Success Header -->
        <div class="success-header">
          <div class="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3">
              <path d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h1 class="success-title">Thank You for Your Order!</h1>
          <p class="order-number" data-testid="order-number">
            Order Number: <strong>{{ orderNumber }}</strong>
          </p>
          <p class="confirmation-email">
            A confirmation email has been sent to {{ email }}
          </p>
        </div>

        <!-- Order Details -->
        <div class="order-details">
          <h2>Order Details</h2>
          <div class="details-grid">
            <div class="detail-section">
              <h3>Estimated Delivery</h3>
              <p class="delivery-date">{{ estimatedDelivery }}</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="actions">
          <button class="primary-btn" (click)="continueShopping()">
            Continue Shopping
          </button>
          <button class="secondary-btn" (click)="trackOrder()">
            Track Order
          </button>
        </div>

        <!-- Account Prompt -->
        <div class="account-prompt">
          <h3>Create an Account</h3>
          <p>Save your information for faster checkout next time and get access to exclusive benefits.</p>
          <ul class="benefits-list">
            <li>Track orders easily</li>
            <li>Faster checkout</li>
            <li>Exclusive offers</li>
          </ul>
          <button class="create-account-btn" (click)="createAccount()">
            Create Account
          </button>
        </div>
      </main>

      <!-- Footer -->
      <footer class="confirmation-footer">
        <p>
          Questions about your order?
          <a href="/help/contact">Contact Us</a> or call 1-800-VULT-123
        </p>
      </footer>
    </div>
  `,
  styles: [`
    .confirmation-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: #f5f5f5;
    }

    /* Header */
    .confirmation-header {
      background: #ffffff;
      border-bottom: 1px solid #e5e5e5;
      padding: 16px 48px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .logo {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 24px;
      font-weight: 900;
      letter-spacing: -1px;
      color: #111111;
      text-decoration: none;
    }

    /* Main */
    .confirmation-main {
      flex: 1;
      max-width: 800px;
      margin: 0 auto;
      padding: 48px 24px;
      width: 100%;
    }

    /* Success Header */
    .success-header {
      text-align: center;
      margin-bottom: 48px;
    }

    .success-icon {
      width: 80px;
      height: 80px;
      background: #128a09;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      animation: scaleIn 0.5s ease;
    }

    @keyframes scaleIn {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

    .success-icon svg {
      width: 40px;
      height: 40px;
    }

    .success-title {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 32px;
      font-weight: 500;
      color: #111111;
      margin: 0 0 16px;
    }

    .order-number {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 18px;
      color: #707070;
      margin: 0 0 8px;
    }

    .order-number strong {
      color: #111111;
    }

    .confirmation-email {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #707070;
      margin: 0;
    }

    /* Order Details */
    .order-details {
      background: #ffffff;
      padding: 32px;
      margin-bottom: 24px;
    }

    .order-details h2 {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 20px;
      font-weight: 500;
      color: #111111;
      margin: 0 0 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e5e5e5;
    }

    .details-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .detail-section h3 {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #707070;
      margin: 0 0 12px;
    }

    .detail-section p {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #111111;
      line-height: 1.6;
      margin: 0;
    }

    .delivery-date {
      display: inline-block;
      background: #f5f5f5;
      padding: 8px 16px;
      font-weight: 500 !important;
    }

    /* Actions */
    .actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-bottom: 48px;
    }

    .primary-btn {
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

    .primary-btn:hover {
      background: #333333;
    }

    .secondary-btn {
      padding: 16px 48px;
      background: #ffffff;
      color: #111111;
      border: 1px solid #111111;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .secondary-btn:hover {
      background: #f5f5f5;
    }

    /* Account Prompt */
    .account-prompt {
      background: #ffffff;
      padding: 32px;
      text-align: center;
    }

    .account-prompt h3 {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 20px;
      font-weight: 500;
      color: #111111;
      margin: 0 0 12px;
    }

    .account-prompt p {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #707070;
      margin: 0 auto 24px;
      max-width: 400px;
    }

    .benefits-list {
      list-style: none;
      padding: 0;
      margin: 0 0 24px;
      display: flex;
      justify-content: center;
      gap: 32px;
    }

    .benefits-list li {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #111111;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .benefits-list li::before {
      content: "\\2713";
      color: #128a09;
      font-weight: bold;
    }

    .create-account-btn {
      padding: 14px 32px;
      background: #111111;
      color: #ffffff;
      border: none;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .create-account-btn:hover {
      background: #333333;
    }

    /* Footer */
    .confirmation-footer {
      background: #111111;
      color: #ffffff;
      padding: 32px;
      text-align: center;
      margin-top: 48px;
    }

    .confirmation-footer p {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 12px;
      color: #707070;
      margin: 0;
    }

    .confirmation-footer a {
      color: #ffffff;
      text-decoration: underline;
    }

    /* Responsive */
    @media (max-width: 600px) {
      .confirmation-header {
        padding: 16px;
      }

      .success-title {
        font-size: 24px;
      }

      .actions {
        flex-direction: column;
      }

      .benefits-list {
        flex-direction: column;
        gap: 8px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .success-icon {
        animation: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderConfirmation implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  orderId = '';
  orderNumber = '';
  email = '';
  estimatedDelivery = '';

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('orderId') || '';

    const state = history.state;
    if (state) {
      this.orderNumber = state.orderNumber || this.generateOrderNumber();
      this.email = state.email || '';
      this.estimatedDelivery = state.estimatedDelivery || this.getDefaultDeliveryDate();
    } else {
      this.orderNumber = this.generateOrderNumber();
      this.estimatedDelivery = this.getDefaultDeliveryDate();
    }
  }

  private generateOrderNumber(): string {
    return `#VLT-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  }

  private getDefaultDeliveryDate(): string {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 5);
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 7);

    const formatDate = (date: Date) =>
      date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return `${formatDate(minDate)} - ${formatDate(maxDate)}`;
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  trackOrder(): void {
    // TODO: Implement order tracking
    console.log('Track order:', this.orderId);
  }

  createAccount(): void {
    this.router.navigate(['/register']);
  }

  onLogoClick(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/home']);
  }
}
