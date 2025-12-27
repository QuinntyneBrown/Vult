import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

@Component({
  selector: 'v-breadcrumb-navigation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <ol class="breadcrumb__list">
        @for (item of items; track item.label; let last = $last) {
          <li class="breadcrumb__item">
            @if (!last && item.href) {
              <a
                class="breadcrumb__link"
                [href]="item.href"
                (click)="onItemClick($event, item)"
              >
                {{ item.label }}
              </a>
            } @else {
              <span
                class="breadcrumb__current"
                [attr.aria-current]="last ? 'page' : null"
              >
                {{ item.label }}
              </span>
            }
            @if (!last) {
              <span class="breadcrumb__separator" aria-hidden="true">/</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: [`
    .breadcrumb {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 12px;
      color: #757575;
    }

    .breadcrumb__list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .breadcrumb__item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .breadcrumb__link {
      color: #757575;
      text-decoration: none;
      transition: color 0.15s ease;
    }

    .breadcrumb__link:hover {
      color: #111111;
      text-decoration: underline;
    }

    .breadcrumb__link:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .breadcrumb__current {
      color: #111111;
      font-weight: 500;
    }

    .breadcrumb__separator {
      color: #757575;
    }

    @media (prefers-reduced-motion: reduce) {
      .breadcrumb__link {
        transition: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbNavigation {
  @Input() items: BreadcrumbItem[] = [];
  @Output() itemClick = new EventEmitter<BreadcrumbItem>();

  onItemClick(event: Event, item: BreadcrumbItem): void {
    event.preventDefault();
    this.itemClick.emit(item);
  }
}
