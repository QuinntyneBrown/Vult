// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  subtitle: string;
  imageUrl: string;
  color: string;
  colorId: string;
  size: string;
  sizeId: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  maxQuantity: number;
  isLowStock: boolean;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  promoCode?: string;
  promoDiscount?: number;
  lastUpdated: string;
}

export interface PromoCodeResult {
  isValid: boolean;
  discountAmount: number;
  discountPercent?: number;
  message: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

export interface DeliveryInfo {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  useSameForBilling: boolean;
}

export interface PaymentInfo {
  method: 'card' | 'paypal' | 'klarna';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
}

export interface CheckoutState {
  currentStep: 'delivery' | 'payment' | 'review';
  deliveryInfo: DeliveryInfo | null;
  paymentInfo: PaymentInfo | null;
  shippingOption: ShippingOption | null;
  isProcessing: boolean;
}

export interface OrderResult {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  message: string;
  estimatedDelivery?: string;
}
