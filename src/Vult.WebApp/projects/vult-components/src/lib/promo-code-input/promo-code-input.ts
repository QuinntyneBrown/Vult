import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'v-promo-code-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './promo-code-input.html',
  styleUrl: './promo-code-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromoCodeInput {
  @Input() appliedCode = '';
  @Input() isLoading = false;
  @Input() error = '';
  @Input() toggleLabel = 'Do you have a Promo Code?';
  @Input() placeholder = 'Enter promo code';
  @Input() testId = 'promo-code-input';

  @Output() apply = new EventEmitter<string>();
  @Output() remove = new EventEmitter<void>();

  isExpanded = false;
  promoCode = '';

  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }

  onApply(): void {
    if (this.promoCode.trim()) {
      this.apply.emit(this.promoCode.trim());
    }
  }

  onRemove(): void {
    this.promoCode = '';
    this.remove.emit();
  }
}
