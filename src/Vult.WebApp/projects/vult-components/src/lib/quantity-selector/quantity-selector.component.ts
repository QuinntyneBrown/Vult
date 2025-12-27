import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'v-quantity-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quantity-selector.component.html',
  styleUrl: './quantity-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuantitySelector {
  @Input() quantity = 1;
  @Input() maxQuantity = 10;
  @Input() minQuantity = 1;
  @Input() disabled = false;
  @Input() showLabel = true;
  @Input() label = 'Quantity';
  @Input() ariaLabel = '';
  @Input() testId = 'quantity-selector';

  @Output() quantityChange = new EventEmitter<number>();

  selectorId = `quantity-${Math.random().toString(36).substr(2, 9)}`;

  get quantityOptions(): number[] {
    return Array.from(
      { length: this.maxQuantity - this.minQuantity + 1 },
      (_, i) => this.minQuantity + i
    );
  }

  onQuantityChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newQuantity = parseInt(target.value, 10);
    this.quantityChange.emit(newQuantity);
  }
}
