import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromoCodeInput } from '../promo-code-input/promo-code-input.component';

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
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.scss',
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
