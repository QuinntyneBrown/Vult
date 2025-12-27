import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'v-quantity-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="quantity-selector" [attr.data-testid]="testId">
      @if (showLabel) {
        <label class="quantity-label" [for]="selectorId">{{ label }}</label>
      }
      <select
        class="quantity-select"
        [id]="selectorId"
        [value]="quantity"
        [disabled]="disabled"
        [attr.aria-label]="ariaLabel || label"
        (change)="onQuantityChange($event)"
      >
        @for (n of quantityOptions; track n) {
          <option [value]="n" [selected]="n === quantity">{{ n }}</option>
        }
      </select>
      <svg class="quantity-chevron" viewBox="0 0 16 16" fill="currentColor">
        <path d="M4 6l4 4 4-4"/>
      </svg>
    </div>
  `,
  styles: [`
    .quantity-selector {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      position: relative;
    }

    .quantity-label {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #707070;
    }

    .quantity-select {
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      padding: 8px 36px 8px 12px;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #111111;
      background: #ffffff;
      cursor: pointer;
      min-width: 70px;
      transition: border-color 0.2s ease;
    }

    .quantity-select:hover:not(:disabled) {
      border-color: #111111;
    }

    .quantity-select:focus {
      outline: none;
      border-color: #111111;
    }

    .quantity-select:disabled {
      background-color: #f5f5f5;
      color: #707070;
      cursor: not-allowed;
    }

    .quantity-chevron {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 12px;
      height: 12px;
      pointer-events: none;
      color: #111111;
    }

    :host-context(.quantity-label) .quantity-chevron {
      right: 12px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuantitySelector {
  @Input() quantity = 1;
  @Input() maxQuantity = 10;
  @Input() minQuantity = 1;
  @Input() disabled = false;
  @Input() showLabel = true;
  @Input() label = 'Quantity';
  @Input() ariaLabel = '';
  @Input() testId = 'quantity-selector';

  @Output() quantityChange = new EventEmitter<number>();

  selectorId = `quantity-${Math.random().toString(36).substr(2, 9)}`;

  get quantityOptions(): number[] {
    return Array.from(
      { length: this.maxQuantity - this.minQuantity + 1 },
      (_, i) => this.minQuantity + i
    );
  }

  onQuantityChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newQuantity = parseInt(target.value, 10);
    this.quantityChange.emit(newQuantity);
  }
}
