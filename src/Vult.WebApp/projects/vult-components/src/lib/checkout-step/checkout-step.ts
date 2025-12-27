import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CheckoutStepStatus = 'pending' | 'active' | 'completed';

@Component({
  selector: 'v-checkout-step',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout-step.html',
  styleUrl: './checkout-step.scss',
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
