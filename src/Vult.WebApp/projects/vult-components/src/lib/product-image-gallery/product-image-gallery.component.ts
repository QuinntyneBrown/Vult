import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ProductImage {
  id: string;
  url: string;
  altText: string;
  thumbnailUrl?: string;
}

@Component({
  selector: 'lib-product-image-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-gallery" [class.product-gallery--loading]="loading">
      <!-- Thumbnails (Desktop: left side, Mobile: bottom) -->
      <div class="gallery-thumbnails" role="group" [attr.aria-label]="ariaLabel + ' thumbnails'">
        @for (image of images; track image.id; let i = $index) {
          <button
            class="gallery-thumbnail"
            [class.gallery-thumbnail--selected]="selectedIndex() === i"
            [attr.aria-pressed]="selectedIndex() === i"
            [attr.aria-label]="'View ' + image.altText"
            (click)="selectImage(i)"
          >
            @if (!loading) {
              <img
                [src]="image.thumbnailUrl || image.url"
                [alt]="image.altText"
                class="gallery-thumbnail__image"
                loading="lazy"
              />
            } @else {
              <div class="gallery-thumbnail__skeleton"></div>
            }
          </button>
        }
      </div>

      <!-- Main Image -->
      <div class="gallery-main">
        <div
          class="gallery-main-image"
          [class.gallery-main-image--zoomable]="enableZoom"
          (click)="onMainImageClick()"
        >
          @if (!loading && images.length > 0) {
            <img
              [src]="currentImage()?.url"
              [alt]="currentImage()?.altText"
              class="gallery-main-image__img"
            />
          } @else {
            <div class="gallery-main-image__skeleton"></div>
          }
        </div>

        <!-- Dot Indicators (Mobile) -->
        @if (images.length > 1) {
          <div class="gallery-dots" role="tablist" [attr.aria-label]="ariaLabel + ' navigation'">
            @for (image of images; track image.id; let i = $index) {
              <button
                class="gallery-dot"
                [class.gallery-dot--active]="selectedIndex() === i"
                (click)="selectImage(i)"
                role="tab"
                [attr.aria-selected]="selectedIndex() === i"
                [attr.aria-label]="'Image ' + (i + 1) + ' of ' + images.length"
              ></button>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .product-gallery {
      display: flex;
      gap: 16px;
      max-width: 640px;
    }

    .gallery-thumbnails {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex-shrink: 0;
    }

    .gallery-thumbnail {
      width: 70px;
      height: 70px;
      border: 1px solid #e5e5e5;
      background-color: transparent;
      padding: 0;
      cursor: pointer;
      overflow: hidden;
      transition: transform 0.15s ease, border-color 0.15s ease;
    }

    .gallery-thumbnail:hover {
      transform: scale(1.05);
    }

    .gallery-thumbnail:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .gallery-thumbnail:focus:not(:focus-visible) {
      outline: none;
    }

    .gallery-thumbnail:focus-visible {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .gallery-thumbnail--selected {
      border: 2px solid #111111;
    }

    .gallery-thumbnail__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .gallery-thumbnail__skeleton {
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s ease-in-out infinite;
    }

    .gallery-main {
      flex: 1;
      position: relative;
    }

    .gallery-main-image {
      width: 535px;
      height: 669px;
      background-color: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .gallery-main-image--zoomable {
      cursor: zoom-in;
    }

    .gallery-main-image__img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .gallery-main-image__skeleton {
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s ease-in-out infinite;
    }

    .gallery-dots {
      display: none;
      justify-content: center;
      gap: 8px;
      margin-top: 16px;
    }

    .gallery-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #cccccc;
      border: none;
      cursor: pointer;
      padding: 0;
      transition: background-color 0.15s ease;
    }

    .gallery-dot:hover {
      background-color: #999999;
    }

    .gallery-dot--active {
      background-color: #111111;
    }

    .gallery-dot:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    @keyframes skeleton-loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    @media (max-width: 768px) {
      .product-gallery {
        flex-direction: column;
        max-width: 100%;
      }

      .gallery-thumbnails {
        flex-direction: row;
        overflow-x: auto;
        padding: 0 16px 8px;
        order: 2;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
      }

      .gallery-thumbnails::-webkit-scrollbar {
        display: none;
      }

      .gallery-thumbnail {
        width: 125px;
        height: 125px;
        flex-shrink: 0;
      }

      .gallery-main {
        order: 1;
      }

      .gallery-main-image {
        width: 100%;
        height: auto;
        aspect-ratio: 1 / 1.25;
      }

      .gallery-dots {
        display: flex;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .gallery-thumbnail,
      .gallery-dot {
        transition: none;
      }

      .gallery-thumbnail__skeleton,
      .gallery-main-image__skeleton {
        animation: none;
        background: #f0f0f0;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductImageGalleryComponent {
  @Input() images: ProductImage[] = [];
  @Input() enableZoom = false;
  @Input() stickyOnDesktop = false;
  @Input() ariaLabel = 'Product images';
  @Input() loading = false;
  @Input() set selectedImageIndex(value: number) {
    if (value >= 0 && value < this.images.length) {
      this.selectedIndex.set(value);
    }
  }

  @Output() imageChange = new EventEmitter<number>();
  @Output() imageClick = new EventEmitter<ProductImage>();

  selectedIndex = signal(0);

  currentImage = computed(() => {
    const index = this.selectedIndex();
    return this.images.length > 0 ? this.images[index] : null;
  });

  selectImage(index: number): void {
    if (index >= 0 && index < this.images.length) {
      this.selectedIndex.set(index);
      this.imageChange.emit(index);
    }
  }

  onMainImageClick(): void {
    const current = this.currentImage();
    if (current) {
      this.imageClick.emit(current);
    }
  }
}
