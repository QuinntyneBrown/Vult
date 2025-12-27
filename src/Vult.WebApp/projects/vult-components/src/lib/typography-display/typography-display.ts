import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TypographyVariant =
  | 'display-1'
  | 'display-2'
  | 'title-1'
  | 'title-2'
  | 'title-3'
  | 'title-4'
  | 'body-1'
  | 'body-1-strong'
  | 'body-2'
  | 'body-3'
  | 'overline'
  | 'caption'
  | 'price'
  | 'price-sale';

export type TypographyColor = 'primary' | 'secondary' | 'inverse' | 'sale' | 'error' | 'success';

@Component({
  selector: 'v-typography',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="typography"
      [class.display-1]="variant === 'display-1'"
      [class.display-2]="variant === 'display-2'"
      [class.title-1]="variant === 'title-1'"
      [class.title-2]="variant === 'title-2'"
      [class.title-3]="variant === 'title-3'"
      [class.title-4]="variant === 'title-4'"
      [class.body-1]="variant === 'body-1'"
      [class.body-1-strong]="variant === 'body-1-strong'"
      [class.body-2]="variant === 'body-2'"
      [class.body-3]="variant === 'body-3'"
      [class.overline]="variant === 'overline'"
      [class.caption]="variant === 'caption'"
      [class.price]="variant === 'price'"
      [class.price-sale]="variant === 'price-sale'"
      [class.text-primary]="color === 'primary'"
      [class.text-secondary]="color === 'secondary'"
      [class.text-inverse]="color === 'inverse'"
      [class.text-sale]="color === 'sale'"
      [class.text-error]="color === 'error'"
      [class.text-success]="color === 'success'"
      [class.text-center]="align === 'center'"
      [class.text-truncate]="truncate"
      [class.text-clamp-2]="lineClamp === 2"
    >
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    :host {
      --font-primary: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      --text-primary: #111111;
      --text-secondary: #757575;
      --text-inverse: #ffffff;
      --text-sale: #9e3500;
      --text-error: #d32f2f;
      --text-success: #388e3c;
    }

    .typography {
      font-family: var(--font-primary);
      color: var(--text-primary);
    }

    /* Display */
    .display-1 {
      font-size: 84px;
      font-weight: 800;
      line-height: 1.0;
      letter-spacing: -2px;
    }

    .display-2 {
      font-size: 64px;
      font-weight: 800;
      line-height: 1.0;
      letter-spacing: -1px;
    }

    /* Titles */
    .title-1 {
      font-size: 48px;
      font-weight: 700;
      line-height: 1.2;
    }

    .title-2 {
      font-size: 36px;
      font-weight: 600;
      line-height: 1.2;
    }

    .title-3 {
      font-size: 24px;
      font-weight: 600;
      line-height: 1.3;
    }

    .title-4 {
      font-size: 20px;
      font-weight: 500;
      line-height: 1.4;
    }

    /* Body */
    .body-1 {
      font-size: 16px;
      font-weight: 400;
      line-height: 1.6;
    }

    .body-1-strong {
      font-size: 16px;
      font-weight: 500;
      line-height: 1.6;
    }

    .body-2 {
      font-size: 14px;
      font-weight: 400;
      line-height: 1.5;
    }

    .body-3 {
      font-size: 12px;
      font-weight: 400;
      line-height: 1.5;
    }

    /* Utility */
    .overline {
      font-size: 10px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .caption {
      font-size: 12px;
      font-weight: 400;
      line-height: 1.5;
      color: var(--text-secondary);
    }

    .price {
      font-size: 16px;
      font-weight: 500;
    }

    .price-sale {
      font-size: 16px;
      font-weight: 500;
      color: var(--text-sale);
    }

    /* Colors */
    .text-primary { color: var(--text-primary); }
    .text-secondary { color: var(--text-secondary); }
    .text-inverse { color: var(--text-inverse); }
    .text-sale { color: var(--text-sale); }
    .text-error { color: var(--text-error); }
    .text-success { color: var(--text-success); }

    /* Utilities */
    .text-center {
      text-align: center;
    }

    .text-truncate {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .text-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .display-1 { font-size: 64px; }
      .display-2 { font-size: 48px; }
      .title-1 { font-size: 40px; }
      .title-2 { font-size: 32px; }
    }

    @media (max-width: 768px) {
      .display-1 { font-size: 44px; letter-spacing: -1px; }
      .display-2 { font-size: 36px; letter-spacing: -0.5px; }
      .title-1 { font-size: 32px; }
      .title-2 { font-size: 28px; }
      .title-3 { font-size: 22px; }
      .title-4 { font-size: 18px; }
    }

    @media (prefers-contrast: high) {
      .text-secondary {
        color: #555555;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypographyDisplay {
  @Input() variant: TypographyVariant = 'body-1';
  @Input() color: TypographyColor = 'primary';
  @Input() align: 'left' | 'center' | 'right' = 'left';
  @Input() truncate = false;
  @Input() lineClamp?: number;
}
