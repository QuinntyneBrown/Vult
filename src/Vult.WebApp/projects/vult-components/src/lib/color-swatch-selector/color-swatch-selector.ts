import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ColorOption {
  id: string;
  name: string;
  color: string;
  imageUrl?: string;
  available?: boolean;
}

@Component({
  selector: 'v-color-swatch-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="color-swatches" role="radiogroup" [attr.aria-label]="ariaLabel">
      @for (color of colors; track color.id) {
        <button
          class="color-swatch"
          [class.color-swatch--selected]="selectedId() === color.id"
          [class.color-swatch--unavailable]="color.available === false"
          [style.background-color]="color.color"
          [attr.aria-label]="color.name"
          [attr.aria-pressed]="selectedId() === color.id"
          [attr.aria-disabled]="color.available === false"
          (click)="selectColor(color)"
        >
          @if (color.imageUrl) {
            <img [src]="color.imageUrl" [alt]="color.name" class="color-swatch__image" />
          }
          @if (color.available === false) {
            <span class="color-swatch__unavailable-line" aria-hidden="true"></span>
          }
        </button>
      }
      @if (moreCount > 0) {
        <span class="color-swatches__more">+{{ moreCount }}</span>
      }
    </div>
  `,
  styles: [`
    .color-swatches {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;
    }

    .color-swatch {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 1px solid #e5e5e5;
      padding: 0;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .color-swatch:hover {
      transform: scale(1.15);
    }

    .color-swatch:focus {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .color-swatch--selected {
      border: 2px solid #111111;
      box-shadow: 0 0 0 1px #ffffff inset;
    }

    .color-swatch--unavailable {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .color-swatch__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }

    .color-swatch__unavailable-line {
      position: absolute;
      top: 50%;
      left: -10%;
      width: 120%;
      height: 1px;
      background-color: #757575;
      transform: rotate(-45deg);
    }

    .color-swatches__more {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 12px;
      color: #757575;
      margin-left: 4px;
    }

    @media (prefers-reduced-motion: reduce) {
      .color-swatch {
        transition: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorSwatchSelector {
  @Input() colors: ColorOption[] = [];
  @Input() ariaLabel = 'Select color';
  @Input() moreCount = 0;
  @Input() set selectedColorId(value: string | undefined) {
    if (value) {
      this.selectedId.set(value);
    }
  }

  @Output() colorSelect = new EventEmitter<ColorOption>();

  selectedId = signal<string | undefined>(undefined);

  selectColor(color: ColorOption): void {
    if (color.available !== false) {
      this.selectedId.set(color.id);
      this.colorSelect.emit(color);
    }
  }
}
