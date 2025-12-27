import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CartNotificationItem {
  name: string;
  subtitle: string;
  imageUrl: string;
  color: string;
  size: string;
  price: number;
}

@Component({
  selector: 'v-cart-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isVisible) {
      <div
        class="cart-notification"
        [class.cart-notification--corner]="variant === 'corner'"
        role="dialog"
        aria-label="Added to bag notification"
        [attr.data-testid]="testId"
      >
        <!-- Header -->
        <div class="notification-header" [class.notification-header--dark]="variant === 'corner'">
          <div class="notification-title">
            <span class="success-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            Added to Bag
          </div>
          @if (variant === 'dropdown') {
            <button class="close-btn" aria-label="Close notification" (click)="onClose()">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 5L5 15M5 5l10 10"/>
              </svg>
            </button>
          }
        </div>

        <!-- Content -->
        <div class="notification-content">
          <div class="added-item">
            <div class="added-item-image">
              @if (item.imageUrl) {
                <img [src]="item.imageUrl" [alt]="item.name" />
              } @else {
                <svg width="50" height="50" viewBox="0 0 50 50" fill="#ccc">
                  <rect x="5" y="12" width="40" height="26" rx="3"/>
                  <circle cx="15" cy="35" r="5"/>
                  <circle cx="35" cy="35" r="5"/>
                </svg>
              }
            </div>
            <div class="added-item-details">
              <div class="added-item-name">{{ item.name }}</div>
              @if (item.subtitle) {
                <div class="added-item-subtitle">{{ item.subtitle }}</div>
              }
              <div class="added-item-options">{{ item.color }} | Size: {{ item.size }}</div>
              @if (variant === 'dropdown') {
                <div class="added-item-price">{{ item.price | currency }}</div>
              }
            </div>
            @if (variant === 'corner') {
              <div class="added-item-price">{{ item.price | currency }}</div>
            }
          </div>
        </div>

        <!-- Actions -->
        <div class="notification-actions">
          <a class="view-bag-btn" [href]="cartUrl" (click)="onViewBag($event)">
            View Bag @if (itemCount > 0) { ({{ itemCount }}) }
          </a>
          <a class="checkout-btn" [href]="checkoutUrl" (click)="onCheckout($event)">
            Checkout
          </a>
        </div>

        @if (variant === 'dropdown' && freeShippingMessage) {
          <div class="notification-footer">
            {{ freeShippingMessage }}
          </div>
        }

        @if (variant === 'corner' && autoDismiss) {
          <div class="progress-bar">
            <div
              class="progress-bar-fill"
              [style.animation-duration.ms]="autoDismissDelay"
            ></div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }

    .cart-notification {
      background: #ffffff;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      animation: slideDown 0.3s ease;
      z-index: 1000;
    }

    .cart-notification--corner {
      border-radius: 8px;
      overflow: hidden;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .notification-header {
      padding: 16px;
      border-bottom: 1px solid #e5e5e5;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .notification-header--dark {
      background: #111111;
      color: #ffffff;
      border-bottom: none;
    }

    .notification-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
    }

    .success-icon {
      width: 20px;
      height: 20px;
      background: #128a09;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
    }

    .success-icon svg {
      width: 12px;
      height: 12px;
    }

    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #111111;
    }

    .close-btn svg {
      width: 16px;
      height: 16px;
    }

    .notification-content {
      padding: 16px;
    }

    .added-item {
      display: flex;
      gap: 12px;
    }

    .cart-notification--corner .added-item {
      gap: 16px;
    }

    .added-item-image {
      width: 80px;
      height: 80px;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .cart-notification--corner .added-item-image {
      width: 60px;
      height: 60px;
    }

    .added-item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .added-item-details {
      flex: 1;
      min-width: 0;
    }

    .added-item-name {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #111111;
      margin-bottom: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .added-item-subtitle {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 12px;
      color: #707070;
      margin-bottom: 2px;
    }

    .added-item-options {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 12px;
      color: #707070;
    }

    .added-item-price {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #111111;
      margin-top: 4px;
    }

    .cart-notification--corner .added-item-price {
      margin-top: 0;
      flex-shrink: 0;
    }

    .notification-actions {
      padding: 16px;
      display: flex;
      gap: 12px;
      border-top: 1px solid #e5e5e5;
    }

    .cart-notification--corner .notification-actions {
      gap: 8px;
      padding: 12px 16px;
    }

    .view-bag-btn,
    .checkout-btn {
      flex: 1;
      padding: 14px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      text-align: center;
      text-decoration: none;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .cart-notification--corner .view-bag-btn,
    .cart-notification--corner .checkout-btn {
      padding: 10px;
      font-size: 12px;
    }

    .view-bag-btn {
      background: #ffffff;
      color: #111111;
      border: 1px solid #111111;
    }

    .view-bag-btn:hover {
      background: #f5f5f5;
    }

    .checkout-btn {
      background: #111111;
      color: #ffffff;
      border: none;
    }

    .checkout-btn:hover {
      background: #333333;
    }

    .notification-footer {
      padding: 12px 16px;
      background: #f5f5f5;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 12px;
      color: #707070;
      text-align: center;
    }

    .progress-bar {
      height: 3px;
      background: #e5e5e5;
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      background: #111111;
      animation: countdown linear forwards;
    }

    @keyframes countdown {
      from { width: 100%; }
      to { width: 0%; }
    }

    @media (prefers-reduced-motion: reduce) {
      .cart-notification {
        animation: none;
      }

      .progress-bar-fill {
        animation: none;
        width: 100%;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartNotification implements OnInit, OnDestroy {
  @Input({ required: true }) item!: CartNotificationItem;
  @Input() itemCount = 1;
  @Input() variant: 'dropdown' | 'corner' = 'dropdown';
  @Input() cartUrl = '/cart';
  @Input() checkoutUrl = '/checkout';
  @Input() freeShippingMessage = 'Free shipping on orders over $50';
  @Input() autoDismiss = true;
  @Input() autoDismissDelay = 4000;
  @Input() isVisible = true;
  @Input() testId = 'cart-notification';

  @Output() close = new EventEmitter<void>();
  @Output() viewBagClick = new EventEmitter<void>();
  @Output() checkoutClick = new EventEmitter<void>();

  private autoDismissTimer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    if (this.autoDismiss && this.variant === 'corner') {
      this.startAutoDismissTimer();
    }
  }

  ngOnDestroy(): void {
    this.clearAutoDismissTimer();
  }

  private startAutoDismissTimer(): void {
    this.clearAutoDismissTimer();
    this.autoDismissTimer = setTimeout(() => {
      this.onClose();
    }, this.autoDismissDelay);
  }

  private clearAutoDismissTimer(): void {
    if (this.autoDismissTimer) {
      clearTimeout(this.autoDismissTimer);
    }
  }

  onClose(): void {
    this.isVisible = false;
    this.close.emit();
  }

  onViewBag(event: Event): void {
    event.preventDefault();
    this.viewBagClick.emit();
  }

  onCheckout(event: Event): void {
    event.preventDefault();
    this.checkoutClick.emit();
  }
}
