import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CartNotification, CartNotificationData, CartNotificationResult } from './cart-notification';

export interface CartNotificationOptions extends Partial<CartNotificationData> {
  position?: 'top-right' | 'top-center' | 'dropdown';
}

@Injectable({
  providedIn: 'root'
})
export class CartNotificationService {
  private readonly dialog = inject(MatDialog);
  private activeDialogRef: MatDialogRef<CartNotification, CartNotificationResult> | null = null;

  open(data: CartNotificationData, options?: CartNotificationOptions): MatDialogRef<CartNotification, CartNotificationResult> {
    // Close any existing notification
    this.close();

    const position = options?.position ?? 'top-right';
    const variant = data.variant ?? (position === 'dropdown' ? 'dropdown' : 'corner');

    const dialogConfig: MatDialogConfig<CartNotificationData> = {
      data: { ...data, variant },
      hasBackdrop: variant === 'dropdown',
      backdropClass: 'cart-notification-backdrop',
      panelClass: this.getPanelClasses(variant, position),
      position: this.getDialogPosition(position),
      width: variant === 'dropdown' ? '400px' : '320px',
      maxWidth: '95vw',
      autoFocus: false,
      restoreFocus: false,
    };

    this.activeDialogRef = this.dialog.open(CartNotification, dialogConfig);

    this.activeDialogRef.afterClosed().subscribe(() => {
      this.activeDialogRef = null;
    });

    return this.activeDialogRef;
  }

  close(): void {
    if (this.activeDialogRef) {
      this.activeDialogRef.close('close');
      this.activeDialogRef = null;
    }
  }

  afterClosed(): Observable<CartNotificationResult | undefined> | null {
    return this.activeDialogRef?.afterClosed() ?? null;
  }

  private getPanelClasses(variant: 'dropdown' | 'corner', position: string): string[] {
    const classes = ['cart-notification-panel'];

    if (variant === 'corner') {
      classes.push('cart-notification-panel--corner');
    }

    if (position === 'top-right') {
      classes.push('cart-notification-panel--top-right');
    } else if (position === 'top-center') {
      classes.push('cart-notification-panel--top-center');
    }

    return classes;
  }

  private getDialogPosition(position: string): MatDialogConfig['position'] {
    switch (position) {
      case 'top-right':
        return { top: '80px', right: '20px' };
      case 'top-center':
        return { top: '80px' };
      case 'dropdown':
      default:
        return { top: '60px', right: '0' };
    }
  }
}
