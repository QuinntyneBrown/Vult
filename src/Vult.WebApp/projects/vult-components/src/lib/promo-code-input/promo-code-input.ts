import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'v-promo-code-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="promo-section" [attr.data-testid]="testId">
      @if (!isExpanded && !appliedCode) {
        <button class="promo-toggle" (click)="toggleExpanded()">
          <span>{{ toggleLabel }}</span>
          <svg class="promo-chevron" [class.promo-chevron--open]="isExpanded" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 6l4 4 4-4"/>
          </svg>
        </button>
      }

      @if (isExpanded && !appliedCode) {
        <div class="promo-form">
          <input
            type="text"
            class="promo-input"
            [class.promo-input--error]="error"
            [(ngModel)]="promoCode"
            [placeholder]="placeholder"
            [disabled]="isLoading"
            [attr.aria-invalid]="error ? 'true' : 'false'"
            [attr.aria-describedby]="error ? testId + '-error' : null"
            (keyup.enter)="onApply()"
          />
          <button
            class="promo-apply-btn"
            [disabled]="!promoCode || isLoading"
            (click)="onApply()"
          >
            @if (isLoading) {
              <span class="loading-spinner"></span>
            } @else {
              Apply
            }
          </button>
        </div>
        @if (error) {
          <div class="promo-error" [id]="testId + '-error'" role="alert">
            {{ error }}
          </div>
        }
      }

      @if (appliedCode) {
        <div class="applied-promo">
          <div class="applied-promo-info">
            <svg class="applied-promo-icon" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="#128a09" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="12" r="10" stroke="#128a09" stroke-width="2"/>
            </svg>
            <span class="applied-promo-code">{{ appliedCode }}</span>
          </div>
          <button class="promo-remove-btn" aria-label="Remove promo code" (click)="onRemove()">
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .promo-section {
      padding-top: 24px;
      border-top: 1px solid #e5e5e5;
      margin-bottom: 24px;
    }

    .promo-toggle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      background: none;
      border: none;
      padding: 0;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #111111;
      cursor: pointer;
    }

    .promo-toggle:hover {
      text-decoration: underline;
    }

    .promo-toggle:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .promo-chevron {
      width: 16px;
      height: 16px;
      transition: transform 0.2s ease;
    }

    .promo-chevron--open {
      transform: rotate(180deg);
    }

    .promo-form {
      display: flex;
      gap: 8px;
      margin-top: 16px;
    }

    .promo-input {
      flex: 1;
      padding: 12px;
      border: 1px solid #e5e5e5;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #111111;
      transition: border-color 0.2s ease;
    }

    .promo-input:focus {
      outline: none;
      border-color: #111111;
    }

    .promo-input--error {
      border-color: #d43f21;
    }

    .promo-input:disabled {
      background: #f5f5f5;
      color: #707070;
    }

    .promo-apply-btn {
      padding: 12px 24px;
      background: #111111;
      color: #ffffff;
      border: none;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;
      min-width: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .promo-apply-btn:hover:not(:disabled) {
      background: #333333;
    }

    .promo-apply-btn:disabled {
      background: #cccccc;
      cursor: not-allowed;
    }

    .promo-apply-btn:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .loading-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .promo-error {
      margin-top: 8px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 12px;
      color: #d43f21;
    }

    .applied-promo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: #e8f5e9;
      border-radius: 4px;
    }

    .applied-promo-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .applied-promo-icon {
      width: 20px;
      height: 20px;
    }

    .applied-promo-code {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #128a09;
    }

    .promo-remove-btn {
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #707070;
      transition: color 0.2s ease;
    }

    .promo-remove-btn:hover {
      color: #111111;
    }

    .promo-remove-btn:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .promo-remove-btn svg {
      width: 16px;
      height: 16px;
    }

    @media (prefers-reduced-motion: reduce) {
      .promo-chevron,
      .promo-input,
      .promo-apply-btn,
      .promo-remove-btn {
        transition: none;
      }

      .loading-spinner {
        animation: none;
        border-right-color: #ffffff;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromoCodeInput {
  @Input() appliedCode = '';
  @Input() isLoading = false;
  @Input() error = '';
  @Input() toggleLabel = 'Do you have a Promo Code?';
  @Input() placeholder = 'Enter promo code';
  @Input() testId = 'promo-code-input';

  @Output() apply = new EventEmitter<string>();
  @Output() remove = new EventEmitter<void>();

  isExpanded = false;
  promoCode = '';

  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }

  onApply(): void {
    if (this.promoCode.trim()) {
      this.apply.emit(this.promoCode.trim());
    }
  }

  onRemove(): void {
    this.promoCode = '';
    this.remove.emit();
  }
}
