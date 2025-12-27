import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SecondaryButtonSize = 'small' | 'medium' | 'large';
export type SecondaryButtonVariant = 'outlined' | 'text' | 'ghost';
export type SecondaryButtonTheme = 'dark' | 'light';

@Component({
  selector: 'v-secondary-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (href) {
      <a
        class="btn-secondary"
        [class.outlined]="variant === 'outlined'"
        [class.text]="variant === 'text'"
        [class.ghost]="variant === 'ghost'"
        [class.small]="size === 'small'"
        [class.medium]="size === 'medium'"
        [class.large]="size === 'large'"
        [class.light]="theme === 'light'"
        [class.disabled]="disabled"
        [href]="href"
        [attr.aria-disabled]="disabled"
        (click)="handleClick($event)"
      >
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </a>
    } @else {
      <button
        class="btn-secondary"
        [class.outlined]="variant === 'outlined'"
        [class.text]="variant === 'text'"
        [class.ghost]="variant === 'ghost'"
        [class.small]="size === 'small'"
        [class.medium]="size === 'medium'"
        [class.large]="size === 'large'"
        [class.light]="theme === 'light'"
        [type]="type"
        [disabled]="disabled"
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
    .btn-secondary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .btn-secondary:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .btn-secondary:focus:not(:focus-visible) {
      outline: none;
    }

    .btn-secondary:focus-visible {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    /* Outlined */
    .btn-secondary.outlined {
      background-color: transparent;
      border: 1.5px solid #111111;
      color: #111111;
      border-radius: 30px;
    }

    .btn-secondary.outlined:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .btn-secondary.outlined:active {
      background-color: rgba(0, 0, 0, 0.1);
      transform: scale(0.95);
    }

    .btn-secondary.outlined.light {
      border-color: #ffffff;
      color: #ffffff;
    }

    .btn-secondary.outlined.light:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .btn-secondary.outlined.light:focus {
      outline-color: #ffffff;
    }

    /* Text */
    .btn-secondary.text {
      background: none;
      border: none;
      color: #111111;
      text-decoration: underline;
      text-underline-offset: 4px;
      padding: 0;
    }

    .btn-secondary.text:hover {
      text-decoration-thickness: 2px;
    }

    .btn-secondary.text:active {
      color: #333333;
    }

    .btn-secondary.text.light {
      color: #ffffff;
    }

    .btn-secondary.text.light:focus {
      outline-color: #ffffff;
    }

    /* Ghost */
    .btn-secondary.ghost {
      background: none;
      border: none;
      color: #111111;
      border-radius: 30px;
    }

    .btn-secondary.ghost:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .btn-secondary.ghost:active {
      background-color: rgba(0, 0, 0, 0.1);
    }

    .btn-secondary.ghost.light {
      color: #ffffff;
    }

    .btn-secondary.ghost.light:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .btn-secondary.ghost.light:focus {
      outline-color: #ffffff;
    }

    /* Sizes - Outlined and Ghost */
    .btn-secondary.small:not(.text) {
      height: 36px;
      padding: 0 20px;
      font-size: 14px;
    }

    .btn-secondary.medium:not(.text) {
      height: 44px;
      padding: 0 24px;
      font-size: 16px;
    }

    .btn-secondary.large:not(.text) {
      height: 52px;
      padding: 0 32px;
      font-size: 16px;
    }

    /* Sizes - Text */
    .btn-secondary.text.small {
      height: auto;
      padding: 8px 0;
      font-size: 14px;
    }

    .btn-secondary.text.medium {
      height: auto;
      padding: 12px 0;
      font-size: 16px;
    }

    .btn-secondary.text.large {
      height: auto;
      padding: 16px 0;
      font-size: 16px;
    }

    /* Disabled */
    .btn-secondary:disabled,
    .btn-secondary.disabled {
      cursor: not-allowed;
    }

    .btn-secondary.outlined:disabled,
    .btn-secondary.outlined.disabled {
      border-color: #cccccc;
      color: #cccccc;
    }

    .btn-secondary.outlined:disabled:hover {
      background-color: transparent;
    }

    .btn-secondary.text:disabled,
    .btn-secondary.text.disabled {
      color: #cccccc;
    }

    .btn-secondary.ghost:disabled,
    .btn-secondary.ghost.disabled {
      color: #cccccc;
    }

    .btn-secondary.ghost:disabled:hover {
      background-color: transparent;
    }

    /* Icons */
    .btn-secondary :deep(svg) {
      width: 18px;
      height: 18px;
      fill: currentColor;
      flex-shrink: 0;
    }

    @media (prefers-reduced-motion: reduce) {
      .btn-secondary {
        transition: none;
      }

      .btn-secondary:active {
        transform: none;
      }
    }

    @media (prefers-contrast: high) {
      .btn-secondary.outlined {
        border-width: 2px;
      }

      .btn-secondary:focus {
        outline-width: 3px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecondaryButton {
  @Input() variant: SecondaryButtonVariant = 'outlined';
  @Input() size: SecondaryButtonSize = 'medium';
  @Input() theme: SecondaryButtonTheme = 'dark';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() href?: string;

  @Output() buttonClick = new EventEmitter<Event>();

  handleClick(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      return;
    }
    this.buttonClick.emit(event);
  }
}
