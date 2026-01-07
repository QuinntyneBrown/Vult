import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  signal,
  ElementRef,
  ViewChild,
  effect,
  PLATFORM_ID,
  inject,
  AfterViewInit
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';

export interface SearchOverlaySuggestion {
  id: string;
  text: string;
  type: 'recent' | 'trending' | 'product';
  imageUrl?: string;
  category?: string;
  href?: string;
}

@Component({
  selector: 'v-search-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-overlay.html',
  styleUrl: './search-overlay.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchOverlay implements AfterViewInit {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  @Input() set isOpen(value: boolean) {
    this._isOpen.set(value);
    if (value) {
      this.searchValue.set('');
      this.focusSearchInput();
      this.lockBodyScroll();
    } else {
      this.unlockBodyScroll();
    }
  }

  @Input() placeholder = 'Search';
  @Input() trendingSearches: SearchOverlaySuggestion[] = [];
  @Input() recentSearches: SearchOverlaySuggestion[] = [];
  @Input() productSuggestions: SearchOverlaySuggestion[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();
  @Output() suggestionSelect = new EventEmitter<SearchOverlaySuggestion>();
  @Output() clearRecents = new EventEmitter<void>();

  readonly _isOpen = signal(false);
  readonly searchValue = signal('');
  readonly isVisible = signal(false);

  constructor() {
    effect(() => {
      if (this._isOpen()) {
        setTimeout(() => this.isVisible.set(true), 10);
      } else {
        this.isVisible.set(false);
      }
    });
  }

  ngAfterViewInit(): void {
    if (this._isOpen()) {
      this.focusSearchInput();
    }
  }

  private focusSearchInput(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.searchInput?.nativeElement?.focus();
      }, 100);
    }
  }

  private lockBodyScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.document.body.style.overflow = 'hidden';
    }
  }

  private unlockBodyScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.document.body.style.overflow = '';
    }
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchValue.set(target.value);
  }

  onSubmit(): void {
    const value = this.searchValue().trim();
    if (value) {
      this.search.emit(value);
      this.onClose();
    }
  }

  onClose(): void {
    this.isVisible.set(false);
    setTimeout(() => {
      this._isOpen.set(false);
      this.close.emit();
    }, 300);
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as Element).classList.contains('search-overlay')) {
      this.onClose();
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.onClose();
    }
  }

  selectSuggestion(suggestion: SearchOverlaySuggestion): void {
    this.suggestionSelect.emit(suggestion);
    this.onClose();
  }

  onClearRecents(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.clearRecents.emit();
  }

  clearSearch(): void {
    this.searchValue.set('');
    this.focusSearchInput();
  }

  get hasValue(): boolean {
    return this.searchValue().length > 0;
  }

  get hasTrendingSearches(): boolean {
    return this.trendingSearches.length > 0;
  }

  get hasRecentSearches(): boolean {
    return this.recentSearches.length > 0;
  }

  get hasProductSuggestions(): boolean {
    return this.productSuggestions.length > 0;
  }
}
