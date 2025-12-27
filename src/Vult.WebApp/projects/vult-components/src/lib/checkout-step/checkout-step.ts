import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CheckoutStepStatus = 'pending' | 'active' | 'completed';

@Component({
  selector: 'v-checkout-step',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="checkout-step"
      [class.checkout-step--active]="status === 'active'"
      [class.checkout-step--completed]="status === 'completed'"
      [attr.data-testid]="testId"
    >
      <button
        class="step-header"
        [class.step-header--active]="status === 'active'"
        [class.step-header--clickable]="status === 'completed'"
        [disabled]="status === 'pending'"
        [attr.aria-expanded]="status === 'active'"
        [attr.aria-controls]="testId + '-content'"
        (click)="onHeaderClick()"
      >
        <div class="step-title">
          <span
            class="step-number"
            [class.step-number--completed]="status === 'completed'"
          >
            @if (status === 'completed') {
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            } @else {
              {{ stepNumber }}
            }
          </span>
          <span class="step-name">{{ title }}</span>
        </div>

        @if (status === 'completed' && summary) {
          <div class="step-summary">{{ summary }}</div>
        }

        @if (status === 'completed') {
          <span class="edit-link">Edit</span>
        }
      </button>

      <div
        class="step-content"
        [class.step-content--active]="status === 'active'"
        [id]="testId + '-content'"
        [attr.aria-hidden]="status !== 'active'"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .checkout-step {
      border: 1px solid #e5e5e5;
      margin-bottom: 16px;
    }

    .step-header {
      width: 100%;
      padding: 20px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f5f5f5;
      border: none;
      cursor: default;
      text-align: left;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }

    .step-header--active {
      background: #ffffff;
    }

    .step-header--clickable {
      cursor: pointer;
    }

    .step-header--clickable:hover {
      background: #fafafa;
    }

    .step-header:focus {
      outline: 2px solid #111111;
      outline-offset: -2px;
    }

    .step-header:disabled {
      cursor: not-allowed;
    }

    .step-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .step-number {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #111111;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 500;
      flex-shrink: 0;
    }

    .step-number--completed {
      background: #128a09;
    }

    .step-number svg {
      width: 14px;
      height: 14px;
    }

    .step-name {
      font-size: 16px;
      font-weight: 500;
      color: #111111;
    }

    .step-summary {
      font-size: 14px;
      color: #707070;
      flex: 1;
      margin-left: 40px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .edit-link {
      font-size: 14px;
      color: #111111;
      text-decoration: underline;
      margin-left: 16px;
      flex-shrink: 0;
    }

    .step-content {
      display: none;
      padding: 24px;
    }

    .step-content--active {
      display: block;
    }

    @media (max-width: 600px) {
      .step-header {
        flex-wrap: wrap;
        gap: 8px;
      }

      .step-summary {
        flex-basis: 100%;
        margin-left: 40px;
        order: 3;
      }

      .edit-link {
        margin-left: auto;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutStep {
  @Input({ required: true }) stepNumber!: number;
  @Input({ required: true }) title!: string;
  @Input() status: CheckoutStepStatus = 'pending';
  @Input() summary = '';
  @Input() testId = 'checkout-step';

  @Output() edit = new EventEmitter<void>();

  onHeaderClick(): void {
    if (this.status === 'completed') {
      this.edit.emit();
    }
  }
}
