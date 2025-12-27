import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef, signal, computed } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'v-quantity-selector',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuantitySelector),
      multi: true
    }
  ],
  templateUrl: './quantity-selector.html',
  styleUrl: './quantity-selector.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuantitySelector implements ControlValueAccessor {
  @Input() maxQuantity = 10;
  @Input() minQuantity = 1;
  @Input() showLabel = true;
  @Input() label = 'Quantity';
  @Input() ariaLabel = '';
  @Input() testId = 'quantity-selector';

  // Backward compatibility: support direct quantity input
  @Input() set quantity(value: number) {
    if (value !== undefined && value !== null) {
      this._quantity.set(value);
    }
  }
  get quantityValue(): number {
    return this._quantity();
  }

  @Output() quantityChange = new EventEmitter<number>();

  private readonly _quantity = signal(1);
  readonly disabled = signal(false);

  readonly quantityOptions = computed(() =>
    Array.from(
      { length: this.maxQuantity - this.minQuantity + 1 },
      (_, i) => this.minQuantity + i
    )
  );

  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: number): void {
    this._quantity.set(value ?? this.minQuantity);
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onSelectionChange(value: number): void {
    this._quantity.set(value);
    this.onChange(value);
    this.quantityChange.emit(value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
