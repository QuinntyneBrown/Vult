import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CarouselSlide {
  id: string | number;
  imageUrl: string;
  altText: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
}

@Component({
  selector: 'lib-carousel-slider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="carousel"
      [class.carousel--auto-play]="autoPlay"
      role="region"
      aria-label="Image carousel"
    >
      <div class="carousel__track" [style.transform]="trackTransform()">
        @for (slide of slides; track slide.id; let i = $index) {
          <div
            class="carousel__slide"
            [class.carousel__slide--active]="i === currentIndex()"
            [attr.aria-hidden]="i !== currentIndex()"
          >
            <img
              [src]="slide.imageUrl"
              [alt]="slide.altText"
              class="carousel__image"
              loading="lazy"
            />
            @if (slide.title || slide.subtitle) {
              <div class="carousel__content">
                @if (slide.title) {
                  <h2 class="carousel__title">{{ slide.title }}</h2>
                }
                @if (slide.subtitle) {
                  <p class="carousel__subtitle">{{ slide.subtitle }}</p>
                }
                @if (slide.ctaText) {
                  <a [href]="slide.ctaUrl || '#'" class="carousel__cta">
                    {{ slide.ctaText }}
                  </a>
                }
              </div>
            }
          </div>
        }
      </div>

      @if (showArrows && slides.length > 1) {
        <button
          class="carousel__arrow carousel__arrow--prev"
          (click)="prev()"
          [disabled]="!loop && currentIndex() === 0"
          aria-label="Previous slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button
          class="carousel__arrow carousel__arrow--next"
          (click)="next()"
          [disabled]="!loop && currentIndex() === slides.length - 1"
          aria-label="Next slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      }

      @if (showDots && slides.length > 1) {
        <div class="carousel__dots" role="tablist" aria-label="Carousel navigation">
          @for (slide of slides; track slide.id; let i = $index) {
            <button
              class="carousel__dot"
              [class.carousel__dot--active]="i === currentIndex()"
              (click)="goTo(i)"
              role="tab"
              [attr.aria-selected]="i === currentIndex()"
              [attr.aria-label]="'Slide ' + (i + 1) + ' of ' + slides.length"
            ></button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .carousel {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .carousel__track {
      display: flex;
      transition: transform 0.5s ease;
    }

    .carousel__slide {
      flex: 0 0 100%;
      position: relative;
    }

    .carousel__image {
      width: 100%;
      height: auto;
      display: block;
      aspect-ratio: 16 / 9;
      object-fit: cover;
    }

    .carousel__content {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 48px;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
      color: #ffffff;
    }

    .carousel__title {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 48px;
      font-weight: 700;
      margin: 0 0 16px;
      line-height: 1.2;
    }

    .carousel__subtitle {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 18px;
      margin: 0 0 24px;
    }

    .carousel__cta {
      display: inline-block;
      padding: 12px 24px;
      background-color: #ffffff;
      color: #111111;
      text-decoration: none;
      font-weight: 500;
      border-radius: 30px;
      transition: background-color 0.2s ease;
    }

    .carousel__cta:hover {
      background-color: #e5e5e5;
    }

    .carousel__arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 48px;
      height: 48px;
      border: none;
      background-color: rgba(255, 255, 255, 0.9);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s ease, transform 0.2s ease;
      z-index: 10;
    }

    .carousel__arrow:hover {
      background-color: #ffffff;
      transform: translateY(-50%) scale(1.1);
    }

    .carousel__arrow:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .carousel__arrow:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .carousel__arrow--prev {
      left: 24px;
    }

    .carousel__arrow--next {
      right: 24px;
    }

    .carousel__dots {
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 8px;
      z-index: 10;
    }

    .carousel__dot {
      width: 8px;
      height: 8px;
      border: none;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      padding: 0;
      transition: background-color 0.2s ease, transform 0.2s ease;
    }

    .carousel__dot:hover {
      background-color: rgba(255, 255, 255, 0.8);
    }

    .carousel__dot--active {
      background-color: #ffffff;
      transform: scale(1.25);
    }

    .carousel__dot:focus {
      outline: 2px solid #ffffff;
      outline-offset: 2px;
    }

    @media (max-width: 768px) {
      .carousel__content {
        padding: 24px;
      }

      .carousel__title {
        font-size: 28px;
      }

      .carousel__subtitle {
        font-size: 14px;
      }

      .carousel__arrow {
        width: 40px;
        height: 40px;
      }

      .carousel__arrow--prev {
        left: 12px;
      }

      .carousel__arrow--next {
        right: 12px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .carousel__track,
      .carousel__arrow,
      .carousel__dot,
      .carousel__cta {
        transition: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselSliderComponent {
  @Input() slides: CarouselSlide[] = [];
  @Input() autoPlay = false;
  @Input() autoPlayInterval = 5000;
  @Input() loop = true;
  @Input() showArrows = true;
  @Input() showDots = true;

  @Output() slideChange = new EventEmitter<number>();

  currentIndex = signal(0);

  trackTransform = computed(() => `translateX(-${this.currentIndex() * 100}%)`);

  next(): void {
    const nextIndex = this.currentIndex() + 1;
    if (nextIndex < this.slides.length) {
      this.currentIndex.set(nextIndex);
    } else if (this.loop) {
      this.currentIndex.set(0);
    }
    this.slideChange.emit(this.currentIndex());
  }

  prev(): void {
    const prevIndex = this.currentIndex() - 1;
    if (prevIndex >= 0) {
      this.currentIndex.set(prevIndex);
    } else if (this.loop) {
      this.currentIndex.set(this.slides.length - 1);
    }
    this.slideChange.emit(this.currentIndex());
  }

  goTo(index: number): void {
    if (index >= 0 && index < this.slides.length) {
      this.currentIndex.set(index);
      this.slideChange.emit(index);
    }
  }
}
