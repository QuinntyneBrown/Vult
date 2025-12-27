import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

export interface SizeOption {
  id: string;
  label: string;
  available?: boolean;
}

@Component({
  selector: 'v-size-selector',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonToggleModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SizeSelector),
      multi: true
    }
  ],
  template: `
    <mat-button-toggle-group
      class="size-grid"
      [multiple]="multiSelect"
      [value]="multiSelect ? selectedIds() : selectedIds()[0]"
      [attr.aria-label]="ariaLabel"
      (change)="onToggleChange($event)"
    >
      @for (size of sizes; track size.id) {
        <mat-button-toggle
          class="size-button"
          [class.size-button--unavailable]="size.available === false"
          [class.size-button--strikethrough]="size.available === false && showStrikethrough"
          [value]="size.id"
          [disabled]="size.available === false || disabled()"
          [attr.aria-pressed]="selectedIds().includes(size.id)"
        >
          {{ size.label }}
        </mat-button-toggle>
      }
    </mat-button-toggle-group>
  `,
  styles: [`
    :host {
      display: block;
    }

    .size-grid {
      display: grid !important;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      flex-wrap: wrap;
      border: none !important;
    }

    .size-button {
      height: 48px;
      border: 1px solid #e5e5e5 !important;
      border-radius: 0 !important;

      &.mat-button-toggle-checked {
        border: 1.5px solid #111111 !important;
        background-color: transparent !important;
      }

      ::ng-deep .mat-button-toggle-button {
        font-family: var(--font-family-base, 'Helvetica Neue', Helvetica, Arial, sans-serif);
        font-size: 14px;
        color: #111111;
      }

      &:hover:not(.mat-button-toggle-disabled) {
        border-color: #111111 !important;
      }
    }

    .size-button--unavailable {
      ::ng-deep .mat-button-toggle-button {
        color: #cccccc;
      }

      &:hover {
        border-color: #e5e5e5 !important;
      }
    }

    .size-button--strikethrough {
      ::ng-deep .mat-button-toggle-button {
        text-decoration: line-through;
      }
    }

    @media (max-width: 200px) {
      .size-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .size-button {
        transition: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SizeSelector implements ControlValueAccessor {
  @Input() sizes: SizeOption[] = [];
  @Input() ariaLabel = 'Filter by size';
  @Input() multiSelect = true;
  @Input() showStrikethrough = false;
  @Input() set selectedSizeIds(value: string[]) {
    this.selectedIds.set(value);
  }

  @Output() selectionChange = new EventEmitter<string[]>();
  @Output() sizeSelect = new EventEmitter<SizeOption>();

  readonly selectedIds = signal<string[]>([]);
  readonly disabled = signal(false);

  private onChange: (value: string[]) => void = () => {};
  private onTouched: () => void = () => {};

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

  onToggleChange(event: { value: string | string[] }): void {
    const value = event.value;
    const newIds = Array.isArray(value) ? value : (value ? [value] : []);
    this.selectedIds.set(newIds);
    this.onChange(newIds);
    this.onTouched();
    this.selectionChange.emit(newIds);
  }

  toggleSize(size: SizeOption): void {
    this.sizeSelect.emit(size);

    if (size.available === false) {
      return;
    }

    const current = this.selectedIds();
    const index = current.indexOf(size.id);

    if (this.multiSelect) {
      if (index >= 0) {
        this.selectedIds.set(current.filter(id => id !== size.id));
      } else {
        this.selectedIds.set([...current, size.id]);
      }
    } else {
      if (index >= 0) {
        this.selectedIds.set([]);
      } else {
        this.selectedIds.set([size.id]);
      }
    }

    this.onChange(this.selectedIds());
    this.onTouched();
    this.selectionChange.emit(this.selectedIds());
  }
}
