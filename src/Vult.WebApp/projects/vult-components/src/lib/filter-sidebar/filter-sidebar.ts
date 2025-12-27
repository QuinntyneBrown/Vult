import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FilterSection {
  id: string;
  title: string;
  type: 'checkbox' | 'size' | 'color' | 'price';
  options?: Array<{ id: string; label: string; count?: number; checked?: boolean }>;
  expanded?: boolean;
}

@Component({
  selector: 'v-filter-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="filter-sidebar" [class.filter-sidebar--hidden]="!visible()">
      <div class="filter-sidebar__header">
        <h2 class="filter-sidebar__title">{{ title }}</h2>
        @if (showCloseButton) {
          <button
            class="filter-sidebar__close"
            (click)="close()"
            aria-label="Close filters"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        }
      </div>

      <div class="filter-sidebar__content">
        @for (section of sections; track section.id) {
          <div class="filter-section">
            <button
              class="filter-section__header"
              (click)="toggleSection(section)"
              [attr.aria-expanded]="section.expanded !== false"
            >
              <span class="filter-section__title">{{ section.title }}</span>
              <svg
                class="filter-section__chevron"
                [class.filter-section__chevron--rotated]="section.expanded !== false"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            @if (section.expanded !== false && section.options) {
              <div class="filter-section__content">
                @for (option of section.options; track option.id) {
                  <label class="filter-option">
                    <input
                      type="checkbox"
                      class="filter-option__input"
                      [checked]="option.checked"
                      (change)="onFilterChange(section, option, $event)"
                    />
                    <span class="filter-option__checkmark">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </span>
                    <span class="filter-option__text">{{ option.label }}</span>
                    @if (option.count !== undefined) {
                      <span class="filter-option__count">({{ option.count }})</span>
                    }
                  </label>
                }
              </div>
            }
          </div>
        }
      </div>

      @if (showClearButton) {
        <div class="filter-sidebar__footer">
          <button class="filter-sidebar__clear" (click)="clearFilters()">
            Clear All
          </button>
        </div>
      }
    </aside>
  `,
  styles: [`
    .filter-sidebar {
      width: 100%;
      max-width: 100%;
      background-color: #ffffff;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      box-sizing: border-box;
    }

    .filter-sidebar--hidden {
      display: none;
    }

    .filter-sidebar__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 0;
      border-bottom: 1px solid #e5e5e5;
    }

    .filter-sidebar__title {
      font-size: 16px;
      font-weight: 500;
      color: #111111;
      margin: 0;
    }

    .filter-sidebar__close {
      width: 32px;
      height: 32px;
      border: none;
      background: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #111111;
    }

    .filter-sidebar__close:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .filter-sidebar__content {
      padding: 16px 8px 16px 0;
    }

    .filter-section {
      border-bottom: 1px solid #e5e5e5;
    }

    .filter-section__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 16px 0;
      background: none;
      border: none;
      cursor: pointer;
      font-family: inherit;
    }

    .filter-section__title {
      font-size: 16px;
      font-weight: 500;
      color: #111111;
      word-wrap: break-word;
      overflow-wrap: break-word;
      flex: 1;
      text-align: left;
    }

    .filter-section__chevron {
      transition: transform 0.2s ease;
    }

    .filter-section__chevron--rotated {
      transform: rotate(180deg);
    }

    .filter-section__content {
      padding-bottom: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .filter-option {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      font-size: 14px;
      color: #111111;
    }

    .filter-option__input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .filter-option__checkmark {
      width: 20px;
      height: 20px;
      border: 1.5px solid #111111;
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background-color 0.15s ease;
    }

    .filter-option__checkmark svg {
      opacity: 0;
      color: #ffffff;
      transition: opacity 0.15s ease;
    }

    .filter-option__input:checked + .filter-option__checkmark {
      background-color: #111111;
    }

    .filter-option__input:checked + .filter-option__checkmark svg {
      opacity: 1;
    }

    .filter-option__input:focus-visible + .filter-option__checkmark {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .filter-option__text {
      flex: 1;
      word-wrap: break-word;
      overflow-wrap: break-word;
      min-width: 0;
    }

    .filter-option__count {
      color: #757575;
    }

    .filter-sidebar__footer {
      padding: 16px 0;
      border-top: 1px solid #e5e5e5;
    }

    .filter-sidebar__clear {
      width: 100%;
      padding: 12px;
      background: none;
      border: 1.5px solid #111111;
      border-radius: 30px;
      font-family: inherit;
      font-size: 14px;
      font-weight: 500;
      color: #111111;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .filter-sidebar__clear:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .filter-sidebar__clear:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    @media (max-width: 1024px) {
      .filter-sidebar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
        padding: 16px 8px 16px 16px;
        overflow-y: auto;
        overflow-x: hidden;
      }

      .filter-sidebar__content {
        padding: 16px 8px 16px 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .filter-section__chevron,
      .filter-option__checkmark,
      .filter-option__checkmark svg,
      .filter-sidebar__clear {
        transition: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterSidebar {
  @Input() title = 'Filters';
  @Input() sections: FilterSection[] = [];
  @Input() showCloseButton = false;
  @Input() showClearButton = true;
  @Input() set isVisible(value: boolean) {
    this.visible.set(value);
  }

  @Output() filterChange = new EventEmitter<{ section: FilterSection; option: any; checked: boolean }>();
  @Output() clearAll = new EventEmitter<void>();
  @Output() closePanel = new EventEmitter<void>();

  visible = signal(true);

  toggleSection(section: FilterSection): void {
    section.expanded = section.expanded === false ? true : false;
  }

  onFilterChange(section: FilterSection, option: any, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.filterChange.emit({ section, option, checked });
  }

  clearFilters(): void {
    this.clearAll.emit();
  }

  close(): void {
    this.visible.set(false);
    this.closePanel.emit();
  }
}
