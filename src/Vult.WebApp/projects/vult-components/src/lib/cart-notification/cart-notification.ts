import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

export interface CartNotificationItem {
  name: string;
  subtitle: string;
  imageUrl: string;
  color: string;
  size: string;
  price: number;
}

export interface CartNotificationData {
  item: CartNotificationItem;
  itemCount?: number;
  variant?: 'dropdown' | 'corner';
  cartUrl?: string;
  checkoutUrl?: string;
  freeShippingMessage?: string;
  autoDismiss?: boolean;
  autoDismissDelay?: number;
}

export type CartNotificationResult = 'close' | 'viewBag' | 'checkout';

@Component({
  selector: 'v-cart-notification',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './cart-notification.html',
  styleUrl: './cart-notification.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartNotification implements OnInit, OnDestroy {
  private readonly dialogRef = inject(MatDialogRef<CartNotification, CartNotificationResult>);
  readonly data: CartNotificationData = inject(MAT_DIALOG_DATA);

  readonly item = this.data.item;
  readonly itemCount = this.data.itemCount ?? 1;
  readonly variant = this.data.variant ?? 'dropdown';
  readonly cartUrl = this.data.cartUrl ?? '/cart';
  readonly checkoutUrl = this.data.checkoutUrl ?? '/checkout';
  readonly freeShippingMessage = this.data.freeShippingMessage ?? 'Free shipping on orders over $50';
  readonly autoDismiss = this.data.autoDismiss ?? true;
  readonly autoDismissDelay = this.data.autoDismissDelay ?? 4000;

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
    this.dialogRef.close('close');
  }

  onViewBag(event: Event): void {
    event.preventDefault();
    this.dialogRef.close('viewBag');
  }

  onCheckout(event: Event): void {
    event.preventDefault();
    this.dialogRef.close('checkout');
  }
}
