import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonTheme = 'dark' | 'light';

@Component({
  selector: 'v-primary-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (href) {
      <a
        class="btn-primary"
        [class.small]="size === 'small'"
        [class.medium]="size === 'medium'"
        [class.large]="size === 'large'"
        [class.dark]="theme === 'dark'"
        [class.light]="theme === 'light'"
        [class.full-width]="fullWidth"
        [class.loading]="loading"
        [class.disabled]="disabled"
        [href]="href"
        [attr.aria-disabled]="disabled"
        (click)="handleClick($event)"
      >
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </a>
    } @else {
      <button
        class="btn-primary"
        [class.small]="size === 'small'"
        [class.medium]="size === 'medium'"
        [class.large]="size === 'large'"
        [class.dark]="theme === 'dark'"
        [class.light]="theme === 'light'"
        [class.full-width]="fullWidth"
        [class.loading]="loading"
        [type]="type"
        [disabled]="disabled || loading"
        (click)="handleClick($event)"
      >
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </button>
    }

    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
  `,
  styles: [`
    .btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-weight: 500;
      text-decoration: none;
      border: none;
      border-radius: 30px;
      cursor: pointer;
      white-space: nowrap;
      transition: background-color 0.2s ease, transform 0.1s ease;
    }

    .btn-primary.dark {
      background-color: #111111;
      color: #ffffff;
    }

    .btn-primary.dark:hover {
      background-color: #333333;
    }

    .btn-primary.light {
      background-color: #ffffff;
      color: #111111;
    }

    .btn-primary.light:hover {
      background-color: #e5e5e5;
    }

    .btn-primary.small {
      height: 36px;
      padding: 0 20px;
      font-size: 14px;
    }

    .btn-primary.medium {
      height: 44px;
      padding: 0 24px;
      font-size: 16px;
    }

    .btn-primary.large {
      height: 52px;
      padding: 0 32px;
      font-size: 16px;
    }

    .btn-primary.full-width {
      width: 100%;
    }

    .btn-primary:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .btn-primary:focus:not(:focus-visible) {
      outline: none;
    }

    .btn-primary:focus-visible {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .btn-primary:active {
      transform: scale(0.95);
    }

    .btn-primary:disabled,
    .btn-primary.disabled {
      background-color: #cccccc;
      color: #767676;
      cursor: not-allowed;
    }

    .btn-primary:disabled:hover,
    .btn-primary.disabled:hover {
      background-color: #cccccc;
    }

    .btn-primary:disabled:active,
    .btn-primary.disabled:active {
      transform: none;
    }

    .btn-primary.loading {
      position: relative;
      color: transparent;
      pointer-events: none;
    }

    .btn-primary.loading::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      border: 2px solid #ffffff;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .btn-primary.loading.light::after {
      border-color: #111111;
      border-top-color: transparent;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .btn-primary :deep(svg) {
      width: 18px;
      height: 18px;
      fill: currentColor;
      flex-shrink: 0;
    }

    .btn-primary {
      min-height: 44px;
      min-width: 44px;
    }

    .btn-primary.small {
      position: relative;
    }

    .btn-primary.small::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 44px;
      min-width: 44px;
    }

    @media (prefers-reduced-motion: reduce) {
      .btn-primary {
        transition: none;
      }

      .btn-primary:active {
        transform: none;
      }

      .btn-primary.loading::after {
        animation: none;
      }
    }

    @media (prefers-contrast: high) {
      .btn-primary:focus {
        outline: 3px solid currentColor;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimaryButton {
  @Input() size: ButtonSize = 'medium';
  @Input() theme: ButtonTheme = 'dark';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() href?: string;

  @Output() buttonClick = new EventEmitter<Event>();

  handleClick(event: Event): void {
    if (this.disabled || this.loading) {
      event.preventDefault();
      return;
    }
    this.buttonClick.emit(event);
  }
}
