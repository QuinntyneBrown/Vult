import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  platform: string;
  href: string;
  icon: string;
}

@Component({
  selector: 'lib-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="footer__container">
        <div class="footer__main">
          <div class="footer__columns">
            @for (column of columns; track column.title) {
              <div class="footer__column">
                <h3 class="footer__column-title">{{ column.title }}</h3>
                <ul class="footer__links">
                  @for (link of column.links; track link.href) {
                    <li>
                      <a
                        [href]="link.href"
                        class="footer__link"
                        (click)="onLinkClick($event, link)"
                      >
                        {{ link.label }}
                      </a>
                    </li>
                  }
                </ul>
              </div>
            }
          </div>

          @if (socialLinks.length > 0) {
            <div class="footer__social">
              @for (social of socialLinks; track social.platform) {
                <a
                  [href]="social.href"
                  class="footer__social-link"
                  [attr.aria-label]="social.platform"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span [innerHTML]="social.icon"></span>
                </a>
              }
            </div>
          }
        </div>

        <div class="footer__bottom">
          <div class="footer__legal">
            @for (link of legalLinks; track link.href) {
              <a
                [href]="link.href"
                class="footer__legal-link"
                (click)="onLinkClick($event, link)"
              >
                {{ link.label }}
              </a>
            }
          </div>
          <p class="footer__copyright">{{ copyright }}</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #111111;
      color: #ffffff;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      padding: 48px 0 24px;
    }

    .footer__container {
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 48px;
    }

    .footer__main {
      display: flex;
      justify-content: space-between;
      gap: 48px;
      padding-bottom: 48px;
      border-bottom: 1px solid #757575;
    }

    .footer__columns {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 32px;
      flex: 1;
    }

    .footer__column-title {
      font-size: 10px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #ffffff;
      margin: 0 0 16px;
    }

    .footer__links {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .footer__links li {
      margin-bottom: 12px;
    }

    .footer__link {
      color: #757575;
      text-decoration: none;
      font-size: 12px;
      transition: color 0.2s ease;
    }

    .footer__link:hover {
      color: #ffffff;
    }

    .footer__link:focus {
      outline: 2px solid #ffffff;
      outline-offset: 2px;
    }

    .footer__social {
      display: flex;
      gap: 16px;
      flex-shrink: 0;
    }

    .footer__social-link {
      width: 32px;
      height: 32px;
      background-color: #757575;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #111111;
      transition: background-color 0.2s ease;
    }

    .footer__social-link:hover {
      background-color: #ffffff;
    }

    .footer__social-link:focus {
      outline: 2px solid #ffffff;
      outline-offset: 2px;
    }

    .footer__bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .footer__legal {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }

    .footer__legal-link {
      color: #757575;
      text-decoration: none;
      font-size: 11px;
      transition: color 0.2s ease;
    }

    .footer__legal-link:hover {
      color: #ffffff;
    }

    .footer__legal-link:focus {
      outline: 2px solid #ffffff;
      outline-offset: 2px;
    }

    .footer__copyright {
      color: #757575;
      font-size: 11px;
      margin: 0;
    }

    @media (max-width: 1024px) {
      .footer__columns {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .footer__container {
        padding: 0 24px;
      }

      .footer__main {
        flex-direction: column;
      }

      .footer__columns {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .footer__bottom {
        flex-direction: column;
        align-items: flex-start;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .footer__link,
      .footer__social-link,
      .footer__legal-link {
        transition: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  @Input() columns: FooterColumn[] = [];
  @Input() socialLinks: SocialLink[] = [];
  @Input() legalLinks: FooterLink[] = [];
  @Input() copyright = '';

  @Output() linkClick = new EventEmitter<FooterLink>();

  onLinkClick(event: Event, link: FooterLink): void {
    event.preventDefault();
    this.linkClick.emit(link);
  }
}
