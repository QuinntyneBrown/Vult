import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SizeOption {
  id: string;
  label: string;
  available?: boolean;
}

@Component({
  selector: 'lib-size-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="size-grid" role="group" [attr.aria-label]="ariaLabel">
      @for (size of sizes; track size.id) {
        <button
          class="size-button"
          [class.size-button--selected]="selectedIds().includes(size.id)"
          [class.size-button--unavailable]="size.available === false"
          [class.size-button--strikethrough]="size.available === false && showStrikethrough"
          [attr.aria-pressed]="selectedIds().includes(size.id)"
          [attr.aria-disabled]="size.available === false"
          (click)="toggleSize(size)"
        >
          {{ size.label }}
        </button>
      }
    </div>
  `,
  styles: [`
    .size-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    .size-button {
      height: 48px;
      padding: 8px;
      background-color: #ffffff;
      border: 1px solid #e5e5e5;
      border-radius: 0;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #111111;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.15s ease;
    }

    .size-button:hover {
      border-color: #111111;
    }

    .size-button:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .size-button:focus:not(:focus-visible) {
      outline: none;
    }

    .size-button:focus-visible {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .size-button--selected {
      border: 1.5px solid #111111;
    }

    .size-button--unavailable {
      color: #cccccc;
    }

    .size-button--unavailable:hover {
      border-color: #e5e5e5;
    }

    .size-button--strikethrough {
      text-decoration: line-through;
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
export class SizeSelectorComponent {
  @Input() sizes: SizeOption[] = [];
  @Input() ariaLabel = 'Filter by size';
  @Input() multiSelect = true;
  @Input() showStrikethrough = false;
  @Input() set selectedSizeIds(value: string[]) {
    this.selectedIds.set(value);
  }

  @Output() selectionChange = new EventEmitter<string[]>();
  @Output() sizeSelect = new EventEmitter<SizeOption>();

  selectedIds = signal<string[]>([]);

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

    this.selectionChange.emit(this.selectedIds());
  }
}
