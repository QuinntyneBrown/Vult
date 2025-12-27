# Shopping Cart and Checkout Specification

## Overview

This specification defines the client-side shopping cart and checkout experience for the Vult application, modeled after Nike.com's industry-leading e-commerce UX patterns.

## Research Sources

- [Baymard Institute Nike UX Case Study](https://baymard.com/ux-benchmark/case-studies/nike)
- [Nike vs Adidas UI/UX Audit](https://blog.snappymob.com/ui-ux-audit-nike-vs-adidas-website-comparison)
- [Nike Help - Payment Options](https://www.nike.com/help/a/payment-options)

---

## 1. Shopping Cart (Bag) Experience

### 1.1 Mini Cart / Cart Notification

When a user adds an item to their bag, a non-intrusive notification appears:

**Behavior:**
- Appears in the top-right corner of the page
- Auto-dismisses after 4 seconds
- Shows: product thumbnail, name, selected size/color, price
- Two CTA buttons: "View Bag" and "Checkout"
- Cart icon in navigation updates with item count badge

**Visual Design:**
- Clean, minimal popup
- Product image: 60x60px
- White background with subtle shadow
- Primary CTA (Checkout): Black button with white text
- Secondary CTA (View Bag): White button with black border

### 1.2 Cart Page (/cart)

**Header:**
- Title: "Bag" with item count
- Breadcrumb: Home > Bag

**Cart Items Section (Left - 60% width):**

Each cart item displays:
- Product image (120x120px)
- Product name (linked to PDP)
- Product subtitle/category
- Color and Size selected
- Unit price
- Quantity selector (dropdown: 1-10)
- "Remove" link (muted, small)
- "Move to Favorites" link (muted, small)
- Stock status message (e.g., "Just a Few Left - Order Now")

**Item Actions:**
- Quantity change: Updates price immediately
- Remove: Removes with confirmation animation
- Move to Favorites: Requires authentication

**Order Summary Section (Right - 40% width):**

- Subtotal (before discounts)
- Estimated Shipping (or "Free" if applicable)
- Estimated Tax (calculated at checkout)
- Promo Code input with "Apply" button
- **Total** (bold, larger font)
- Checkout button (full-width, primary black)
- "PayPal" button (secondary option)
- Estimated delivery date range
- Free shipping threshold message (e.g., "Spend $50 more for free shipping")

**Empty Cart State:**
- "Your Bag is Empty" message
- "Continue Shopping" CTA
- Product recommendations carousel

### 1.3 Cart Persistence

**Storage Strategy:**
- Guest users: localStorage with 30-day expiration
- Authenticated users: Server-side persistence + localStorage sync
- Cart merges on login (local items + server items)

**Cart Data Structure:**
```typescript
interface CartItem {
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

interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  promoCode?: string;
  promoDiscount?: number;
  lastUpdated: string;
}
```

---

## 2. Checkout Experience

### 2.1 Checkout Page Layout (/checkout)

**Design Philosophy:**
- Single-page accordion checkout (all steps visible, one expanded at a time)
- Minimal distractions (no main navigation, footer links only)
- Order summary always visible on right side
- Mobile: Summary collapses to expandable section at top

**Page Structure:**
```
+--------------------------------------------------+
| VULT Logo                    Need Help? | Secure |
+--------------------------------------------------+
|                                                   |
|  [Accordion Steps]            [Order Summary]     |
|  +----------------+           +----------------+  |
|  | 1. Delivery    |           | Your Order     |  |
|  |   [Expanded]   |           | +------------+ |  |
|  |   Form fields  |           | | Item 1     | |  |
|  |                |           | | Item 2     | |  |
|  +----------------+           | +------------+ |  |
|  +----------------+           |                |  |
|  | 2. Payment     |           | Subtotal: $X  |  |
|  |   [Collapsed]  |           | Shipping: $X  |  |
|  +----------------+           | Tax: $X       |  |
|  +----------------+           | -----------   |  |
|  | 3. Review      |           | Total: $X     |  |
|  |   [Collapsed]  |           +----------------+  |
|  +----------------+                               |
|                                                   |
+--------------------------------------------------+
```

### 2.2 Step 1: Delivery Information

**Guest vs Member:**
- Show email input first for guest checkout
- "Sign in for faster checkout" link
- Member benefits callout: "Members get free shipping"

**Contact Information:**
- Email address (required)
- Phone number (required for delivery updates)

**Shipping Address Form:**
- First Name (required)
- Last Name (required)
- Address Line 1 (required, with autocomplete)
- Address Line 2 (optional)
- City (required)
- State/Province (dropdown, required)
- ZIP/Postal Code (required)
- Country (dropdown, default based on geo-IP)

**Form UX:**
- Floating labels (label moves up when focused/filled)
- Inline validation with green checkmark on valid
- Error messages appear below fields in red
- Address autocomplete integration (Google Places API style)
- "Use this address for billing" checkbox (default checked)

**Shipping Options:**
- Standard Shipping (Free over $50, otherwise $8) - 5-7 business days
- Express Shipping ($15) - 2-3 business days
- Next Day ($25) - 1 business day

**Save & Continue Button:**
- Full-width primary button
- Validates all required fields
- Collapses section and opens Payment on success

### 2.3 Step 2: Payment Information

**Payment Methods (Tabs/Radio):**
1. Credit/Debit Card (default)
2. PayPal
3. Klarna (Buy Now, Pay Later)
4. Apple Pay / Google Pay (if available)

**Credit Card Form:**
- Card Number (with card type icon detection)
- Expiration Date (MM/YY)
- CVV (with tooltip explaining where to find)
- Cardholder Name

**Billing Address:**
- "Same as shipping address" (default checked)
- If unchecked, show full address form

**Security Indicators:**
- Lock icon next to card fields
- "Your payment info is secure" message
- Trust badges (Visa, Mastercard, Amex, etc.)

**Promo/Gift Cards:**
- "Have a promo code?" expandable section
- Gift card input with balance check

### 2.4 Step 3: Review & Place Order

**Order Review:**
- All items with thumbnails
- Edit links for Delivery and Payment sections
- Final total with tax calculated
- Shipping method selected
- Payment method selected (last 4 digits of card)

**Terms & Conditions:**
- "By placing this order, you agree to our Terms of Use and Privacy Policy"

**Place Order Button:**
- Full-width primary button: "Place Order"
- Loading state with spinner during processing
- Disable navigation away during processing

### 2.5 Order Confirmation

**Post-Purchase Page (/order-confirmation/:orderId):**
- Success checkmark animation
- "Thank you for your order!"
- Order number (prominent)
- Confirmation email message
- Order summary
- Estimated delivery date
- "Continue Shopping" CTA
- Account creation prompt for guests

---

## 3. MVP Scope

For the initial MVP implementation, we will focus on:

### In Scope (MVP):
1. **Cart Service** - Client-side cart state management
2. **Mini Cart Notification** - Add to bag feedback
3. **Cart Page** - Full cart view with quantity management
4. **Cart Icon with Badge** - Navigation cart indicator
5. **Checkout Page** - Multi-step accordion form
6. **Form Validation** - Client-side validation
7. **Local Storage Persistence** - Guest cart storage
8. **Order Summary Component** - Reusable summary display
9. **Mock Order Submission** - Simulated checkout completion

### Out of Scope (Future):
- Server-side cart persistence
- Actual payment processing
- Promo code validation
- Tax calculation API
- Address autocomplete
- PayPal/Klarna integration
- Email confirmation sending
- Favorites/Wishlist integration

---

## 4. Component Specifications

### 4.1 New vult-components

| Component | Description |
|-----------|-------------|
| `cart-notification` | Mini cart popup on add to bag |
| `cart-item` | Single cart item with actions |
| `cart-summary` | Order summary sidebar |
| `quantity-selector` | Dropdown for quantity selection |
| `promo-code-input` | Promo code entry with apply button |
| `checkout-accordion` | Accordion step container |
| `checkout-step` | Individual checkout step |
| `shipping-form` | Delivery address form |
| `payment-form` | Payment method selection/entry |
| `order-review` | Final order review display |
| `form-field` | Reusable form input with floating label |

### 4.2 Component Hierarchy

```
Cart Page:
├── PageHeader
├── CartItemsList
│   └── CartItem (×n)
│       ├── ProductImage
│       ├── ProductInfo
│       ├── QuantitySelector
│       └── ItemActions
└── CartSummary
    ├── PriceBreakdown
    ├── PromoCodeInput
    └── CheckoutButton

Checkout Page:
├── CheckoutHeader
├── CheckoutAccordion
│   ├── CheckoutStep (Delivery)
│   │   └── ShippingForm
│   ├── CheckoutStep (Payment)
│   │   └── PaymentForm
│   └── CheckoutStep (Review)
│       └── OrderReview
└── OrderSummary (sidebar)
```

---

## 5. State Management

### 5.1 Cart State (CartService)

```typescript
interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}

// Observable streams
cart$: Observable<Cart>
itemCount$: Observable<number>
subtotal$: Observable<number>
isEmpty$: Observable<boolean>

// Actions
addItem(product: Product, color: string, size: string, quantity: number): void
updateQuantity(cartItemId: string, quantity: number): void
removeItem(cartItemId: string): void
clearCart(): void
applyPromoCode(code: string): Observable<PromoResult>
```

### 5.2 Checkout State (CheckoutService)

```typescript
interface CheckoutState {
  currentStep: 'delivery' | 'payment' | 'review';
  deliveryInfo: DeliveryInfo | null;
  paymentInfo: PaymentInfo | null;
  shippingOption: ShippingOption;
  isProcessing: boolean;
  errors: Record<string, string>;
}

// Actions
setDeliveryInfo(info: DeliveryInfo): void
setPaymentInfo(info: PaymentInfo): void
setShippingOption(option: ShippingOption): void
placeOrder(): Observable<OrderResult>
```

---

## 6. Routes

```typescript
// New routes to add
{ path: 'cart', component: CartPage }
{ path: 'checkout', component: CheckoutPage, canActivate: [CartNotEmptyGuard] }
{ path: 'order-confirmation/:orderId', component: OrderConfirmationPage }
```

---

## 7. Acceptance Criteria

### Cart Page:
- [ ] User can view all items in cart
- [ ] User can update quantity (1-10)
- [ ] User can remove items
- [ ] Cart persists across browser sessions
- [ ] Empty cart shows appropriate message
- [ ] Subtotal updates in real-time
- [ ] Checkout button navigates to checkout

### Checkout Page:
- [ ] Accordion shows 3 steps (Delivery, Payment, Review)
- [ ] Only one step expanded at a time
- [ ] Forms validate on blur and submit
- [ ] User can edit previous steps
- [ ] Order summary visible throughout
- [ ] Place Order shows loading state
- [ ] Success redirects to confirmation

### Cart Notification:
- [ ] Appears when item added to bag
- [ ] Shows product details
- [ ] Auto-dismisses after 4 seconds
- [ ] View Bag navigates to cart
- [ ] Checkout navigates to checkout

---

## 8. Mockup Files

See the following HTML mockup files in this directory:
- `mockup-cart-page.html` - Full cart page mockup
- `mockup-checkout-page.html` - Checkout flow mockup
- `mockup-cart-notification.html` - Mini cart notification mockup
- `mockup-empty-cart.html` - Empty cart state mockup
- `mockup-order-confirmation.html` - Order confirmation mockup

Screenshots are available in the `screenshots/` subdirectory.
