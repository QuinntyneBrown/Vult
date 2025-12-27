import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

export interface CheckboxOption {
  id: string;
  label: string;
  count?: number;
  checked?: boolean;
}

@Component({
  selector: 'v-checkbox-filter',
  standalone: true,
  imports: [ReactiveFormsModule, MatCheckboxModule, MatIconModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxFilter),
      multi: true
    }
  ],
  templateUrl: './checkbox-filter.html',
  styleUrl: './checkbox-filter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxFilter implements ControlValueAccessor {
  @Input() label = '';
  @Input() options: CheckboxOption[] = [];
  @Input() collapsible = true;

  @Output() optionChange = new EventEmitter<{ option: CheckboxOption; checked: boolean }>();

  readonly expanded = signal(true);
  readonly selectedIds = signal<string[]>([]);
  readonly disabled = signal(false);

  private onChange: (value: string[]) => void = () => {};
  private onTouched: () => void = () => {};

  get labelId(): string {
    return `checkbox-filter-label-${this.label.replace(/\s+/g, '-').toLowerCase()}`;
  }

  get contentId(): string {
    return `checkbox-filter-content-${this.label.replace(/\s+/g, '-').toLowerCase()}`;
  }

  isChecked(id: string): boolean {
    return this.selectedIds().includes(id);
  }

  writeValue(value: string[]): void {
    this.selectedIds.set(value || []);
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  toggleExpanded(): void {
    if (this.collapsible) {
      this.expanded.update(v => !v);
    }
  }

  onOptionChange(option: CheckboxOption, checked: boolean): void {
    const current = this.selectedIds();
    let newIds: string[];

    if (checked) {
      newIds = [...current, option.id];
    } else {
      newIds = current.filter(id => id !== option.id);
    }

    this.selectedIds.set(newIds);
    this.onChange(newIds);
    this.onTouched();
    this.optionChange.emit({ option, checked });
  }
}
