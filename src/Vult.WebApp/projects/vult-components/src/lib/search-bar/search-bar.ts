import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'trending' | 'product';
  imageUrl?: string;
  category?: string;
  price?: number;
}

@Component({
  selector: 'v-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="search-container"
      role="search"
      [class.search-container--expanded]="expanded()"
    >
      <label for="search-input" class="sr-only">Search</label>
      <svg class="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/>
        <path d="M20 20L16.5 16.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <input
        #searchInput
        id="search-input"
        type="text"
        class="search-input"
        [class.compact]="!expanded() && variant === 'compact'"
        [class.expanded]="expanded()"
        [class.full-width]="variant === 'full'"
        [placeholder]="placeholder"
        [(ngModel)]="searchValue"
        [attr.aria-autocomplete]="suggestions.length > 0 ? 'list' : null"
        [attr.aria-controls]="suggestions.length > 0 ? 'search-dropdown' : null"
        [attr.aria-expanded]="showSuggestions() && suggestions.length > 0"
        (focus)="onFocus()"
        (blur)="onBlur()"
        (input)="onInput()"
        (keydown.enter)="onSubmit()"
        (keydown.escape)="onEscape()"
      />
      <button
        class="clear-btn"
        [class.visible]="searchValue.length > 0"
        aria-label="Clear search"
        (click)="clearSearch()"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#757575"/>
          <path d="M15 9L9 15M9 9L15 15" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>

      @if (showSuggestions() && suggestions.length > 0) {
        <div id="search-dropdown" class="search-dropdown" role="listbox">
          @for (group of groupedSuggestions; track group.title) {
            <div class="dropdown-section">
              <div class="dropdown-title">
                {{ group.title }}
                @if (group.type === 'recent') {
                  <a href="#" class="dropdown-clear" (click)="clearRecent($event)">Clear</a>
                }
              </div>
              @for (suggestion of group.items; track suggestion.id) {
                <div
                  class="suggestion-item"
                  [class.product-suggestion]="suggestion.type === 'product'"
                  role="option"
                  tabindex="0"
                  (click)="selectSuggestion(suggestion)"
                  (keydown.enter)="selectSuggestion(suggestion)"
                >
                  @if (suggestion.type === 'product' && suggestion.imageUrl) {
                    <div class="product-thumb">
                      <img [src]="suggestion.imageUrl" [alt]="suggestion.text" />
                    </div>
                    <div class="product-info">
                      <span class="product-name">{{ suggestion.text }}</span>
                      @if (suggestion.category) {
                        <span class="product-category">{{ suggestion.category }}</span>
                      }
                    </div>
                    @if (suggestion.price) {
                      <span class="product-price">{{ suggestion.price | currency }}</span>
                    }
                  } @else {
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      @if (suggestion.type === 'recent') {
                        <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" stroke-width="1.5"/>
                        <path d="M10 6V10L13 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                      } @else {
                        <path d="M17 17L13.5 13.5M15 9C15 12.3137 12.3137 15 9 15C5.68629 15 3 12.3137 3 9C3 5.68629 5.68629 3 9 3C12.3137 3 15 5.68629 15 9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                      }
                    </svg>
                    <span class="suggestion-text">{{ suggestion.text }}</span>
                  }
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .search-container {
      position: relative;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    .search-input {
      height: 40px;
      border: none;
      border-radius: 20px;
      background-color: #f5f5f5;
      padding: 0 40px 0 44px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 16px;
      transition: width 0.2s ease, background-color 0.2s ease;
      outline: none;
    }

    .search-input::placeholder {
      color: #757575;
    }

    .search-input:focus {
      background-color: #e5e5e5;
    }

    .search-input.compact {
      width: 180px;
    }

    .search-input.expanded {
      width: 280px;
      background-color: #e5e5e5;
    }

    .search-input.full-width {
      width: 100%;
    }

    .search-input:focus-visible {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .search-input:focus:not(:focus-visible) {
      outline: none;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;
      color: #111111;
      pointer-events: none;
    }

    .clear-btn {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;
      border: none;
      background: none;
      padding: 0;
      cursor: pointer;
      display: none;
    }

    .clear-btn.visible {
      display: block;
    }

    .clear-btn svg {
      width: 24px;
      height: 24px;
      transition: opacity 0.15s ease;
    }

    .clear-btn:hover svg {
      opacity: 0.8;
    }

    .clear-btn:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
      border-radius: 2px;
    }

    .search-dropdown {
      position: absolute;
      top: 48px;
      left: 0;
      width: 400px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 100;
      max-height: 400px;
      overflow-y: auto;
    }

    .dropdown-section {
      padding: 16px;
    }

    .dropdown-section:not(:last-child) {
      border-bottom: 1px solid #e5e5e5;
    }

    .dropdown-title {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 12px;
      font-weight: 500;
      color: #757575;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .dropdown-clear {
      font-size: 12px;
      color: #757575;
      text-decoration: underline;
      text-transform: none;
      letter-spacing: 0;
    }

    .suggestion-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px;
      cursor: pointer;
      transition: background-color 0.15s ease;
      border-radius: 4px;
      margin: 0 -8px;
    }

    .suggestion-item:hover,
    .suggestion-item:focus {
      background-color: #f5f5f5;
      outline: none;
    }

    .suggestion-item svg {
      width: 20px;
      height: 20px;
      color: #757575;
      flex-shrink: 0;
    }

    .suggestion-text {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 16px;
      color: #111111;
      flex-grow: 1;
    }

    .product-thumb {
      width: 56px;
      height: 56px;
      background-color: #f5f5f5;
      border-radius: 4px;
      flex-shrink: 0;
      overflow: hidden;
    }

    .product-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-info {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .product-name {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #111111;
    }

    .product-category {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 12px;
      color: #757575;
    }

    .product-price {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #111111;
    }

    @media (max-width: 768px) {
      .search-dropdown {
        width: calc(100vw - 32px);
        left: 50%;
        transform: translateX(-50%);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .search-input,
      .clear-btn svg,
      .suggestion-item {
        transition: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBar {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  @Input() placeholder = 'Search';
  @Input() suggestions: SearchSuggestion[] = [];
  @Input() variant: 'compact' | 'full' = 'compact';

  @Output() search = new EventEmitter<string>();
  @Output() suggestionSelect = new EventEmitter<SearchSuggestion>();
  @Output() inputChange = new EventEmitter<string>();
  @Output() clearRecents = new EventEmitter<void>();

  searchValue = '';
  expanded = signal(false);
  showSuggestions = signal(false);

  get groupedSuggestions(): Array<{ title: string; type: string; items: SearchSuggestion[] }> {
    const groups: Record<string, SearchSuggestion[]> = {};

    for (const suggestion of this.suggestions) {
      const key = suggestion.type;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(suggestion);
    }

    const result: Array<{ title: string; type: string; items: SearchSuggestion[] }> = [];

    if (groups['recent']) {
      result.push({ title: 'Recent Searches', type: 'recent', items: groups['recent'] });
    }
    if (groups['trending']) {
      result.push({ title: 'Trending', type: 'trending', items: groups['trending'] });
    }
    if (groups['product']) {
      result.push({ title: 'Products', type: 'product', items: groups['product'] });
    }

    return result;
  }

  onFocus(): void {
    this.expanded.set(true);
    this.showSuggestions.set(true);
  }

  onBlur(): void {
    setTimeout(() => {
      if (!this.searchValue) {
        this.expanded.set(false);
      }
      this.showSuggestions.set(false);
    }, 200);
  }

  onInput(): void {
    this.inputChange.emit(this.searchValue);
    this.showSuggestions.set(true);
  }

  onSubmit(): void {
    if (this.searchValue.trim()) {
      this.search.emit(this.searchValue.trim());
      this.showSuggestions.set(false);
    }
  }

  onEscape(): void {
    this.showSuggestions.set(false);
    this.searchInput.nativeElement.blur();
  }

  clearSearch(): void {
    this.searchValue = '';
    this.searchInput.nativeElement.focus();
    this.inputChange.emit('');
  }

  selectSuggestion(suggestion: SearchSuggestion): void {
    this.searchValue = suggestion.text;
    this.suggestionSelect.emit(suggestion);
    this.showSuggestions.set(false);
  }

  clearRecent(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.clearRecents.emit();
  }
}
