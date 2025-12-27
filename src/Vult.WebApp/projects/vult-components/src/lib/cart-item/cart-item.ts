import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuantitySelector } from '../quantity-selector/quantity-selector';

export interface CartItemData {
  cartItemId: string;
  productId: string;
  name: string;
  subtitle: string;
  imageUrl: string;
  color: string;
  size: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  maxQuantity: number;
  isLowStock: boolean;
}

@Component({
  selector: 'v-cart-item',
  standalone: true,
  imports: [CommonModule, QuantitySelector],
  template: `
    <article class="cart-item" [attr.data-testid]="testId">
      <div class="item-image">
        @if (item.imageUrl) {
          <img [src]="item.imageUrl" [alt]="item.name" loading="lazy" />
        } @else {
          <svg width="80" height="80" viewBox="0 0 80 80" fill="#ccc">
            <rect x="10" y="20" width="60" height="40" rx="4"/>
            <circle cx="25" cy="55" r="8"/>
            <circle cx="55" cy="55" r="8"/>
          </svg>
        }
      </div>

      <div class="item-details">
        <div class="item-header">
          <a class="item-name" [href]="'/product/' + item.productId" (click)="onProductClick($event)">
            {{ item.name }}
          </a>
          <div class="item-price-container">
            <span class="item-price" [class.item-price--sale]="item.originalPrice">
              {{ item.price | currency }}
            </span>
            @if (item.originalPrice) {
              <span class="item-original-price">{{ item.originalPrice | currency }}</span>
            }
          </div>
        </div>

        @if (item.subtitle) {
          <div class="item-subtitle">{{ item.subtitle }}</div>
        }

        <div class="item-options">{{ item.color }} | Size: {{ item.size }}</div>

        @if (item.isLowStock) {
          <div class="low-stock-warning">Just a Few Left - Order Now</div>
        }

        <v-quantity-selector
          [quantity]="item.quantity"
          [maxQuantity]="item.maxQuantity"
          [testId]="testId + '-quantity'"
          (quantityChange)="onQuantityChange($event)"
        />

        <div class="item-actions">
          <button
            class="action-btn"
            [attr.data-testid]="testId + '-remove'"
            (click)="onRemove()"
          >
            Remove
          </button>
          @if (showFavoritesButton) {
            <button
              class="action-btn"
              [attr.data-testid]="testId + '-favorite'"
              (click)="onMoveToFavorites()"
            >
              Move to Favorites
            </button>
          }
        </div>
      </div>
    </article>
  `,
  styles: [`
    .cart-item {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 24px;
      padding: 24px 0;
      border-bottom: 1px solid #e5e5e5;
    }

    .cart-item:last-child {
      border-bottom: none;
    }

    .item-image {
      width: 150px;
      height: 150px;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-details {
      display: flex;
      flex-direction: column;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .item-name {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 16px;
      font-weight: 500;
      color: #111111;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .item-name:hover {
      color: #707070;
    }

    .item-price-container {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2px;
    }

    .item-price {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 16px;
      font-weight: 500;
      color: #111111;
    }

    .item-price--sale {
      color: #9e3500;
    }

    .item-original-price {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #707070;
      text-decoration: line-through;
    }

    .item-subtitle {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #707070;
      margin-bottom: 4px;
    }

    .item-options {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #707070;
      margin-bottom: 12px;
    }

    .low-stock-warning {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 12px;
      font-weight: 500;
      color: #d43f21;
      margin-bottom: 12px;
    }

    .item-actions {
      display: flex;
      gap: 16px;
      margin-top: auto;
      padding-top: 16px;
    }

    .action-btn {
      background: none;
      border: none;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #707070;
      text-decoration: underline;
      cursor: pointer;
      padding: 0;
      transition: color 0.2s ease;
    }

    .action-btn:hover {
      color: #111111;
    }

    .action-btn:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    @media (max-width: 600px) {
      .cart-item {
        grid-template-columns: 100px 1fr;
        gap: 16px;
      }

      .item-image {
        width: 100px;
        height: 100px;
      }

      .item-header {
        flex-direction: column;
        gap: 4px;
      }

      .item-price-container {
        align-items: flex-start;
        flex-direction: row;
        gap: 8px;
      }

      .item-actions {
        flex-direction: column;
        gap: 8px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItem {
  @Input({ required: true }) item!: CartItemData;
  @Input() showFavoritesButton = true;
  @Input() testId = 'cart-item';

  @Output() quantityChange = new EventEmitter<{ cartItemId: string; quantity: number }>();
  @Output() remove = new EventEmitter<string>();
  @Output() moveToFavorites = new EventEmitter<string>();
  @Output() productClick = new EventEmitter<string>();

  onQuantityChange(quantity: number): void {
    this.quantityChange.emit({ cartItemId: this.item.cartItemId, quantity });
  }

  onRemove(): void {
    this.remove.emit(this.item.cartItemId);
  }

  onMoveToFavorites(): void {
    this.moveToFavorites.emit(this.item.cartItemId);
  }

  onProductClick(event: Event): void {
    event.preventDefault();
    this.productClick.emit(this.item.productId);
  }
}
