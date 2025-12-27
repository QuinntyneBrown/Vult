import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef, signal, computed } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

export type FormFieldType = 'text' | 'email' | 'tel' | 'password' | 'number';

@Component({
  selector: 'v-form-field',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormField),
      multi: true
    }
  ],
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormField implements ControlValueAccessor {
  @Input() type: FormFieldType = 'text';
  @Input() label = '';
  @Input() required = false;
  @Input() autocomplete = 'off';
  @Input() showValidation = true;
  @Input() hasError = false;
  @Input() errorMessage = '';
  @Input() hint = '';
  @Input() testId = 'form-field';

  @Output() valueChange = new EventEmitter<string>();
  @Output() fieldBlur = new EventEmitter<void>();
  @Output() fieldFocus = new EventEmitter<void>();

  readonly value = signal('');
  readonly disabled = signal(false);
  readonly isValid = signal(false);
  readonly isFocused = signal(false);

  readonly hasValue = computed(() => this.value().length > 0);

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value.set(value || '');
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

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
    this.onChange(this.value());
    this.valueChange.emit(this.value());
  }

  onFocus(): void {
    this.isFocused.set(true);
    this.fieldFocus.emit();
  }

  onBlur(): void {
    this.isFocused.set(false);
    this.onTouched();
    this.fieldBlur.emit();
  }

  // Support both 'valid' and 'isValid' inputs for backward compatibility
  @Input() set valid(value: boolean) {
    this.isValid.set(value);
  }

  @Input('isValid') set isValidInput(value: boolean) {
    this.isValid.set(value);
  }
}
