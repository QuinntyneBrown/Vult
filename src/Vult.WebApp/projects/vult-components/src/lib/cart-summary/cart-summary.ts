import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromoCodeInput } from '../promo-code-input/promo-code-input';

export interface CartSummaryData {
  subtotal: number;
  shipping: number | 'free' | 'calculated';
  tax: number | 'calculated';
  discount?: number;
  promoCode?: string;
  total?: number;
}

@Component({
  selector: 'v-cart-summary',
  standalone: true,
  imports: [CommonModule, PromoCodeInput],
  template: `
    <aside class="cart-summary" [attr.data-testid]="testId">
      <h2 class="summary-title">{{ title }}</h2>

      <div class="summary-rows">
        <div class="summary-row">
          <span>Subtotal</span>
          <span>{{ data.subtotal | currency }}</span>
        </div>

        <div class="summary-row">
          <span>Estimated Shipping</span>
          <span>
            @if (data.shipping === 'free') {
              Free
            } @else if (data.shipping === 'calculated') {
              -
            } @else {
              {{ data.shipping | currency }}
            }
          </span>
        </div>

        <div class="summary-row">
          <span>Estimated Tax</span>
          <span>
            @if (data.tax === 'calculated') {
              -
            } @else {
              {{ data.tax | currency }}
            }
          </span>
        </div>

        @if (data.discount && data.discount > 0) {
          <div class="summary-row summary-row--discount">
            <span>
              Discount
              @if (data.promoCode) {
                ({{ data.promoCode }})
              }
            </span>
            <span>-{{ data.discount | currency }}</span>
          </div>
        }

        <div class="summary-row summary-row--total">
          <span>Total</span>
          <span>{{ calculatedTotal | currency }}</span>
        </div>
      </div>

      @if (showPromoCode) {
        <v-promo-code-input
          [appliedCode]="data.promoCode || ''"
          [isLoading]="isPromoLoading"
          [error]="promoError"
          [testId]="testId + '-promo'"
          (apply)="onApplyPromo($event)"
          (remove)="onRemovePromo()"
        />
      }

      @if (showCheckoutButton) {
        <button
          class="checkout-btn"
          [disabled]="checkoutDisabled"
          [attr.data-testid]="testId + '-checkout-btn'"
          (click)="onCheckout()"
        >
          {{ checkoutButtonText }}
        </button>
      }

      @if (showPayPalButton) {
        <button
          class="paypal-btn"
          [attr.data-testid]="testId + '-paypal-btn'"
          (click)="onPayPalClick()"
        >
          <svg class="paypal-logo" viewBox="0 0 80 20">
            <text x="0" y="16" font-family="Arial" font-size="14" font-weight="bold" fill="#003087">Pay</text>
            <text x="25" y="16" font-family="Arial" font-size="14" font-weight="bold" fill="#009cde">Pal</text>
          </svg>
        </button>
      }

      @if (deliveryEstimate) {
        <div class="delivery-info">
          <p><strong>Estimated Delivery:</strong> {{ deliveryEstimate }}</p>
        </div>
      }

      @if (freeShippingMessage) {
        <div class="free-shipping-message" [class.free-shipping-message--qualified]="freeShippingQualified">
          @if (freeShippingQualified) {
            You qualify for <strong>FREE Shipping!</strong>
          } @else {
            {{ freeShippingMessage }}
          }
        </div>
      }
    </aside>
  `,
  styles: [`
    .cart-summary {
      background: #ffffff;
      padding: 24px;
    }

    .summary-title {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 22px;
      font-weight: 500;
      color: #111111;
      margin: 0 0 24px;
    }

    .summary-rows {
      margin-bottom: 24px;
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
      font-size: 16px;
      font-weight: 500;
      padding-top: 16px;
      border-top: 1px solid #e5e5e5;
      margin-top: 16px;
    }

    .checkout-btn {
      width: 100%;
      padding: 18px;
      background: #111111;
      color: #ffffff;
      border: none;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      margin-bottom: 12px;
      transition: background-color 0.2s ease;
    }

    .checkout-btn:hover:not(:disabled) {
      background: #333333;
    }

    .checkout-btn:disabled {
      background: #cccccc;
      cursor: not-allowed;
    }

    .checkout-btn:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .paypal-btn {
      width: 100%;
      padding: 18px;
      background: #ffc439;
      color: #111111;
      border: none;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s ease;
    }

    .paypal-btn:hover {
      background: #f0b800;
    }

    .paypal-btn:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .paypal-logo {
      width: 80px;
      height: 20px;
    }

    .delivery-info {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e5e5e5;
    }

    .delivery-info p {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 12px;
      color: #707070;
      margin: 0 0 8px;
    }

    .free-shipping-message {
      background: #f5f5f5;
      padding: 12px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 12px;
      text-align: center;
      margin-top: 16px;
      color: #707070;
    }

    .free-shipping-message--qualified {
      background: #e8f5e9;
      color: #128a09;
    }

    @media (prefers-reduced-motion: reduce) {
      .checkout-btn,
      .paypal-btn {
        transition: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSummary {
  @Input({ required: true }) data!: CartSummaryData;
  @Input() title = 'Summary';
  @Input() showPromoCode = true;
  @Input() showCheckoutButton = true;
  @Input() showPayPalButton = true;
  @Input() checkoutButtonText = 'Checkout';
  @Input() checkoutDisabled = false;
  @Input() deliveryEstimate = '';
  @Input() freeShippingMessage = '';
  @Input() freeShippingQualified = false;
  @Input() isPromoLoading = false;
  @Input() promoError = '';
  @Input() testId = 'cart-summary';

  @Output() checkout = new EventEmitter<void>();
  @Output() payPalClick = new EventEmitter<void>();
  @Output() promoApply = new EventEmitter<string>();
  @Output() promoRemove = new EventEmitter<void>();

  get calculatedTotal(): number {
    if (this.data.total !== undefined) {
      return this.data.total;
    }

    let total = this.data.subtotal;

    if (typeof this.data.shipping === 'number') {
      total += this.data.shipping;
    }

    if (typeof this.data.tax === 'number') {
      total += this.data.tax;
    }

    if (this.data.discount) {
      total -= this.data.discount;
    }

    return Math.max(0, total);
  }

  onCheckout(): void {
    this.checkout.emit();
  }

  onPayPalClick(): void {
    this.payPalClick.emit();
  }

  onApplyPromo(code: string): void {
    this.promoApply.emit(code);
  }

  onRemovePromo(): void {
    this.promoRemove.emit();
  }
}
