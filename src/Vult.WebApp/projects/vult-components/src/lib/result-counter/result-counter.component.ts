import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-result-counter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p
      class="result-counter"
      [class.result-counter--loading]="loading"
      [class.result-counter--animated]="animated"
      [class.result-counter--updating]="updating"
      role="status"
      aria-live="polite"
    >
      @if (loading) {
        <span class="result-counter__number"></span>
      } @else {
        <span class="result-counter__number">{{ count }}</span>
      }
      {{ count === 1 ? singularLabel : pluralLabel }}
    </p>
  `,
  styles: [`
    .result-counter {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 16px;
      font-weight: 500;
      line-height: 1.5;
      color: #111111;
      margin: 0;
    }

    .result-counter__number {
      font-variant-numeric: tabular-nums;
    }

    .result-counter--loading .result-counter__number {
      display: inline-block;
      width: 40px;
      height: 16px;
      background-color: #e5e5e5;
      border-radius: 2px;
      vertical-align: middle;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .result-counter--animated {
      transition: opacity 0.2s ease;
    }

    .result-counter--updating {
      opacity: 0.5;
    }

    @media (max-width: 768px) {
      .result-counter {
        font-size: 14px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .result-counter--loading .result-counter__number {
        animation: none;
      }

      .result-counter--animated {
        transition: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultCounterComponent {
  @Input() count = 0;
  @Input() singularLabel = 'Result';
  @Input() pluralLabel = 'Results';
  @Input() loading = false;
  @Input() animated = false;
  @Input() updating = false;
}
