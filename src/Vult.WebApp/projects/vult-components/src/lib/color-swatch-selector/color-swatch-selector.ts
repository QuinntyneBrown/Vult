import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

export interface ColorOption {
  id: string;
  name: string;
  color: string;
  imageUrl?: string;
  available?: boolean;
}

@Component({
  selector: 'v-color-swatch-selector',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorSwatchSelector),
      multi: true
    }
  ],
  templateUrl: './color-swatch-selector.html',
  styleUrl: './color-swatch-selector.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorSwatchSelector implements ControlValueAccessor {
  @Input() colors: ColorOption[] = [];
  @Input() ariaLabel = 'Select color';
  @Input() moreCount = 0;
  @Input() set selectedColorId(value: string | undefined) {
    if (value) {
      this.selectedId.set(value);
    }
  }

  @Output() colorSelect = new EventEmitter<ColorOption>();

  readonly selectedId = signal<string | undefined>(undefined);
  readonly disabled = signal(false);

  private onChange: (value: string | undefined) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | undefined): void {
    this.selectedId.set(value);
  }

  registerOnChange(fn: (value: string | undefined) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  selectColor(color: ColorOption): void {
    if (color.available !== false && !this.disabled()) {
      this.selectedId.set(color.id);
      this.onChange(color.id);
      this.onTouched();
      this.colorSelect.emit(color);
    }
  }
}
