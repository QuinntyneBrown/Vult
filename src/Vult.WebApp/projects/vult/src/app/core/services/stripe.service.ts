// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable, inject, signal } from '@angular/core';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { STRIPE_PUBLISHABLE_KEY } from '../config/stripe.config';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private publishableKey = inject(STRIPE_PUBLISHABLE_KEY);
  private stripePromise: Promise<Stripe | null>;
  private stripeInstance: Stripe | null = null;

  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly readySignal = signal<boolean>(false);

  public readonly loading = this.loadingSignal.asReadonly();
  public readonly error = this.errorSignal.asReadonly();
  public readonly ready = this.readySignal.asReadonly();

  constructor() {
    this.stripePromise = this.initializeStripe();
  }

  private async initializeStripe(): Promise<Stripe | null> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const stripe = await loadStripe(this.publishableKey);
      if (!stripe) {
        throw new Error('Failed to initialize Stripe');
      }
      this.stripeInstance = stripe;
      this.readySignal.set(true);
      return stripe;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load Stripe';
      this.errorSignal.set(message);
      return null;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async getStripe(): Promise<Stripe | null> {
    return this.stripePromise;
  }

  async createElements(options?: { clientSecret?: string }): Promise<StripeElements | null> {
    const stripe = await this.getStripe();
    if (!stripe) return null;

    return stripe.elements(options);
  }

  async createCardElement(elements: StripeElements): Promise<StripeCardElement> {
    return elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          '::placeholder': {
            color: '#aab7c4'
          }
        },
        invalid: {
          color: '#9e2146'
        }
      }
    });
  }

  async confirmCardPayment(
    clientSecret: string,
    cardElement: StripeCardElement,
    billingDetails?: {
      name?: string;
      email?: string;
      address?: {
        line1?: string;
        line2?: string;
        city?: string;
        state?: string;
        postal_code?: string;
        country?: string;
      };
    }
  ): Promise<{ success: boolean; error?: string; paymentIntentId?: string }> {
    const stripe = await this.getStripe();
    if (!stripe) {
      return { success: false, error: 'Stripe not initialized' };
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: billingDetails
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (paymentIntent?.status === 'succeeded') {
      return { success: true, paymentIntentId: paymentIntent.id };
    }

    return { success: false, error: 'Payment was not successful' };
  }

  async confirmPayment(
    clientSecret: string,
    elements: StripeElements,
    returnUrl: string
  ): Promise<{ success: boolean; error?: string }> {
    const stripe = await this.getStripe();
    if (!stripe) {
      return { success: false, error: 'Stripe not initialized' };
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }
}
