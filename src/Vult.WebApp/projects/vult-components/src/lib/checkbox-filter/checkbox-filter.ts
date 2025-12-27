import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface CheckboxOption {
  id: string;
  label: string;
  count?: number;
  checked?: boolean;
}

@Component({
  selector: 'v-checkbox-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="checkbox-filter" role="group" [attr.aria-labelledby]="labelId">
      @if (label) {
        <button
          class="checkbox-filter__header"
          [id]="labelId"
          (click)="toggleExpanded()"
          [attr.aria-expanded]="expanded()"
          [attr.aria-controls]="contentId"
        >
          <span class="checkbox-filter__label">{{ label }}</span>
          <svg
            class="checkbox-filter__chevron"
            [class.checkbox-filter__chevron--rotated]="expanded()"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      }

      <div
        [id]="contentId"
        class="checkbox-filter__content"
        [class.checkbox-filter__content--collapsed]="!expanded()"
      >
        @for (option of options; track option.id) {
          <label class="checkbox-filter__option">
            <input
              type="checkbox"
              class="checkbox-filter__input"
              [checked]="option.checked"
              (change)="onOptionChange(option, $event)"
            />
            <span class="checkbox-filter__checkmark">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <span class="checkbox-filter__text">{{ option.label }}</span>
            @if (option.count !== undefined) {
              <span class="checkbox-filter__count">({{ option.count }})</span>
            }
          </label>
        }
      </div>
    </div>
  `,
  styles: [`
    .checkbox-filter {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }

    .checkbox-filter__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 16px 0;
      background: none;
      border: none;
      border-bottom: 1px solid #e5e5e5;
      cursor: pointer;
      font-family: inherit;
    }

    .checkbox-filter__label {
      font-size: 16px;
      font-weight: 500;
      color: #111111;
    }

    .checkbox-filter__chevron {
      transition: transform 0.2s ease;
    }

    .checkbox-filter__chevron--rotated {
      transform: rotate(180deg);
    }

    .checkbox-filter__content {
      padding: 16px 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .checkbox-filter__content--collapsed {
      display: none;
    }

    .checkbox-filter__option {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      font-size: 14px;
      color: #111111;
    }

    .checkbox-filter__input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .checkbox-filter__checkmark {
      width: 20px;
      height: 20px;
      border: 1.5px solid #111111;
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background-color 0.15s ease, border-color 0.15s ease;
    }

    .checkbox-filter__checkmark svg {
      opacity: 0;
      color: #ffffff;
      transition: opacity 0.15s ease;
    }

    .checkbox-filter__input:checked + .checkbox-filter__checkmark {
      background-color: #111111;
    }

    .checkbox-filter__input:checked + .checkbox-filter__checkmark svg {
      opacity: 1;
    }

    .checkbox-filter__input:focus-visible + .checkbox-filter__checkmark {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .checkbox-filter__option:hover .checkbox-filter__checkmark {
      border-color: #757575;
    }

    .checkbox-filter__text {
      flex: 1;
    }

    .checkbox-filter__count {
      color: #757575;
    }

    @media (prefers-reduced-motion: reduce) {
      .checkbox-filter__chevron,
      .checkbox-filter__checkmark,
      .checkbox-filter__checkmark svg {
        transition: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxFilter {
  @Input() label = '';
  @Input() options: CheckboxOption[] = [];
  @Input() collapsible = true;

  @Output() optionChange = new EventEmitter<{ option: CheckboxOption; checked: boolean }>();

  expanded = signal(true);

  get labelId(): string {
    return `checkbox-filter-label-${this.label.replace(/\s+/g, '-').toLowerCase()}`;
  }

  get contentId(): string {
    return `checkbox-filter-content-${this.label.replace(/\s+/g, '-').toLowerCase()}`;
  }

  toggleExpanded(): void {
    if (this.collapsible) {
      this.expanded.update(v => !v);
    }
  }

  onOptionChange(option: CheckboxOption, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.optionChange.emit({ option, checked });
  }
}
