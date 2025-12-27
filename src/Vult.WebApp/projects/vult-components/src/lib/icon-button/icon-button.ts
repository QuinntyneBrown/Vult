import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type IconButtonSize = 'small' | 'medium' | 'large';
export type IconButtonVariant = 'default' | 'filled' | 'outlined';

@Component({
  selector: 'v-icon-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="icon-button"
      [class.icon-button--small]="size === 'small'"
      [class.icon-button--medium]="size === 'medium'"
      [class.icon-button--large]="size === 'large'"
      [class.icon-button--filled]="variant === 'filled'"
      [class.icon-button--outlined]="variant === 'outlined'"
      [class.icon-button--active]="active"
      [disabled]="disabled"
      [attr.aria-label]="ariaLabel"
      [attr.aria-pressed]="active"
      (click)="handleClick($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .icon-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: none;
      cursor: pointer;
      color: #111111;
      transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
    }

    .icon-button:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .icon-button:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .icon-button:active {
      transform: scale(0.9);
    }

    .icon-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .icon-button:disabled:hover {
      background-color: transparent;
    }

    .icon-button--small {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }

    .icon-button--medium {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .icon-button--large {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }

    .icon-button--filled {
      background-color: rgba(255, 255, 255, 0.9);
    }

    .icon-button--filled:hover {
      background-color: #ffffff;
      transform: scale(1.1);
    }

    .icon-button--outlined {
      border: 1.5px solid #111111;
    }

    .icon-button--outlined:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .icon-button--active {
      color: #111111;
    }

    .icon-button--active:not(.icon-button--filled) {
      background-color: rgba(0, 0, 0, 0.1);
    }

    .icon-button :deep(svg) {
      width: 20px;
      height: 20px;
    }

    .icon-button--small :deep(svg) {
      width: 16px;
      height: 16px;
    }

    .icon-button--large :deep(svg) {
      width: 24px;
      height: 24px;
    }

    @media (prefers-reduced-motion: reduce) {
      .icon-button {
        transition: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButton {
  @Input() size: IconButtonSize = 'medium';
  @Input() variant: IconButtonVariant = 'default';
  @Input() active = false;
  @Input() disabled = false;
  @Input() ariaLabel = '';

  @Output() buttonClick = new EventEmitter<Event>();

  handleClick(event: Event): void {
    if (!this.disabled) {
      this.buttonClick.emit(event);
    }
  }
}
