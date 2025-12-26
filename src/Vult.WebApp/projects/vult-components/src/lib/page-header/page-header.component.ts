import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type PageHeaderAlignment = 'left' | 'center';

@Component({
  selector: 'lib-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header
      class="page-header"
      [class.page-header--center]="alignment === 'center'"
    >
      <h1 class="page-header__title">
        {{ title }}
        @if (count !== undefined) {
          <span class="page-header__count">({{ count }})</span>
        }
      </h1>
      @if (subtitle) {
        <p class="page-header__subtitle" [innerHTML]="subtitle"></p>
      }
    </header>
  `,
  styles: [`
    .page-header {
      width: 100%;
      background-color: #ffffff;
      padding: 24px 48px 16px;
      text-align: left;
    }

    .page-header--center {
      text-align: center;
    }

    .page-header__title {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 28px;
      font-weight: 500;
      line-height: 1.2;
      color: #111111;
      margin: 0;
    }

    .page-header__count {
      font-weight: 400;
      color: #757575;
      margin-left: 8px;
    }

    .page-header__subtitle {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 16px;
      font-weight: 400;
      line-height: 1.5;
      color: #757575;
      margin: 8px 0 0;
      max-width: 600px;
    }

    .page-header--center .page-header__subtitle {
      margin-left: auto;
      margin-right: auto;
    }

    .page-header__subtitle :deep(a) {
      color: #111111;
      text-decoration: underline;
    }

    .page-header__subtitle :deep(a:hover) {
      color: #757575;
    }

    .page-header__subtitle :deep(a:focus) {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    @media (max-width: 768px) {
      .page-header {
        padding: 16px 16px 12px;
      }

      .page-header__title {
        font-size: 24px;
      }

      .page-header__subtitle {
        font-size: 14px;
        margin-top: 4px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .page-header__subtitle :deep(a) {
        transition: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() count?: number;
  @Input() alignment: PageHeaderAlignment = 'left';
}
