import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'default' | 'new' | 'sale' | 'member' | 'sustainable' | 'bestseller';

@Component({
  selector: 'v-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="badge"
      [class.badge--new]="variant === 'new'"
      [class.badge--sale]="variant === 'sale'"
      [class.badge--member]="variant === 'member'"
      [class.badge--sustainable]="variant === 'sustainable'"
      [class.badge--bestseller]="variant === 'bestseller'"
      [attr.aria-label]="ariaLabel || null"
    >
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 4px 8px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 12px;
      font-weight: 500;
      line-height: 1.5;
      background-color: #ffffff;
      color: #111111;
      white-space: nowrap;
    }

    .badge--new {
      background-color: #ffffff;
      color: #111111;
    }

    .badge--sale {
      background-color: #9e3500;
      color: #ffffff;
    }

    .badge--member {
      background-color: #111111;
      color: #ffffff;
    }

    .badge--sustainable {
      background-color: #388e3c;
      color: #ffffff;
    }

    .badge--bestseller {
      background-color: #ffffff;
      color: #111111;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Badge {
  @Input() variant: BadgeVariant = 'default';
  @Input() ariaLabel?: string;
}
