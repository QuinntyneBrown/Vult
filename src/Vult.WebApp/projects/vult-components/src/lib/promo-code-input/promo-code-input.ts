import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'v-promo-code-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PromoCodeInput),
      multi: true
    }
  ],
  templateUrl: './promo-code-input.html',
  styleUrl: './promo-code-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromoCodeInput implements ControlValueAccessor {
  @Input() appliedCode = '';
  @Input() isLoading = false;
  @Input() error = '';
  @Input() toggleLabel = 'Do you have a Promo Code?';
  @Input() placeholder = 'Enter promo code';
  @Input() testId = 'promo-code-input';

  @Output() apply = new EventEmitter<string>();
  @Output() remove = new EventEmitter<void>();

  readonly promoCode = signal('');
  readonly isExpanded = signal(false);
  readonly disabled = signal(false);

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.promoCode.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  toggleExpanded(): void {
    this.isExpanded.update(v => !v);
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.promoCode.set(target.value);
    this.onChange(this.promoCode());
  }

  onBlur(): void {
    this.onTouched();
  }

  onApply(): void {
    const code = this.promoCode().trim();
    if (code) {
      this.apply.emit(code);
    }
  }

  onRemove(): void {
    this.promoCode.set('');
    this.onChange('');
    this.remove.emit();
  }
}
