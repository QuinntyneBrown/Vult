import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

export interface ProductPrice {
  current: number;
  original?: number;
  currency: string;
  currencySymbol: string;
  salePercentage?: number;
}

@Component({
  selector: 'v-product-info-section',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <div class="product-info">
      @if (isMemberExclusive) {
        <span class="product-info__badge">Exclusive Access</span>
      }

      @if (subtitle) {
        <p class="product-info__subtitle">{{ subtitle }}</p>
      }

      <h1 class="product-info__title">{{ title }}</h1>

      @if (colorName) {
        <p class="product-info__color">{{ colorName }}</p>
      }

      <div class="product-info__price-container">
        <span class="product-info__price">
          {{ price.currencySymbol }}{{ price.current | number:'1.0-0' }}
        </span>

        @if (price.original && price.original > price.current) {
          <span class="product-info__price--original">
            {{ price.currencySymbol }}{{ price.original | number:'1.0-0' }}
          </span>

          @if (price.salePercentage) {
            <span class="product-info__sale-badge">
              {{ price.salePercentage }}% off
            </span>
          }
        }
      </div>

      @if (promotionalMessage) {
        <p class="product-info__promo">{{ promotionalMessage }}</p>
      }
    </div>
  `,
  styles: [`
    .product-info {
      max-width: 400px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }

    .product-info__badge {
      display: inline-block;
      padding: 4px 8px;
      background-color: #111111;
      color: #ffffff;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }

    .product-info__subtitle {
      font-size: 16px;
      font-weight: 400;
      color: #757575;
      line-height: 1.5;
      margin: 0 0 4px;
    }

    .product-info__title {
      font-size: 24px;
      font-weight: 500;
      color: #111111;
      line-height: 1.3;
      margin: 0 0 12px;
    }

    .product-info__color {
      font-size: 16px;
      font-weight: 400;
      color: #111111;
      line-height: 1.5;
      margin: 0 0 16px;
    }

    .product-info__price-container {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .product-info__price {
      font-size: 20px;
      font-weight: 500;
      color: #111111;
      line-height: 1.4;
    }

    .product-info__price--original {
      font-size: 16px;
      font-weight: 400;
      color: #757575;
      text-decoration: line-through;
    }

    .product-info__sale-badge {
      display: inline-block;
      padding: 4px 8px;
      background-color: #008c00;
      color: #ffffff;
      font-size: 12px;
      font-weight: 500;
      border-radius: 2px;
    }

    .product-info__promo {
      margin: 8px 0 0;
      font-size: 14px;
      color: #008c00;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .product-info__subtitle {
        font-size: 14px;
      }

      .product-info__title {
        font-size: 20px;
      }

      .product-info__price {
        font-size: 18px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductInfoSection {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() price: ProductPrice = {
    current: 0,
    currency: 'USD',
    currencySymbol: '$'
  };
  @Input() colorName = '';
  @Input() promotionalMessage = '';
  @Input() isMemberExclusive = false;
}
