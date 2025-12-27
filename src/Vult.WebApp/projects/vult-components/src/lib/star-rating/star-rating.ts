// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type StarRatingSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'v-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="star-rating"
      [class.star-rating--small]="size === 'small'"
      [class.star-rating--medium]="size === 'medium'"
      [class.star-rating--large]="size === 'large'"
      role="img"
      [attr.aria-label]="rating + ' out of ' + maxRating + ' stars'"
    >
      @for (filled of getStarArray(); track $index) {
        <svg
          class="star-rating__star"
          [class.star-rating__star--filled]="filled"
          [class.star-rating__star--empty]="!filled"
          [attr.width]="getStarSize()"
          [attr.height]="getStarSize()"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path d="M8 0L9.79611 5.52786H15.6085L10.9062 8.94427L12.7023 14.4721L8 11.0557L3.29772 14.4721L5.09383 8.94427L0.391548 5.52786H6.20389L8 0Z" fill="currentColor"/>
        </svg>
      }
    </div>
  `,
  styles: [`
    .star-rating {
      display: flex;
      gap: 4px;
    }

    .star-rating__star {
      flex-shrink: 0;
    }

    .star-rating__star--filled {
      color: #000000;
    }

    .star-rating__star--empty {
      color: #e5e5e5;
    }

    .star-rating--small {
      gap: 2px;
    }

    .star-rating--large {
      gap: 6px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarRating {
  @Input() rating: number = 0;
  @Input() maxRating: number = 5;
  @Input() size: StarRatingSize = 'medium';

  getStarArray(): boolean[] {
    return Array.from({ length: this.maxRating }, (_, i) => i < this.rating);
  }

  getStarSize(): number {
    switch (this.size) {
      case 'small':
        return 12;
      case 'large':
        return 20;
      case 'medium':
      default:
        return 16;
    }
  }
}
