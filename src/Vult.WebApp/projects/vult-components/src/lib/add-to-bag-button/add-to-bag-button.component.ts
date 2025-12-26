import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AddToBagButtonState = 'default' | 'loading' | 'success' | 'error';

@Component({
  selector: 'lib-add-to-bag-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="add-to-bag-btn"
      [class.add-to-bag-btn--loading]="state === 'loading'"
      [class.add-to-bag-btn--success]="state === 'success'"
      [class.add-to-bag-btn--full-width]="fullWidth"
      [disabled]="disabled || state === 'loading'"
      [attr.aria-label]="ariaLabel"
      [attr.aria-busy]="state === 'loading'"
      (click)="handleClick()"
    >
      @if (showIcon && state === 'default') {
        <svg class="add-to-bag-btn__icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 6V4.5C16 3.12 14.88 2 13.5 2h-3C9.12 2 8 3.12 8 4.5V6H3v2h1l1.5 13h13L20 8h1V6h-5zm-6-1.5c0-.28.22-.5.5-.5h3c.28 0 .5.22.5.5V6h-4V4.5zM17.5 19h-11L5.22 8h13.56l-1.28 11z"/>
        </svg>
      }

      @if (state === 'success') {
        <svg class="add-to-bag-btn__check" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"></polyline>
        </svg>
      }

      <span class="add-to-bag-btn__text">
        @switch (state) {
          @case ('default') { Add to Bag }
          @case ('loading') { Add to Bag }
          @case ('success') { Added }
          @case ('error') { Try Again }
        }
      </span>
    </button>

    @if (errorMessage && state === 'error') {
      <div class="add-to-bag-error" role="alert">
        <svg class="add-to-bag-error__icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        {{ errorMessage }}
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }

    .add-to-bag-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      height: 60px;
      padding: 0 24px;
      background-color: #111111;
      color: #ffffff;
      border: none;
      border-radius: 30px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease, transform 0.1s ease;
      position: relative;
      white-space: nowrap;
    }

    .add-to-bag-btn:hover:not(:disabled):not(.add-to-bag-btn--loading) {
      background-color: #333333;
    }

    .add-to-bag-btn:active:not(:disabled):not(.add-to-bag-btn--loading) {
      transform: scale(0.98);
    }

    .add-to-bag-btn:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .add-to-bag-btn:focus:not(:focus-visible) {
      outline: none;
    }

    .add-to-bag-btn:focus-visible {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .add-to-bag-btn:disabled {
      background-color: #cccccc;
      color: #767676;
      cursor: not-allowed;
    }

    .add-to-bag-btn:disabled:hover {
      background-color: #cccccc;
    }

    .add-to-bag-btn:disabled:active {
      transform: none;
    }

    .add-to-bag-btn--loading {
      pointer-events: none;
    }

    .add-to-bag-btn--loading .add-to-bag-btn__text {
      color: transparent;
    }

    .add-to-bag-btn--loading::after {
      content: '';
      position: absolute;
      width: 24px;
      height: 24px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .add-to-bag-btn--success {
      background-color: #008c00;
    }

    .add-to-bag-btn--success:hover {
      background-color: #007a00;
    }

    .add-to-bag-btn__icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .add-to-bag-btn__check {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .add-to-bag-btn__text {
      transition: color 0.15s ease;
    }

    .add-to-bag-error {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 12px;
      color: #d43f21;
      font-size: 14px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }

    .add-to-bag-error__icon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (max-width: 768px) {
      .add-to-bag-btn {
        height: 52px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .add-to-bag-btn {
        transition: none;
      }

      .add-to-bag-btn:active:not(:disabled):not(.add-to-bag-btn--loading) {
        transform: none;
      }

      .add-to-bag-btn--loading::after {
        animation: none;
        border-right-color: #ffffff;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddToBagButtonComponent {
  @Input() disabled = false;
  @Input() state: AddToBagButtonState = 'default';
  @Input() fullWidth = true;
  @Input() showIcon = false;
  @Input() ariaLabel = 'Add to bag';
  @Input() errorMessage = '';

  @Output() addToBag = new EventEmitter<void>();

  handleClick(): void {
    if (!this.disabled && this.state !== 'loading') {
      this.addToBag.emit();
    }
  }
}
