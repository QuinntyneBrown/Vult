// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable, computed, signal } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { Cart, CartItem, PromoCodeResult } from '../models/cart';
import { Product } from '../models/product';
import { Observable, of, delay, BehaviorSubject } from 'rxjs';

const CART_STORAGE_KEY = 'vult_cart';
const CART_EXPIRY_DAYS = 30;

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSignal = signal<Cart>(this.loadCart());

  // Observables for components that prefer RxJS
  private cartSubject = new BehaviorSubject<Cart>(this.loadCart());
  public cart$ = this.cartSubject.asObservable();

  // Computed signals for derived state
  public readonly cart = this.cartSignal.asReadonly();
  public readonly items = computed(() => this.cartSignal().items);
  public readonly itemCount = computed(() => this.cartSignal().itemCount);
  public readonly subtotal = computed(() => this.cartSignal().subtotal);
  public readonly isEmpty = computed(() => this.cartSignal().items.length === 0);
  public readonly promoDiscount = computed(() => this.cartSignal().promoDiscount ?? 0);
  public readonly total = computed(() => this.subtotal() - this.promoDiscount());

  // Notification state for mini cart
  private lastAddedItemSubject = new BehaviorSubject<CartItem | null>(null);
  public lastAddedItem$ = this.lastAddedItemSubject.asObservable();

  constructor(private localStorage: LocalStorageService) {
    // Sync signal changes to BehaviorSubject
    this.syncCartToSubject();
  }

  private syncCartToSubject(): void {
    // Initial sync
    this.cartSubject.next(this.cartSignal());
  }

  private loadCart(): Cart {
    const stored = this.localStorage.get<{ cart: Cart; expiresAt: string }>(CART_STORAGE_KEY);

    if (stored) {
      const expiresAt = new Date(stored.expiresAt);
      if (expiresAt > new Date()) {
        return stored.cart;
      }
      // Cart expired, clear it
      this.localStorage.remove(CART_STORAGE_KEY);
    }

    return this.createEmptyCart();
  }

  private createEmptyCart(): Cart {
    return {
      items: [],
      subtotal: 0,
      itemCount: 0,
      lastUpdated: new Date().toISOString()
    };
  }

  private saveCart(cart: Cart): void {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + CART_EXPIRY_DAYS);

    this.localStorage.set(CART_STORAGE_KEY, {
      cart: { ...cart, lastUpdated: new Date().toISOString() },
      expiresAt: expiresAt.toISOString()
    });

    this.cartSignal.set(cart);
    this.cartSubject.next(cart);
  }

  private calculateSubtotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  private calculateItemCount(items: CartItem[]): number {
    return items.reduce((count, item) => count + item.quantity, 0);
  }

  private generateCartItemId(): string {
    return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  addItem(
    product: Product,
    color: string,
    colorId: string,
    size: string,
    sizeId: string,
    quantity: number = 1
  ): void {
    const currentCart = this.cartSignal();
    const existingItemIndex = currentCart.items.findIndex(
      item => item.productId === product.productId &&
              item.colorId === colorId &&
              item.sizeId === sizeId
    );

    let updatedItems: CartItem[];
    let addedItem: CartItem;

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      updatedItems = currentCart.items.map((item, index) => {
        if (index === existingItemIndex) {
          const newQuantity = Math.min(item.quantity + quantity, item.maxQuantity);
          addedItem = { ...item, quantity: newQuantity };
          return addedItem;
        }
        return item;
      });
      addedItem = updatedItems[existingItemIndex];
    } else {
      // Add new item
      const primaryImage = product.productImages?.[0];
      addedItem = {
        cartItemId: this.generateCartItemId(),
        productId: product.productId,
        name: product.name ?? 'Unknown Product',
        subtitle: this.getProductSubtitle(product),
        imageUrl: primaryImage?.url ?? primaryImage?.imageData ?? '',
        color,
        colorId,
        size,
        sizeId,
        price: product.estimatedMSRP ?? 0,
        originalPrice: product.estimatedResaleValue,
        quantity,
        maxQuantity: 10,
        isLowStock: false,
        addedAt: new Date().toISOString()
      };
      updatedItems = [...currentCart.items, addedItem];
    }

    const newCart: Cart = {
      ...currentCart,
      items: updatedItems,
      subtotal: this.calculateSubtotal(updatedItems),
      itemCount: this.calculateItemCount(updatedItems)
    };

    this.saveCart(newCart);
    this.lastAddedItemSubject.next(addedItem);
  }

  private getProductSubtitle(product: Product): string {
    const genderLabels: Record<number, string> = {
      0: "Men's",
      1: "Women's",
      2: "Unisex"
    };
    const itemTypeLabels: Record<number, string> = {
      0: 'Shoes',
      1: 'Pants',
      2: 'Jacket',
      3: 'Shirt',
      4: 'Shorts',
      5: 'Dress',
      6: 'Skirt',
      7: 'Sweater',
      8: 'Hoodie',
      9: 'Coat',
      10: 'Bag',
      11: 'Accessories',
      12: 'Hat',
      13: 'Book'
    };

    const gender = product.gender !== undefined ? genderLabels[product.gender] : '';
    const itemType = product.itemType !== undefined ? itemTypeLabels[product.itemType] : '';

    return [gender, itemType].filter(Boolean).join(' ');
  }

  updateQuantity(cartItemId: string, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(cartItemId);
      return;
    }

    const currentCart = this.cartSignal();
    const updatedItems = currentCart.items.map(item => {
      if (item.cartItemId === cartItemId) {
        return { ...item, quantity: Math.min(quantity, item.maxQuantity) };
      }
      return item;
    });

    const newCart: Cart = {
      ...currentCart,
      items: updatedItems,
      subtotal: this.calculateSubtotal(updatedItems),
      itemCount: this.calculateItemCount(updatedItems)
    };

    this.saveCart(newCart);
  }

  removeItem(cartItemId: string): void {
    const currentCart = this.cartSignal();
    const updatedItems = currentCart.items.filter(item => item.cartItemId !== cartItemId);

    const newCart: Cart = {
      ...currentCart,
      items: updatedItems,
      subtotal: this.calculateSubtotal(updatedItems),
      itemCount: this.calculateItemCount(updatedItems)
    };

    this.saveCart(newCart);
  }

  clearCart(): void {
    this.localStorage.remove(CART_STORAGE_KEY);
    const emptyCart = this.createEmptyCart();
    this.cartSignal.set(emptyCart);
    this.cartSubject.next(emptyCart);
  }

  applyPromoCode(code: string): Observable<PromoCodeResult> {
    // MVP: Mock promo code validation
    // In a real implementation, this would call an API
    const validCodes: Record<string, { discount: number; percent?: number }> = {
      'SAVE10': { discount: 0, percent: 10 },
      'SAVE20': { discount: 0, percent: 20 },
      'FREESHIP': { discount: 8, percent: undefined }
    };

    return of(null).pipe(
      delay(500),
      () => {
        const promo = validCodes[code.toUpperCase()];

        if (promo) {
          const currentCart = this.cartSignal();
          let discountAmount = promo.discount;

          if (promo.percent) {
            discountAmount = (currentCart.subtotal * promo.percent) / 100;
          }

          const updatedCart: Cart = {
            ...currentCart,
            promoCode: code.toUpperCase(),
            promoDiscount: discountAmount
          };

          this.saveCart(updatedCart);

          return of<PromoCodeResult>({
            isValid: true,
            discountAmount,
            discountPercent: promo.percent,
            message: promo.percent
              ? `${promo.percent}% discount applied!`
              : `$${discountAmount.toFixed(2)} discount applied!`
          });
        }

        return of<PromoCodeResult>({
          isValid: false,
          discountAmount: 0,
          message: 'Invalid promo code'
        });
      }
    );
  }

  removePromoCode(): void {
    const currentCart = this.cartSignal();
    const updatedCart: Cart = {
      ...currentCart,
      promoCode: undefined,
      promoDiscount: undefined
    };
    this.saveCart(updatedCart);
  }

  dismissNotification(): void {
    this.lastAddedItemSubject.next(null);
  }

  getItem(cartItemId: string): CartItem | undefined {
    return this.cartSignal().items.find(item => item.cartItemId === cartItemId);
  }
}
