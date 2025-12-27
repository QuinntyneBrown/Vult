import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

export type FormFieldType = 'text' | 'email' | 'tel' | 'password' | 'number';

@Component({
  selector: 'v-form-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  @Input() disabled = false;
  @Input() autocomplete = 'off';
  @Input() isValid = false;
  @Input() showValidation = true;
  @Input() hasError = false;
  @Input() errorMessage = '';
  @Input() testId = 'form-field';

  @Output() valueChange = new EventEmitter<string>();
  @Output() fieldBlur = new EventEmitter<void>();
  @Output() fieldFocus = new EventEmitter<void>();

  value = '';
  isFocused = false;

  fieldId = `field-${Math.random().toString(36).substr(2, 9)}`;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  get hasValue(): boolean {
    return this.value?.length > 0;
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  onFocus(): void {
    this.isFocused = true;
    this.fieldFocus.emit();
  }

  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
    this.fieldBlur.emit();
  }
}
