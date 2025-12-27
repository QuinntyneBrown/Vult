import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuantitySelector } from '../quantity-selector/quantity-selector.component';

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
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
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
