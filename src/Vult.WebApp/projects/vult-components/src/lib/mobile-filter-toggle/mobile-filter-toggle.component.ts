import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-mobile-filter-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="mobile-filter-toggle"
      [class.mobile-filter-toggle--active]="isActive"
      [attr.aria-expanded]="isActive"
      [attr.aria-controls]="controlsId"
      (click)="toggle()"
    >
      <svg class="mobile-filter-toggle__icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="8" cy="6" r="2" fill="currentColor"/>
        <circle cx="16" cy="12" r="2" fill="currentColor"/>
        <circle cx="10" cy="18" r="2" fill="currentColor"/>
      </svg>
      <span class="mobile-filter-toggle__text">
        {{ isActive ? hideText : showText }}
      </span>
      @if (activeFilterCount > 0) {
        <span class="mobile-filter-toggle__count" aria-label="Active filters">
          {{ activeFilterCount }}
        </span>
      }
    </button>
  `,
  styles: [`
    .mobile-filter-toggle {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 40px;
      padding: 0 16px;
      background-color: #ffffff;
      border: 1px solid #e5e5e5;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #111111;
      cursor: pointer;
      transition: border-color 0.15s ease;
    }

    .mobile-filter-toggle:hover {
      border-color: #111111;
    }

    .mobile-filter-toggle:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .mobile-filter-toggle--active {
      border-color: #111111;
    }

    .mobile-filter-toggle__icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .mobile-filter-toggle__text {
      white-space: nowrap;
    }

    .mobile-filter-toggle__count {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      height: 20px;
      padding: 0 6px;
      background-color: #111111;
      color: #ffffff;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 500;
    }

    @media (min-width: 769px) {
      .mobile-filter-toggle {
        display: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .mobile-filter-toggle {
        transition: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileFilterToggleComponent {
  @Input() isActive = false;
  @Input() showText = 'Show Filters';
  @Input() hideText = 'Hide Filters';
  @Input() activeFilterCount = 0;
  @Input() controlsId = '';

  @Output() toggleFilters = new EventEmitter<boolean>();

  toggle(): void {
    this.toggleFilters.emit(!this.isActive);
  }
}
