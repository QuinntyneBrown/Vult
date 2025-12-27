import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SortOption {
  id: string;
  label: string;
}

@Component({
  selector: 'v-sort-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="sort-dropdown"
      [class.sort-dropdown--open]="isOpen()"
    >
      <button
        class="sort-dropdown__trigger"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-controls]="menuId"
        aria-haspopup="listbox"
        (click)="toggleDropdown()"
        (keydown.arrowdown)="openAndFocusFirst($event)"
        (keydown.escape)="closeDropdown()"
      >
        <span class="sort-dropdown__trigger-content">
          @if (showLabel) {
            <span class="sort-dropdown__label">{{ label }}</span>
          }
          <span class="sort-dropdown__value">{{ selectedOption?.label || 'Select' }}</span>
        </span>
        <svg
          class="sort-dropdown__chevron"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <ul
        [id]="menuId"
        class="sort-dropdown__menu"
        role="listbox"
        [attr.aria-label]="label"
      >
        @for (option of options; track option.id) {
          <li role="none">
            <button
              class="sort-dropdown__option"
              [class.sort-dropdown__option--selected]="selectedId() === option.id"
              role="option"
              [attr.aria-selected]="selectedId() === option.id"
              (click)="selectOption(option)"
              (keydown.escape)="closeDropdown()"
            >
              <svg
                class="sort-dropdown__checkmark"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path d="M3 8L6.5 11.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ option.label }}
            </button>
          </li>
        }
      </ul>
    </div>
  `,
  styles: [`
    .sort-dropdown {
      position: relative;
      width: 200px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }

    .sort-dropdown__trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 40px;
      padding: 0 16px;
      background-color: #ffffff;
      border: 1px solid #e5e5e5;
      border-radius: 0;
      cursor: pointer;
      font-family: inherit;
      transition: border-color 0.15s ease;
    }

    .sort-dropdown__trigger:hover {
      border-color: #111111;
    }

    .sort-dropdown__trigger:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .sort-dropdown--open .sort-dropdown__trigger {
      border-color: #111111;
    }

    .sort-dropdown__trigger-content {
      display: flex;
      align-items: center;
    }

    .sort-dropdown__label {
      font-size: 14px;
      color: #757575;
      margin-right: 4px;
    }

    .sort-dropdown__value {
      font-size: 14px;
      font-weight: 500;
      color: #111111;
    }

    .sort-dropdown__chevron {
      width: 12px;
      height: 12px;
      margin-left: 8px;
      transition: transform 0.2s ease;
    }

    .sort-dropdown--open .sort-dropdown__chevron {
      transform: rotate(180deg);
    }

    .sort-dropdown__menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin: 4px 0 0;
      padding: 0;
      background-color: #ffffff;
      border: 1px solid #e5e5e5;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      z-index: 100;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-8px);
      transition: opacity 0.15s ease, transform 0.15s ease, visibility 0.15s;
      list-style: none;
    }

    .sort-dropdown--open .sort-dropdown__menu {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .sort-dropdown__option {
      display: flex;
      align-items: center;
      width: 100%;
      height: 40px;
      padding: 0 16px;
      background: none;
      border: none;
      font-family: inherit;
      font-size: 14px;
      color: #111111;
      cursor: pointer;
      text-align: left;
      transition: background-color 0.1s ease;
    }

    .sort-dropdown__option:hover,
    .sort-dropdown__option:focus {
      background-color: #f5f5f5;
      outline: none;
    }

    .sort-dropdown__option--selected {
      font-weight: 500;
    }

    .sort-dropdown__checkmark {
      width: 16px;
      height: 16px;
      margin-right: 12px;
      opacity: 0;
    }

    .sort-dropdown__option--selected .sort-dropdown__checkmark {
      opacity: 1;
    }

    @media (max-width: 768px) {
      .sort-dropdown {
        width: 100%;
      }

      .sort-dropdown__trigger {
        height: 48px;
      }

      .sort-dropdown__option {
        height: 48px;
        border-bottom: 1px solid #e5e5e5;
      }

      .sort-dropdown__option:last-child {
        border-bottom: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .sort-dropdown__trigger,
      .sort-dropdown__menu,
      .sort-dropdown__chevron,
      .sort-dropdown__option {
        transition: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortDropdown {
  @Input() options: SortOption[] = [];
  @Input() label = 'Sort By:';
  @Input() showLabel = true;
  @Input() set selectedOptionId(value: string | undefined) {
    if (value) {
      this.selectedId.set(value);
    }
  }

  @Output() selectionChange = new EventEmitter<SortOption>();

  isOpen = signal(false);
  selectedId = signal<string | undefined>(undefined);

  menuId = `sort-dropdown-menu-${Math.random().toString(36).substring(2, 9)}`;

  constructor(private elementRef: ElementRef) {}

  get selectedOption(): SortOption | undefined {
    return this.options.find(o => o.id === this.selectedId());
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  toggleDropdown(): void {
    this.isOpen.update(v => !v);
  }

  closeDropdown(): void {
    this.isOpen.set(false);
  }

  openAndFocusFirst(event: Event): void {
    event.preventDefault();
    this.isOpen.set(true);
  }

  selectOption(option: SortOption): void {
    this.selectedId.set(option.id);
    this.selectionChange.emit(option);
    this.closeDropdown();
  }
}
