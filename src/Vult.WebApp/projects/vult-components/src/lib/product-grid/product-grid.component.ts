import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent, ProductCardData } from '../product-card/product-card.component';

@Component({
  selector: 'lib-product-grid',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    <div
      class="product-grid"
      [class.product-grid--single-column]="singleColumn"
      [class.product-grid--loading]="loading"
    >
      @if (loading) {
        @for (skeleton of skeletonCount; track $index) {
          <div class="product-card-skeleton">
            <div class="product-card-skeleton__image"></div>
            <div class="product-card-skeleton__content">
              <div class="product-card-skeleton__text product-card-skeleton__text--title"></div>
              <div class="product-card-skeleton__text product-card-skeleton__text--category"></div>
              <div class="product-card-skeleton__text product-card-skeleton__text--price"></div>
            </div>
          </div>
        }
      } @else if (products.length === 0) {
        <div class="product-grid__empty">
          <div class="product-grid__empty-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <path d="M32 56C45.2548 56 56 45.2548 56 32C56 18.7452 45.2548 8 32 8C18.7452 8 8 18.7452 8 32C8 45.2548 18.7452 56 32 56Z" stroke="#757575" stroke-width="2"/>
              <path d="M24 24L40 40M40 24L24 40" stroke="#757575" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h3 class="product-grid__empty-title">{{ emptyTitle }}</h3>
          <p class="product-grid__empty-message">{{ emptyMessage }}</p>
          @if (emptyActionText) {
            <a [href]="emptyActionUrl" class="product-grid__empty-action">
              {{ emptyActionText }}
            </a>
          }
        </div>
      } @else {
        @for (product of products; track product.id) {
          <lib-product-card
            [product]="product"
            (cardClick)="onProductClick($event)"
            (favoriteToggle)="onFavoriteToggle($event)"
          />
        }
      }
    </div>
  `,
  styles: [`
    .product-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      width: 100%;
    }

    @media (max-width: 1200px) {
      .product-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 768px) {
      .product-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        padding: 0 12px;
      }
    }

    @media (max-width: 480px) {
      .product-grid--single-column {
        grid-template-columns: 1fr;
      }
    }

    .product-card-skeleton {
      background-color: #ffffff;
      position: relative;
      overflow: hidden;
    }

    .product-card-skeleton__image {
      aspect-ratio: 3 / 4;
      background-color: #f5f5f5;
    }

    .product-card-skeleton__content {
      padding: 12px;
    }

    .product-card-skeleton__text {
      height: 16px;
      background-color: #e5e5e5;
      margin-bottom: 8px;
      border-radius: 4px;
    }

    .product-card-skeleton__text--title {
      width: 80%;
    }

    .product-card-skeleton__text--category {
      width: 50%;
      height: 14px;
    }

    .product-card-skeleton__text--price {
      width: 30%;
      margin-top: 16px;
    }

    .product-card-skeleton::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.5),
        transparent
      );
      animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
      0% { left: -100%; }
      100% { left: 100%; }
    }

    .product-grid__empty {
      grid-column: 1 / -1;
      text-align: center;
      padding: 80px 24px;
    }

    .product-grid__empty-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 24px;
      opacity: 0.5;
    }

    .product-grid__empty-title {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 18px;
      font-weight: 500;
      color: #111111;
      margin: 0 0 8px;
    }

    .product-grid__empty-message {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #757575;
      margin: 0 0 24px;
    }

    .product-grid__empty-action {
      display: inline-block;
      padding: 12px 24px;
      background-color: #111111;
      color: #ffffff;
      text-decoration: none;
      border-radius: 30px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      transition: background-color 0.2s ease;
    }

    .product-grid__empty-action:hover {
      background-color: #333333;
    }

    .product-grid__empty-action:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    @media (prefers-reduced-motion: reduce) {
      .product-card-skeleton::after {
        animation: none;
      }

      .product-grid__empty-action {
        transition: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductGridComponent {
  @Input() products: ProductCardData[] = [];
  @Input() loading = false;
  @Input() singleColumn = false;
  @Input() skeletonItems = 8;
  @Input() emptyTitle = 'No products found';
  @Input() emptyMessage = 'Try adjusting your filters or search criteria.';
  @Input() emptyActionText = '';
  @Input() emptyActionUrl = '/';

  @Output() productClick = new EventEmitter<ProductCardData>();
  @Output() favoriteToggle = new EventEmitter<{ product: ProductCardData; isFavorite: boolean }>();

  get skeletonCount(): number[] {
    return Array(this.skeletonItems).fill(0);
  }

  onProductClick(product: ProductCardData): void {
    this.productClick.emit(product);
  }

  onFavoriteToggle(event: { product: ProductCardData; isFavorite: boolean }): void {
    this.favoriteToggle.emit(event);
  }
}
