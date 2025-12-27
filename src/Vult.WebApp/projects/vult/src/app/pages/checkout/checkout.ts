// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  CheckoutStep,
  FormField,
  CartSummaryData
} from 'vult-components';
import { CartService, CheckoutService } from '../../core/services';
import { DeliveryInfo, PaymentInfo, ShippingOption } from '../../core/models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, CheckoutStep, FormField],
  template: `
    <div class="checkout-page" data-testid="checkout-page">
      <!-- Header -->
      <header class="checkout-header">
        <a class="logo" href="/home" (click)="onLogoClick($event)">VULT</a>
        <div class="header-right">
          <a href="/help" class="help-link">Need Help?</a>
          <div class="secure-badge">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1L2 3v5c0 3.5 2.5 6.5 6 7.5 3.5-1 6-4 6-7.5V3L8 1zm0 7.5V4l4 1.5v3c0 2-1.5 4-4 5V8.5z"/>
            </svg>
            Secure Checkout
          </div>
        </div>
      </header>

      <main class="checkout-main">
        <div class="checkout-container">
          <!-- Checkout Steps -->
          <section class="checkout-steps">
            <h1 class="checkout-title">Checkout</h1>

            <!-- Step 1: Delivery -->
            <v-checkout-step
              [stepNumber]="1"
              title="Delivery"
              [status]="getStepStatus('delivery')"
              [summary]="getDeliverySummary()"
              testId="checkout-step-delivery"
              (edit)="editStep('delivery')"
            >
              <div class="step-form">
                <p class="sign-in-link">
                  <a href="/login">Sign in</a> for faster checkout or continue as guest
                </p>

                <!-- Contact Information -->
                <div class="form-section">
                  <h3 class="form-section-title">Contact Information</h3>
                  <v-form-field
                    type="email"
                    label="Email Address"
                    [required]="true"
                    [(ngModel)]="deliveryForm.email"
                    [isValid]="isValidEmail(deliveryForm.email)"
                    testId="checkout-email"
                  />
                  <v-form-field
                    type="tel"
                    label="Phone Number"
                    [required]="true"
                    [(ngModel)]="deliveryForm.phone"
                    testId="checkout-phone"
                  />
                </div>

                <!-- Shipping Address -->
                <div class="form-section">
                  <h3 class="form-section-title">Shipping Address</h3>
                  <div class="form-row">
                    <v-form-field
                      type="text"
                      label="First Name"
                      [required]="true"
                      [(ngModel)]="deliveryForm.firstName"
                      testId="checkout-firstname"
                    />
                    <v-form-field
                      type="text"
                      label="Last Name"
                      [required]="true"
                      [(ngModel)]="deliveryForm.lastName"
                      testId="checkout-lastname"
                    />
                  </div>
                  <v-form-field
                    type="text"
                    label="Address"
                    [required]="true"
                    [(ngModel)]="deliveryForm.address1"
                    testId="checkout-address1"
                  />
                  <v-form-field
                    type="text"
                    label="Apartment, suite, etc. (optional)"
                    [(ngModel)]="deliveryForm.address2"
                    testId="checkout-address2"
                  />
                  <div class="form-row">
                    <v-form-field
                      type="text"
                      label="City"
                      [required]="true"
                      [(ngModel)]="deliveryForm.city"
                      testId="checkout-city"
                    />
                    <div class="form-group">
                      <select
                        class="form-select"
                        [(ngModel)]="deliveryForm.state"
                        data-testid="checkout-state"
                      >
                        <option value="">Select State</option>
                        <option value="CA">California</option>
                        <option value="NY">New York</option>
                        <option value="TX">Texas</option>
                        <option value="FL">Florida</option>
                        <option value="IL">Illinois</option>
                        <option value="PA">Pennsylvania</option>
                        <option value="OH">Ohio</option>
                        <option value="GA">Georgia</option>
                        <option value="NC">North Carolina</option>
                        <option value="MI">Michigan</option>
                      </select>
                      <label class="select-label">State*</label>
                    </div>
                  </div>
                  <div class="form-row">
                    <v-form-field
                      type="text"
                      label="ZIP Code"
                      [required]="true"
                      [(ngModel)]="deliveryForm.zipCode"
                      testId="checkout-zip"
                    />
                    <div class="form-group">
                      <select
                        class="form-select"
                        [(ngModel)]="deliveryForm.country"
                        data-testid="checkout-country"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                      </select>
                      <label class="select-label">Country*</label>
                    </div>
                  </div>
                </div>

                <!-- Shipping Options -->
                <div class="form-section">
                  <h3 class="form-section-title">Shipping Method</h3>
                  @for (option of checkoutService.shippingOptions; track option.id) {
                    <label
                      class="shipping-option"
                      [class.shipping-option--selected]="selectedShipping()?.id === option.id"
                    >
                      <input
                        type="radio"
                        name="shipping"
                        [value]="option.id"
                        [checked]="selectedShipping()?.id === option.id"
                        (change)="selectShipping(option)"
                      />
                      <div class="shipping-details">
                        <span class="shipping-name">{{ option.name }}</span>
                        <span class="shipping-time">{{ option.description }}</span>
                      </div>
                      <span class="shipping-price">
                        {{ option.price === 0 ? 'Free' : (option.price | currency) }}
                      </span>
                    </label>
                  }
                </div>

                <div class="checkbox-group">
                  <input
                    type="checkbox"
                    id="sameBilling"
                    [(ngModel)]="deliveryForm.useSameForBilling"
                  />
                  <label for="sameBilling">Use this address for billing</label>
                </div>

                <button
                  class="continue-btn"
                  [disabled]="!isDeliveryFormValid()"
                  (click)="saveDelivery()"
                  data-testid="checkout-delivery-continue"
                >
                  Save & Continue
                </button>
              </div>
            </v-checkout-step>

            <!-- Step 2: Payment -->
            <v-checkout-step
              [stepNumber]="2"
              title="Payment"
              [status]="getStepStatus('payment')"
              [summary]="getPaymentSummary()"
              testId="checkout-step-payment"
              (edit)="editStep('payment')"
            >
              <div class="step-form">
                <!-- Payment Methods -->
                <div class="payment-methods">
                  <button
                    class="payment-method"
                    [class.payment-method--selected]="paymentForm.method === 'card'"
                    (click)="paymentForm.method = 'card'"
                  >
                    <svg class="payment-icon" viewBox="0 0 32 32" fill="#111">
                      <rect x="4" y="8" width="24" height="16" rx="2" stroke="#111" stroke-width="2" fill="none"/>
                      <line x1="4" y1="14" x2="28" y2="14" stroke="#111" stroke-width="2"/>
                    </svg>
                    <span>Credit/Debit Card</span>
                  </button>
                  <button
                    class="payment-method"
                    [class.payment-method--selected]="paymentForm.method === 'paypal'"
                    (click)="paymentForm.method = 'paypal'"
                  >
                    <span class="paypal-text">PayPal</span>
                  </button>
                  <button
                    class="payment-method"
                    [class.payment-method--selected]="paymentForm.method === 'klarna'"
                    (click)="paymentForm.method = 'klarna'"
                  >
                    <span class="klarna-text">Klarna</span>
                  </button>
                </div>

                @if (paymentForm.method === 'card') {
                  <div class="form-section">
                    <v-form-field
                      type="text"
                      label="Card Number"
                      [required]="true"
                      [(ngModel)]="paymentForm.cardNumber"
                      autocomplete="cc-number"
                      testId="checkout-card-number"
                    />
                    <div class="form-row">
                      <v-form-field
                        type="text"
                        label="Expiration (MM/YY)"
                        [required]="true"
                        [(ngModel)]="paymentForm.expiryDate"
                        autocomplete="cc-exp"
                        testId="checkout-card-expiry"
                      />
                      <v-form-field
                        type="text"
                        label="CVV"
                        [required]="true"
                        [(ngModel)]="paymentForm.cvv"
                        autocomplete="cc-csc"
                        testId="checkout-card-cvv"
                      />
                    </div>
                    <v-form-field
                      type="text"
                      label="Cardholder Name"
                      [required]="true"
                      [(ngModel)]="paymentForm.cardholderName"
                      autocomplete="cc-name"
                      testId="checkout-card-name"
                    />
                  </div>

                  <div class="card-icons">
                    <span class="card-icon">VISA</span>
                    <span class="card-icon">MC</span>
                    <span class="card-icon">AMEX</span>
                    <span class="card-icon">DISC</span>
                  </div>
                }

                @if (paymentForm.method === 'paypal') {
                  <div class="alt-payment-info">
                    <p>You will be redirected to PayPal to complete your purchase.</p>
                  </div>
                }

                @if (paymentForm.method === 'klarna') {
                  <div class="alt-payment-info">
                    <p>Pay in 4 interest-free payments with Klarna.</p>
                  </div>
                }

                <button
                  class="continue-btn"
                  [disabled]="!isPaymentFormValid()"
                  (click)="savePayment()"
                  data-testid="checkout-payment-continue"
                >
                  Save & Continue
                </button>
              </div>
            </v-checkout-step>

            <!-- Step 3: Review -->
            <v-checkout-step
              [stepNumber]="3"
              title="Review & Place Order"
              [status]="getStepStatus('review')"
              testId="checkout-step-review"
            >
              <div class="step-form">
                <div class="review-section">
                  <div class="review-header">
                    <span class="review-title">Shipping Address</span>
                    <button class="edit-btn" (click)="editStep('delivery')">Edit</button>
                  </div>
                  <div class="review-content">
                    {{ deliveryForm.firstName }} {{ deliveryForm.lastName }}<br/>
                    {{ deliveryForm.address1 }}
                    @if (deliveryForm.address2) {
                      , {{ deliveryForm.address2 }}
                    }<br/>
                    {{ deliveryForm.city }}, {{ deliveryForm.state }} {{ deliveryForm.zipCode }}<br/>
                    {{ deliveryForm.country === 'US' ? 'United States' : 'Canada' }}
                  </div>
                </div>

                <div class="review-section">
                  <div class="review-header">
                    <span class="review-title">Shipping Method</span>
                    <button class="edit-btn" (click)="editStep('delivery')">Edit</button>
                  </div>
                  <div class="review-content">
                    {{ selectedShipping()?.name }} ({{ selectedShipping()?.price === 0 ? 'Free' : (selectedShipping()?.price | currency) }})
                    - {{ checkoutService.getEstimatedDeliveryDate() }}
                  </div>
                </div>

                <div class="review-section">
                  <div class="review-header">
                    <span class="review-title">Payment Method</span>
                    <button class="edit-btn" (click)="editStep('payment')">Edit</button>
                  </div>
                  <div class="review-content">
                    @if (paymentForm.method === 'card') {
                      Card ending in {{ getLastFourDigits() }}
                    } @else if (paymentForm.method === 'paypal') {
                      PayPal
                    } @else {
                      Klarna
                    }
                  </div>
                </div>

                <button
                  class="place-order-btn"
                  [disabled]="checkoutService.isProcessing()"
                  (click)="placeOrder()"
                  data-testid="checkout-place-order"
                >
                  @if (checkoutService.isProcessing()) {
                    <span class="loading-spinner"></span>
                    Processing...
                  } @else {
                    Place Order
                  }
                </button>

                <p class="terms">
                  By placing this order, you agree to our
                  <a href="/terms">Terms of Use</a> and
                  <a href="/privacy">Privacy Policy</a>
                </p>
              </div>
            </v-checkout-step>
          </section>

          <!-- Order Summary -->
          <aside class="order-summary">
            <h2 class="summary-title">
              Your Order
              <span class="summary-count">{{ cartService.itemCount() }} items</span>
            </h2>

            <div class="summary-items">
              @for (item of cartService.items(); track item.cartItemId) {
                <div class="summary-item">
                  <div class="summary-item-image">
                    @if (item.imageUrl) {
                      <img [src]="item.imageUrl" [alt]="item.name" />
                    } @else {
                      <svg width="60" height="60" viewBox="0 0 60 60" fill="#ccc">
                        <rect x="8" y="15" width="44" height="30" rx="3"/>
                        <circle cx="20" cy="42" r="6"/>
                        <circle cx="40" cy="42" r="6"/>
                      </svg>
                    }
                  </div>
                  <div class="summary-item-details">
                    <span class="summary-item-name">{{ item.name }}</span>
                    <span class="summary-item-options">
                      {{ item.color }} | Size: {{ item.size }} | Qty: {{ item.quantity }}
                    </span>
                  </div>
                  <span class="summary-item-price">{{ item.price * item.quantity | currency }}</span>
                </div>
              }
            </div>

            <div class="summary-rows">
              <div class="summary-row">
                <span>Subtotal</span>
                <span>{{ cartService.subtotal() | currency }}</span>
              </div>
              <div class="summary-row">
                <span>Shipping</span>
                <span>{{ selectedShipping()?.price === 0 ? 'Free' : (selectedShipping()?.price | currency) }}</span>
              </div>
              <div class="summary-row">
                <span>Estimated Tax</span>
                <span>{{ checkoutService.calculateTax(cartService.subtotal()) | currency }}</span>
              </div>
              @if (cartService.promoDiscount() > 0) {
                <div class="summary-row summary-row--discount">
                  <span>Discount</span>
                  <span>-{{ cartService.promoDiscount() | currency }}</span>
                </div>
              }
              <div class="summary-row summary-row--total">
                <span>Total</span>
                <span>{{ checkoutService.calculateTotal() | currency }}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .checkout-page {
      min-height: 100vh;
      background-color: #ffffff;
    }

    /* Header */
    .checkout-header {
      background: #ffffff;
      border-bottom: 1px solid #e5e5e5;
      padding: 16px 48px;
      display: flex;
      justify-content: space-between;
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

    .header-right {
      display: flex;
      gap: 24px;
      align-items: center;
      font-size: 14px;
    }

    .help-link {
      color: #111111;
      text-decoration: none;
    }

    .help-link:hover {
      text-decoration: underline;
    }

    .secure-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #707070;
    }

    /* Main Content */
    .checkout-main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 24px;
    }

    .checkout-container {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 48px;
    }

    .checkout-title {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 28px;
      font-weight: 500;
      color: #111111;
      margin: 0 0 32px;
    }

    /* Form Styles */
    .step-form {
      max-width: 500px;
    }

    .sign-in-link {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #707070;
      margin: 0 0 24px;
    }

    .sign-in-link a {
      color: #111111;
    }

    .form-section {
      margin-bottom: 24px;
    }

    .form-section-title {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 16px;
      font-weight: 500;
      color: #111111;
      margin: 0 0 16px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-group {
      position: relative;
    }

    .form-select {
      width: 100%;
      padding: 20px 12px 8px;
      border: 1px solid #e5e5e5;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 16px;
      color: #111111;
      background: #ffffff;
      appearance: none;
      cursor: pointer;
    }

    .form-select:focus {
      outline: none;
      border-color: #111111;
    }

    .select-label {
      position: absolute;
      left: 12px;
      top: 12px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 12px;
      color: #707070;
      pointer-events: none;
    }

    v-form-field {
      margin-bottom: 16px;
    }

    /* Shipping Options */
    .shipping-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border: 1px solid #e5e5e5;
      margin-bottom: 8px;
      cursor: pointer;
      transition: border-color 0.2s ease, background-color 0.2s ease;
    }

    .shipping-option--selected {
      border-color: #111111;
      background: #f5f5f5;
    }

    .shipping-option input[type="radio"] {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    .shipping-details {
      flex: 1;
    }

    .shipping-name {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #111111;
      display: block;
    }

    .shipping-time {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 12px;
      color: #707070;
    }

    .shipping-price {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #111111;
    }

    /* Checkbox */
    .checkbox-group {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin: 16px 0 24px;
    }

    .checkbox-group input[type="checkbox"] {
      width: 20px;
      height: 20px;
      margin-top: 2px;
      cursor: pointer;
    }

    .checkbox-group label {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #111111;
      cursor: pointer;
    }

    /* Payment Methods */
    .payment-methods {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
    }

    .payment-method {
      flex: 1;
      padding: 16px;
      border: 1px solid #e5e5e5;
      background: #ffffff;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      transition: border-color 0.2s ease, background-color 0.2s ease;
    }

    .payment-method--selected {
      border-color: #111111;
      background: #f5f5f5;
    }

    .payment-icon {
      width: 32px;
      height: 32px;
    }

    .paypal-text {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-weight: bold;
      background: linear-gradient(90deg, #003087 0%, #003087 50%, #009cde 50%, #009cde 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .klarna-text {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-weight: bold;
      color: #ffb3c7;
    }

    .card-icons {
      display: flex;
      gap: 8px;
      justify-content: center;
      margin: 16px 0 24px;
    }

    .card-icon {
      width: 40px;
      padding: 4px 8px;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 10px;
      font-weight: bold;
      color: #111111;
      text-align: center;
    }

    .alt-payment-info {
      padding: 24px;
      background: #f5f5f5;
      text-align: center;
      margin-bottom: 24px;
    }

    .alt-payment-info p {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #707070;
      margin: 0;
    }

    /* Continue Button */
    .continue-btn {
      width: 100%;
      padding: 18px;
      background: #111111;
      color: #ffffff;
      border: none;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .continue-btn:hover:not(:disabled) {
      background: #333333;
    }

    .continue-btn:disabled {
      background: #cccccc;
      cursor: not-allowed;
    }

    /* Review Section */
    .review-section {
      background: #f5f5f5;
      padding: 16px;
      margin-bottom: 16px;
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .review-title {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #111111;
    }

    .edit-btn {
      background: none;
      border: none;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #111111;
      text-decoration: underline;
      cursor: pointer;
    }

    .review-content {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #707070;
      line-height: 1.5;
    }

    /* Place Order Button */
    .place-order-btn {
      width: 100%;
      padding: 18px;
      background: #111111;
      color: #ffffff;
      border: none;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 18px;
      font-weight: 500;
      cursor: pointer;
      margin-top: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: background-color 0.2s ease;
    }

    .place-order-btn:hover:not(:disabled) {
      background: #333333;
    }

    .place-order-btn:disabled {
      background: #666666;
      cursor: wait;
    }

    .loading-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .terms {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 12px;
      color: #707070;
      text-align: center;
      margin-top: 16px;
    }

    .terms a {
      color: #111111;
    }

    /* Order Summary */
    .order-summary {
      position: sticky;
      top: 40px;
      background: #f5f5f5;
      padding: 24px;
      align-self: start;
    }

    .summary-title {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 22px;
      font-weight: 500;
      color: #111111;
      margin: 0 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .summary-count {
      font-size: 14px;
      font-weight: 400;
      color: #707070;
    }

    .summary-items {
      max-height: 300px;
      overflow-y: auto;
      margin-bottom: 24px;
    }

    .summary-item {
      display: flex;
      gap: 16px;
      padding: 16px 0;
      border-bottom: 1px solid #e5e5e5;
    }

    .summary-item:last-child {
      border-bottom: none;
    }

    .summary-item-image {
      width: 80px;
      height: 80px;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .summary-item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .summary-item-details {
      flex: 1;
      min-width: 0;
    }

    .summary-item-name {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #111111;
      display: block;
      margin-bottom: 4px;
    }

    .summary-item-options {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 12px;
      color: #707070;
    }

    .summary-item-price {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #111111;
      flex-shrink: 0;
    }

    .summary-rows {
      border-top: 1px solid #e5e5e5;
      padding-top: 16px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #111111;
    }

    .summary-row--discount {
      color: #128a09;
    }

    .summary-row--total {
      font-size: 18px;
      font-weight: 500;
      padding-top: 16px;
      border-top: 1px solid #ccc;
      margin-top: 16px;
    }

    /* Responsive */
    @media (max-width: 900px) {
      .checkout-container {
        grid-template-columns: 1fr;
      }

      .order-summary {
        position: static;
        order: -1;
      }

      .payment-methods {
        flex-direction: column;
      }
    }

    @media (max-width: 600px) {
      .checkout-header {
        padding: 16px;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `],
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
    return true; // PayPal and Klarna don't need card details
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
