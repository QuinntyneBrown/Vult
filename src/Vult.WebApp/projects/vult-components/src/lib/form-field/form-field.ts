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
  template: `
    <div
      class="form-field"
      [class.form-field--focused]="isFocused"
      [class.form-field--filled]="hasValue"
      [class.form-field--valid]="isValid && showValidation"
      [class.form-field--error]="hasError"
      [class.form-field--disabled]="disabled"
      [attr.data-testid]="testId"
    >
      <input
        class="form-field__input"
        [type]="type"
        [id]="fieldId"
        [value]="value"
        [disabled]="disabled"
        [required]="required"
        [autocomplete]="autocomplete"
        [attr.aria-invalid]="hasError"
        [attr.aria-describedby]="hasError ? fieldId + '-error' : null"
        placeholder=" "
        (input)="onInput($event)"
        (focus)="onFocus()"
        (blur)="onBlur()"
      />
      <label class="form-field__label" [for]="fieldId">
        {{ label }}
        @if (required) {
          <span class="form-field__required">*</span>
        }
      </label>
      @if (isValid && showValidation && !isFocused) {
        <svg class="form-field__check" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke="#128a09" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      }
    </div>
    @if (hasError && errorMessage) {
      <div class="form-field__error" [id]="fieldId + '-error'" role="alert">
        {{ errorMessage }}
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }

    .form-field {
      position: relative;
      width: 100%;
    }

    .form-field__input {
      width: 100%;
      padding: 20px 12px 8px;
      border: 1px solid #e5e5e5;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 16px;
      color: #111111;
      background: #ffffff;
      transition: border-color 0.2s ease;
    }

    .form-field__input:hover:not(:disabled) {
      border-color: #b5b5b5;
    }

    .form-field__input:focus {
      outline: none;
      border-color: #111111;
    }

    .form-field__input:disabled {
      background-color: #f5f5f5;
      color: #707070;
      cursor: not-allowed;
    }

    .form-field__label {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 16px;
      color: #707070;
      pointer-events: none;
      transition: all 0.2s ease;
      background: transparent;
    }

    .form-field__required {
      color: #d43f21;
    }

    /* Floating label states */
    .form-field--focused .form-field__label,
    .form-field--filled .form-field__label,
    .form-field__input:not(:placeholder-shown) + .form-field__label {
      top: 12px;
      font-size: 12px;
      transform: translateY(0);
    }

    .form-field--focused .form-field__label {
      color: #111111;
    }

    .form-field--valid .form-field__input {
      border-color: #128a09;
      padding-right: 40px;
    }

    .form-field--error .form-field__input {
      border-color: #d43f21;
    }

    .form-field--error .form-field__label {
      color: #d43f21;
    }

    .form-field__check {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
    }

    .form-field__error {
      margin-top: 4px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 12px;
      color: #d43f21;
    }

    @media (prefers-reduced-motion: reduce) {
      .form-field__input,
      .form-field__label {
        transition: none;
      }
    }
  `],
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
