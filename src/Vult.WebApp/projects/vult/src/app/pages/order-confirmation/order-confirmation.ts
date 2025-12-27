// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-confirmation.html',
  styleUrl: './order-confirmation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderConfirmation implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  orderId = '';
  orderNumber = '';
  email = '';
  estimatedDelivery = '';

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('orderId') || '';

    const state = history.state;
    if (state) {
      this.orderNumber = state.orderNumber || this.generateOrderNumber();
      this.email = state.email || '';
      this.estimatedDelivery = state.estimatedDelivery || this.getDefaultDeliveryDate();
    } else {
      this.orderNumber = this.generateOrderNumber();
      this.estimatedDelivery = this.getDefaultDeliveryDate();
    }
  }

  private generateOrderNumber(): string {
    return `#VLT-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  }

  private getDefaultDeliveryDate(): string {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 5);
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 7);

    const formatDate = (date: Date) =>
      date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return `${formatDate(minDate)} - ${formatDate(maxDate)}`;
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  trackOrder(): void {
    console.log('Track order:', this.orderId);
  }

  createAccount(): void {
    this.router.navigate(['/register']);
  }

  onLogoClick(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/home']);
  }
}
