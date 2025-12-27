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
  templateUrl: './cart-notification.html',
  styleUrl: './cart-notification.scss',
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
