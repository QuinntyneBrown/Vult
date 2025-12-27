import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  children?: NavItem[];
}

@Component({
  selector: 'v-navigation-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="nav" role="navigation" [attr.aria-label]="ariaLabel">
      <div class="nav__container">
        <a class="nav__logo" [href]="logoHref" (click)="onLogoClick($event)">
          <ng-content select="[logo]"></ng-content>
        </a>

        <ul class="nav__menu" role="menubar">
          @for (item of items; track item.id) {
            <li
              class="nav__item"
              [class.nav__item--active]="activeItemId === item.id"
              role="none"
            >
              <a
                class="nav__link"
                [href]="item.href || '#'"
                role="menuitem"
                [attr.aria-haspopup]="item.children ? 'true' : null"
                (click)="onItemClick($event, item)"
                (mouseenter)="onItemHover(item)"
                (mouseleave)="onItemLeave()"
              >
                {{ item.label }}
              </a>
              @if (item.children && hoveredItemId() === item.id) {
                <div class="nav__dropdown" role="menu">
                  @for (child of item.children; track child.id) {
                    <a
                      class="nav__dropdown-item"
                      [href]="child.href || '#'"
                      role="menuitem"
                      (click)="onItemClick($event, child)"
                    >
                      {{ child.label }}
                    </a>
                  }
                </div>
              }
            </li>
          }
        </ul>

        <div class="nav__actions">
          <ng-content select="[actions]"></ng-content>
        </div>

        <button
          class="nav__mobile-toggle"
          [attr.aria-expanded]="mobileMenuOpen()"
          aria-label="Toggle menu"
          (click)="toggleMobileMenu()"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            @if (mobileMenuOpen()) {
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            } @else {
              <path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            }
          </svg>
        </button>
      </div>

      @if (mobileMenuOpen()) {
        <div class="nav__mobile-menu">
          @for (item of items; track item.id) {
            <a
              class="nav__mobile-item"
              [href]="item.href || '#'"
              (click)="onMobileItemClick($event, item)"
            >
              {{ item.label }}
              @if (item.children) {
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              }
            </a>
          }
        </div>
      }
    </nav>
  `,
  styles: [`
    .nav {
      background-color: #ffffff;
      border-bottom: 1px solid #e5e5e5;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      position: -webkit-sticky;
      position: sticky;
      top: 0;
      z-index: 1000;
      width: 100%;
    }

    .nav__container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 48px;
      height: 60px;
    }

    .nav__logo {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: #111111;
    }

    .nav__logo:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .nav__menu {
      display: flex;
      align-items: center;
      gap: 24px;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav__item {
      position: relative;
    }

    .nav__link {
      display: flex;
      align-items: center;
      height: 60px;
      padding: 0 4px;
      font-size: 16px;
      font-weight: 500;
      color: #111111;
      text-decoration: none;
      border-bottom: 2px solid transparent;
      transition: border-color 0.2s ease;
    }

    .nav__link:hover {
      border-bottom-color: #111111;
    }

    .nav__link:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .nav__item--active .nav__link {
      border-bottom-color: #111111;
    }

    .nav__dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      min-width: 200px;
      background-color: #ffffff;
      border: 1px solid #e5e5e5;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      z-index: 100;
    }

    .nav__dropdown-item {
      display: block;
      padding: 12px 16px;
      font-size: 14px;
      color: #111111;
      text-decoration: none;
      transition: background-color 0.15s ease;
    }

    .nav__dropdown-item:hover {
      background-color: #f5f5f5;
    }

    .nav__dropdown-item:focus {
      outline: 2px solid #111111;
      outline-offset: -2px;
    }

    .nav__actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .nav__mobile-toggle {
      display: none;
      width: 40px;
      height: 40px;
      border: none;
      background: none;
      cursor: pointer;
      color: #111111;
    }

    .nav__mobile-toggle:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .nav__mobile-menu {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background-color: #ffffff;
      border-bottom: 1px solid #e5e5e5;
      z-index: 100;
    }

    .nav__mobile-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      font-size: 16px;
      color: #111111;
      text-decoration: none;
      border-bottom: 1px solid #e5e5e5;
    }

    .nav__mobile-item:hover {
      background-color: #f5f5f5;
    }

    .nav__mobile-item:focus {
      outline: 2px solid #111111;
      outline-offset: -2px;
    }

    @media (max-width: 768px) {
      .nav__container {
        padding: 0 16px;
      }

      .nav__menu,
      .nav__actions {
        display: none;
      }

      .nav__mobile-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .nav__mobile-menu {
        display: block;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .nav__link,
      .nav__dropdown-item {
        transition: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationBar {
  @Input() items: NavItem[] = [];
  @Input() logoHref = '/';
  @Input() activeItemId = '';
  @Input() ariaLabel = 'Main navigation';

  @Output() itemClick = new EventEmitter<NavItem>();
  @Output() logoClick = new EventEmitter<void>();

  hoveredItemId = signal<string | null>(null);
  mobileMenuOpen = signal(false);

  onLogoClick(event: Event): void {
    event.preventDefault();
    this.logoClick.emit();
  }

  onItemClick(event: Event, item: NavItem): void {
    event.preventDefault();
    this.itemClick.emit(item);
  }

  onItemHover(item: NavItem): void {
    if (item.children) {
      this.hoveredItemId.set(item.id);
    }
  }

  onItemLeave(): void {
    this.hoveredItemId.set(null);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  onMobileItemClick(event: Event, item: NavItem): void {
    if (item.children) {
      event.preventDefault();
    } else {
      this.mobileMenuOpen.set(false);
      this.itemClick.emit(item);
    }
  }
}
