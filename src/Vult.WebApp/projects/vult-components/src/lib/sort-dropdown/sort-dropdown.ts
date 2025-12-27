import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, forwardRef, computed } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

export interface SortOption {
  id: string;
  label: string;
}

@Component({
  selector: 'v-sort-dropdown',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SortDropdown),
      multi: true
    }
  ],
  template: `
    <mat-form-field appearance="outline" class="sort-dropdown">
      @if (showLabel) {
        <mat-label>{{ label }}</mat-label>
      }
      <mat-select
        [value]="selectedId()"
        [disabled]="disabled()"
        (selectionChange)="onSelectionChange($event.value)"
        (blur)="onBlur()"
      >
        @for (option of options; track option.id) {
          <mat-option [value]="option.id">
            {{ option.label }}
          </mat-option>
        }
      </mat-select>
    </mat-form-field>
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    .sort-dropdown {
      min-width: 200px;
      background-color: white;
    }

    ::ng-deep .mat-mdc-select-panel {
      background-color: white !important;
    }

    ::ng-deep .mat-mdc-option {
      background-color: white !important;
      color: #000 !important;
    }

    ::ng-deep .mat-mdc-option:hover {
      background-color: #f5f5f5 !important;
    }

    @media (max-width: 768px) {
      .sort-dropdown {
        width: 100%;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortDropdown implements ControlValueAccessor {
  @Input() options: SortOption[] = [];
  @Input() label = 'Sort By';
  @Input() showLabel = true;
  @Input() set selectedOptionId(value: string | undefined) {
    if (value) {
      this.selectedId.set(value);
    }
  }

  @Output() selectionChange = new EventEmitter<SortOption>();

  readonly selectedId = signal<string | undefined>(undefined);
  readonly disabled = signal(false);

  readonly selectedOption = computed(() =>
    this.options.find(o => o.id === this.selectedId())
  );

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

  onSelectionChange(value: string): void {
    this.selectedId.set(value);
    this.onChange(value);
    const option = this.options.find(o => o.id === value);
    if (option) {
      this.selectionChange.emit(option);
    }
  }

  onBlur(): void {
    this.onTouched();
  }
}
