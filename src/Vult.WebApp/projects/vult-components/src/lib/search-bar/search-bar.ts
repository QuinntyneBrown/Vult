import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, ElementRef, ViewChild, forwardRef, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
    CurrencyPipe
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchBar),
      multi: true
    }
  ],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBar implements ControlValueAccessor {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  @Input() placeholder = 'Search';
  @Input() suggestions: SearchSuggestion[] = [];
  @Input() variant: 'compact' | 'full' = 'compact';

  @Output() search = new EventEmitter<string>();
  @Output() suggestionSelect = new EventEmitter<SearchSuggestion>();
  @Output() inputChange = new EventEmitter<string>();
  @Output() clearRecents = new EventEmitter<void>();

  readonly searchValue = signal('');
  readonly expanded = signal(false);
  readonly showSuggestions = signal(false);
  readonly disabled = signal(false);

  readonly hasValue = computed(() => this.searchValue().length > 0);

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

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

  writeValue(value: string): void {
    this.searchValue.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onFocus(): void {
    this.expanded.set(true);
    this.showSuggestions.set(true);
  }

  onBlur(): void {
    this.onTouched();
    setTimeout(() => {
      if (!this.searchValue()) {
        this.expanded.set(false);
      }
      this.showSuggestions.set(false);
    }, 200);
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchValue.set(target.value);
    this.onChange(this.searchValue());
    this.inputChange.emit(this.searchValue());
    this.showSuggestions.set(true);
  }

  onSubmit(): void {
    const value = this.searchValue().trim();
    if (value) {
      this.search.emit(value);
      this.showSuggestions.set(false);
    }
  }

  onEscape(): void {
    this.showSuggestions.set(false);
    this.searchInput.nativeElement.blur();
  }

  clearSearch(): void {
    this.searchValue.set('');
    this.onChange('');
    this.searchInput.nativeElement.focus();
    this.inputChange.emit('');
  }

  selectSuggestion(suggestion: SearchSuggestion): void {
    this.searchValue.set(suggestion.text);
    this.onChange(suggestion.text);
    this.suggestionSelect.emit(suggestion);
    this.showSuggestions.set(false);
  }

  clearRecent(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.clearRecents.emit();
  }
}
