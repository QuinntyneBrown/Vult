import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type HeroSize = 'small' | 'medium' | 'large' | 'full';
export type HeroTextPosition = 'left' | 'center' | 'right';
export type HeroTheme = 'light' | 'dark';

@Component({
  selector: 'v-hero-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section
      class="hero"
      [class.hero--small]="size === 'small'"
      [class.hero--medium]="size === 'medium'"
      [class.hero--large]="size === 'large'"
      [class.hero--full]="size === 'full'"
      [class.hero--light]="theme === 'light'"
      [class.hero--dark]="theme === 'dark'"
    >
      @if (backgroundImage) {
        <img
          [src]="backgroundImage"
          [alt]="imageAlt"
          class="hero__image"
          loading="eager"
        />
      }
      @if (videoUrl) {
        <video
          class="hero__video"
          [src]="videoUrl"
          autoplay
          muted
          loop
          playsinline
        ></video>
      }

      <div class="hero__overlay" [style.background]="overlayGradient"></div>

      <div
        class="hero__content"
        [class.hero__content--left]="textPosition === 'left'"
        [class.hero__content--center]="textPosition === 'center'"
        [class.hero__content--right]="textPosition === 'right'"
      >
        @if (overline) {
          <p class="hero__overline">{{ overline }}</p>
        }
        @if (title) {
          <h1 class="hero__title">{{ title }}</h1>
        }
        @if (subtitle) {
          <p class="hero__subtitle">{{ subtitle }}</p>
        }
        @if (primaryCtaText || secondaryCtaText) {
          <div class="hero__ctas">
            @if (primaryCtaText) {
              <button
                class="hero__cta hero__cta--primary"
                (click)="primaryCtaClick.emit()"
              >
                {{ primaryCtaText }}
              </button>
            }
            @if (secondaryCtaText) {
              <button
                class="hero__cta hero__cta--secondary"
                (click)="secondaryCtaClick.emit()"
              >
                {{ secondaryCtaText }}
              </button>
            }
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .hero {
      position: relative;
      width: 100%;
      overflow: hidden;
      display: flex;
      align-items: center;
    }

    .hero--small {
      min-height: 400px;
    }

    .hero--medium {
      min-height: 560px;
    }

    .hero--large {
      min-height: 700px;
    }

    .hero--full {
      min-height: 100vh;
    }

    .hero__image,
    .hero__video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero__overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(transparent 50%, rgba(0, 0, 0, 0.4));
    }

    .hero__content {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 1440px;
      margin: 0 auto;
      padding: 48px;
    }

    .hero__content--left {
      text-align: left;
    }

    .hero__content--center {
      text-align: center;
    }

    .hero__content--right {
      text-align: right;
    }

    .hero--light .hero__overline,
    .hero--light .hero__title,
    .hero--light .hero__subtitle {
      color: #111111;
    }

    .hero--dark .hero__overline,
    .hero--dark .hero__title,
    .hero--dark .hero__subtitle {
      color: #ffffff;
    }

    .hero__overline {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 16px;
      font-weight: 500;
      margin: 0 0 8px;
    }

    .hero__title {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 84px;
      font-weight: 800;
      line-height: 1.0;
      letter-spacing: -2px;
      margin: 0 0 16px;
    }

    .hero__subtitle {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 18px;
      font-weight: 400;
      line-height: 1.5;
      margin: 0 0 24px;
      max-width: 600px;
    }

    .hero__content--center .hero__subtitle {
      margin-left: auto;
      margin-right: auto;
    }

    .hero__ctas {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .hero__content--center .hero__ctas {
      justify-content: center;
    }

    .hero__content--right .hero__ctas {
      justify-content: flex-end;
    }

    .hero__cta {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 44px;
      padding: 0 24px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 16px;
      font-weight: 500;
      border-radius: 30px;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s ease, transform 0.1s ease;
    }

    .hero__cta:focus {
      outline: 2px solid currentColor;
      outline-offset: 2px;
    }

    .hero__cta:active {
      transform: scale(0.95);
    }

    .hero__cta--primary {
      background-color: #111111;
      color: #ffffff;
    }

    .hero__cta--primary:hover {
      background-color: #333333;
    }

    .hero--dark .hero__cta--primary {
      background-color: #ffffff;
      color: #111111;
    }

    .hero--dark .hero__cta--primary:hover {
      background-color: #e5e5e5;
    }

    .hero__cta--secondary {
      background-color: transparent;
      border: 1.5px solid #111111;
      color: #111111;
    }

    .hero__cta--secondary:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .hero--dark .hero__cta--secondary {
      border-color: #ffffff;
      color: #ffffff;
    }

    .hero--dark .hero__cta--secondary:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 1024px) {
      .hero__title {
        font-size: 64px;
      }
    }

    @media (max-width: 768px) {
      .hero__content {
        padding: 24px;
      }

      .hero__title {
        font-size: 44px;
        letter-spacing: -1px;
      }

      .hero__subtitle {
        font-size: 16px;
      }

      .hero--small {
        min-height: 300px;
      }

      .hero--medium {
        min-height: 400px;
      }

      .hero--large {
        min-height: 500px;
      }
    }

    @media (max-width: 400px) {
      .hero__content {
        padding: 16px;
      }

      .hero__title {
        font-size: 32px;
        letter-spacing: -0.5px;
      }

      .hero__overline {
        font-size: 14px;
      }

      .hero__subtitle {
        font-size: 14px;
      }

      .hero--small {
        min-height: 250px;
      }

      .hero--medium {
        min-height: 320px;
      }

      .hero--large {
        min-height: 400px;
      }

      .hero__cta {
        height: 40px;
        padding: 0 20px;
        font-size: 14px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .hero__cta {
        transition: none;
      }

      .hero__video {
        display: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSection {
  @Input() backgroundImage = '';
  @Input() videoUrl = '';
  @Input() imageAlt = '';
  @Input() overline = '';
  @Input() title = '';
  @Input() subtitle = '';
  @Input() primaryCtaText = '';
  @Input() secondaryCtaText = '';
  @Input() size: HeroSize = 'large';
  @Input() textPosition: HeroTextPosition = 'left';
  @Input() theme: HeroTheme = 'dark';
  @Input() overlayGradient = 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.4))';

  @Output() primaryCtaClick = new EventEmitter<void>();
  @Output() secondaryCtaClick = new EventEmitter<void>();
}
