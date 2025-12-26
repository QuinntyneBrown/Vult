import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type FavoritesButtonVariant = 'icon-only' | 'full-width';

@Component({
  selector: 'lib-favorites-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (variant === 'icon-only') {
      <button
        class="favorites-btn"
        [class.favorites-btn--favorited]="isFavorited"
        [class.favorites-btn--loading]="loading"
        [class.favorites-btn--animating]="isAnimating()"
        [attr.aria-label]="isFavorited ? 'Remove from favorites' : 'Add to favorites'"
        [attr.aria-pressed]="isFavorited"
        [disabled]="loading"
        (click)="handleClick()"
      >
        @if (!loading) {
          <svg class="favorites-btn__icon" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        }
      </button>
    } @else {
      <button
        class="favorites-btn--full"
        [class.favorites-btn--favorited]="isFavorited"
        [class.favorites-btn--loading]="loading"
        [class.favorites-btn--animating]="isAnimating()"
        [attr.aria-label]="isFavorited ? 'Remove from favorites' : 'Add to favorites'"
        [attr.aria-pressed]="isFavorited"
        [disabled]="loading"
        (click)="handleClick()"
      >
        @if (!loading) {
          <svg class="favorites-btn__icon" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        }
        <span class="favorites-btn__text">
          {{ isFavorited ? 'Favorited' : 'Favorite' }}
        </span>
      </button>
    }
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    /* Icon-Only Button */
    .favorites-btn {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: transparent;
      border: 1px solid #e5e5e5;
      border-radius: 50%;
      cursor: pointer;
      transition: background-color 0.15s ease, transform 0.15s ease, border-color 0.15s ease;
      padding: 0;
    }

    .favorites-btn:hover {
      background-color: #f5f5f5;
    }

    .favorites-btn:active {
      transform: scale(0.95);
    }

    .favorites-btn:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .favorites-btn:focus:not(:focus-visible) {
      outline: none;
    }

    .favorites-btn:focus-visible {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .favorites-btn__icon {
      width: 24px;
      height: 24px;
      stroke: #111111;
      fill: none;
      stroke-width: 1.5;
      transition: transform 0.2s ease;
    }

    .favorites-btn--favorited .favorites-btn__icon {
      fill: #111111;
      stroke: #111111;
    }

    .favorites-btn--animating .favorites-btn__icon {
      animation: heart-pop 0.3s ease;
    }

    /* Loading State */
    .favorites-btn--loading::after {
      content: '';
      width: 20px;
      height: 20px;
      border: 2px solid #e5e5e5;
      border-top-color: #111111;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    /* Full-Width Button */
    .favorites-btn--full {
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background-color: #ffffff;
      border: 1.5px solid #cccccc;
      border-radius: 30px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 16px;
      font-weight: 500;
      color: #111111;
      cursor: pointer;
      transition: border-color 0.15s ease, transform 0.1s ease;
      padding: 0 24px;
    }

    .favorites-btn--full:hover {
      border-color: #111111;
    }

    .favorites-btn--full:active {
      transform: scale(0.98);
    }

    .favorites-btn--full:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .favorites-btn--full:focus:not(:focus-visible) {
      outline: none;
    }

    .favorites-btn--full:focus-visible {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .favorites-btn--full.favorites-btn--favorited {
      border-color: #111111;
    }

    .favorites-btn--full .favorites-btn__icon {
      flex-shrink: 0;
    }

    .favorites-btn--full.favorites-btn--loading .favorites-btn__icon,
    .favorites-btn--full.favorites-btn--loading .favorites-btn__text {
      display: none;
    }

    .favorites-btn--full.favorites-btn--loading::after {
      content: '';
      width: 20px;
      height: 20px;
      border: 2px solid #e5e5e5;
      border-top-color: #111111;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes heart-pop {
      0% { transform: scale(1); }
      50% { transform: scale(1.3); }
      100% { transform: scale(1); }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (prefers-reduced-motion: reduce) {
      .favorites-btn,
      .favorites-btn--full,
      .favorites-btn__icon {
        transition: none;
      }

      .favorites-btn:active,
      .favorites-btn--full:active {
        transform: none;
      }

      .favorites-btn--animating .favorites-btn__icon {
        animation: none;
      }

      .favorites-btn--loading::after,
      .favorites-btn--full.favorites-btn--loading::after {
        animation: none;
        border-right-color: #111111;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesButtonComponent {
  @Input() isFavorited = false;
  @Input() loading = false;
  @Input() variant: FavoritesButtonVariant = 'icon-only';

  @Output() favoriteToggle = new EventEmitter<boolean>();

  isAnimating = signal(false);

  handleClick(): void {
    if (!this.loading) {
      this.isAnimating.set(true);

      // Remove animation class after animation completes
      setTimeout(() => {
        this.isAnimating.set(false);
      }, 300);

      this.favoriteToggle.emit(!this.isFavorited);
    }
  }
}
