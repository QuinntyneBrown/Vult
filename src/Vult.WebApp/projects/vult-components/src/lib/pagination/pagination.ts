import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type PaginationVariant = 'numbered' | 'load-more';

@Component({
  selector: 'v-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (variant === 'numbered') {
      <nav class="pagination" aria-label="Pagination">
        <button
          class="pagination__button"
          [class.pagination__button--disabled]="currentPage() === 1"
          [disabled]="currentPage() === 1"
          aria-label="Previous page"
          (click)="goToPage(currentPage() - 1)"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        @for (page of visiblePages(); track page) {
          @if (page === '...') {
            <span class="pagination__ellipsis">...</span>
          } @else {
            <button
              class="pagination__button"
              [class.pagination__button--current]="page === currentPage()"
              [attr.aria-current]="page === currentPage() ? 'page' : null"
              [attr.aria-label]="'Page ' + page"
              (click)="goToPage(+page)"
            >
              {{ page }}
            </button>
          }
        }

        <button
          class="pagination__button"
          [class.pagination__button--disabled]="currentPage() === totalPages"
          [disabled]="currentPage() === totalPages"
          aria-label="Next page"
          (click)="goToPage(currentPage() + 1)"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </nav>
    } @else {
      <div class="load-more">
        @if (showingCount !== undefined && totalCount !== undefined) {
          <p class="load-more__progress">
            Showing {{ showingCount }} of {{ totalCount }}
          </p>
        }
        <button
          class="load-more__button"
          [disabled]="loading"
          (click)="loadMore.emit()"
        >
          @if (loading) {
            <span class="load-more__spinner"></span>
          } @else {
            {{ loadMoreText }}
          }
        </button>
      </div>
    }
  `,
  styles: [`
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 4px;
      padding: 24px 0;
    }

    .pagination__button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: transparent;
      border: none;
      border-radius: 0;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #111111;
      cursor: pointer;
      transition: background-color 0.15s ease;
    }

    .pagination__button:hover:not(.pagination__button--disabled) {
      background-color: #f5f5f5;
    }

    .pagination__button:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .pagination__button--current {
      font-weight: 500;
      text-decoration: underline;
    }

    .pagination__button--disabled {
      color: #cccccc;
      cursor: not-allowed;
    }

    .pagination__button svg {
      width: 20px;
      height: 20px;
    }

    .pagination__ellipsis {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      font-size: 14px;
      color: #111111;
    }

    .load-more {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 24px 0;
    }

    .load-more__progress {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #757575;
      margin: 0;
    }

    .load-more__button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 200px;
      height: 48px;
      background-color: #ffffff;
      border: 1.5px solid #111111;
      border-radius: 24px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #111111;
      cursor: pointer;
      transition: background-color 0.15s ease, color 0.15s ease;
    }

    .load-more__button:hover {
      background-color: #111111;
      color: #ffffff;
    }

    .load-more__button:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .load-more__button:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }

    .load-more__spinner {
      width: 20px;
      height: 20px;
      border: 2px solid #111111;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (max-width: 768px) {
      .pagination--mobile {
        gap: 8px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .pagination__button,
      .load-more__button {
        transition: none;
      }

      .load-more__spinner {
        animation: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pagination {
  @Input() variant: PaginationVariant = 'numbered';
  @Input() totalPages = 1;
  @Input() maxVisiblePages = 7;
  @Input() loadMoreText = 'Load More';
  @Input() loading = false;
  @Input() showingCount?: number;
  @Input() totalCount?: number;
  @Input() set page(value: number) {
    this.currentPage.set(value);
  }

  @Output() pageChange = new EventEmitter<number>();
  @Output() loadMore = new EventEmitter<void>();

  currentPage = signal(1);

  visiblePages = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages;
    const max = this.maxVisiblePages;

    if (total <= max) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const half = Math.floor(max / 2);

    if (current <= half + 1) {
      for (let i = 1; i <= max - 2; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    } else if (current >= total - half) {
      pages.push(1);
      pages.push('...');
      for (let i = total - max + 3; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    }

    return pages;
  });

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage()) {
      this.currentPage.set(page);
      this.pageChange.emit(page);
    }
  }
}
