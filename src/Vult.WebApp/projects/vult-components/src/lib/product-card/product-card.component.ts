import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ProductCardData {
  id: string;
  name: string;
  category?: string;
  colorCount?: number;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  hoverImageUrl?: string;
  badge?: string;
  badgeType?: 'new' | 'sale' | 'member';
  soldOut?: boolean;
  isFavorite?: boolean;
}

@Component({
  selector: 'lib-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article
      class="product-card"
      [class.product-card--sold-out]="product.soldOut"
      (click)="onCardClick($event)"
    >
      <div class="card-image-container">
        <img
          class="card-image"
          [src]="product.imageUrl"
          [alt]="product.name"
          loading="lazy"
        />
        @if (product.hoverImageUrl) {
          <img
            class="card-image-hover"
            [src]="product.hoverImageUrl"
            [alt]="product.name + ' alternate view'"
            loading="lazy"
          />
        }

        @if (product.badge) {
          <span
            class="card-badge"
            [class.sale]="product.badgeType === 'sale'"
            [class.member]="product.badgeType === 'member'"
          >
            {{ product.badge }}
          </span>
        }

        <button
          class="favorite-btn"
          [class.active]="isFavorite()"
          [attr.aria-label]="isFavorite() ? 'Remove from favorites' : 'Add to favorites'"
          [attr.aria-pressed]="isFavorite()"
          (click)="toggleFavorite($event)"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 17.5L8.79167 16.4167C4.5 12.5417 1.66667 10 1.66667 6.875C1.66667 4.34167 3.68333 2.5 6.25 2.5C7.7 2.5 9.09167 3.175 10 4.24167C10.9083 3.175 12.3 2.5 13.75 2.5C16.3167 2.5 18.3333 4.34167 18.3333 6.875C18.3333 10 15.5 12.5417 11.2083 16.425L10 17.5Z"
              [attr.fill]="isFavorite() ? '#111111' : 'none'"
              stroke="#111111"
              stroke-width="1.5"
            />
          </svg>
        </button>

        @if (product.soldOut) {
          <div class="sold-out-overlay">
            <span class="sold-out-text">Sold Out</span>
          </div>
        }
      </div>

      <div class="card-info">
        <h3 class="product-name">{{ product.name }}</h3>
        @if (product.category) {
          <p class="product-category">{{ product.category }}</p>
        }
        @if (product.colorCount && product.colorCount > 1) {
          <p class="product-colors">{{ product.colorCount }} Colors</p>
        }
        <div class="product-price-container">
          <span
            class="product-price"
            [class.sale]="product.originalPrice"
          >
            {{ product.price | currency }}
          </span>
          @if (product.originalPrice) {
            <span class="original-price">
              {{ product.originalPrice | currency }}
            </span>
          }
        </div>
      </div>
    </article>
  `,
  styles: [`
    .product-card {
      background-color: #ffffff;
      cursor: pointer;
      position: relative;
      transition: transform 0.2s ease;
    }

    .product-card:hover {
      transform: translateY(-2px);
    }

    .product-card:focus-within {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .card-image-container {
      position: relative;
      width: 100%;
      aspect-ratio: 3 / 4;
      background-color: #f5f5f5;
      overflow: hidden;
    }

    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      transition: opacity 0.2s ease;
    }

    .card-image-hover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .product-card:hover .card-image-hover {
      opacity: 1;
    }

    .favorite-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 36px;
      height: 36px;
      border: none;
      background-color: rgba(255, 255, 255, 0.9);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.2s ease, transform 0.2s ease;
      z-index: 2;
    }

    .favorite-btn:hover {
      background-color: #ffffff;
      transform: scale(1.1);
    }

    .favorite-btn:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .favorite-btn svg {
      width: 20px;
      height: 20px;
    }

    .card-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      padding: 4px 8px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 12px;
      font-weight: 500;
      background-color: #ffffff;
      color: #111111;
      z-index: 2;
    }

    .card-badge.sale {
      background-color: #9e3500;
      color: #ffffff;
    }

    .card-badge.member {
      background-color: #111111;
      color: #ffffff;
    }

    .card-info {
      padding: 12px;
    }

    .product-name {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 16px;
      font-weight: 500;
      color: #111111;
      line-height: 1.4;
      margin: 0 0 4px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-category {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #757575;
      margin: 0 0 4px;
    }

    .product-colors {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #757575;
      margin: 0 0 8px;
    }

    .product-price-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .product-price {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 16px;
      font-weight: 500;
      color: #111111;
    }

    .product-price.sale {
      color: #9e3500;
    }

    .original-price {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 16px;
      color: #757575;
      text-decoration: line-through;
      font-weight: 400;
    }

    .sold-out-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
    }

    .sold-out-text {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #111111;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .product-card--sold-out {
      cursor: default;
    }

    .product-card--sold-out:hover {
      transform: none;
    }

    @media (prefers-reduced-motion: reduce) {
      .product-card,
      .card-image,
      .card-image-hover,
      .favorite-btn {
        transition: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  @Input({ required: true }) product!: ProductCardData;

  @Output() cardClick = new EventEmitter<ProductCardData>();
  @Output() favoriteToggle = new EventEmitter<{ product: ProductCardData; isFavorite: boolean }>();

  isFavorite = signal(false);

  ngOnInit(): void {
    this.isFavorite.set(this.product.isFavorite ?? false);
  }

  onCardClick(event: Event): void {
    if (!this.product.soldOut) {
      this.cardClick.emit(this.product);
    }
  }

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    this.isFavorite.update(v => !v);
    this.favoriteToggle.emit({
      product: this.product,
      isFavorite: this.isFavorite()
    });
  }
}
