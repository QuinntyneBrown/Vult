import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartSummary, CartSummaryData } from './cart-summary';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CartSummary', () => {
  let component: CartSummary;
  let fixture: ComponentFixture<CartSummary>;

  const mockData: CartSummaryData = {
    subtotal: 199.99,
    shipping: 10,
    tax: 20,
    discount: 15,
    promoCode: 'SAVE15'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartSummary, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CartSummary);
    component = fixture.componentInstance;
    component.data = mockData;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.title).toBe('Summary');
    expect(component.showPromoCode).toBeTruthy();
    expect(component.showCheckoutButton).toBeTruthy();
    expect(component.showPayPalButton).toBeTruthy();
    expect(component.checkoutButtonText).toBe('Checkout');
    expect(component.checkoutDisabled).toBeFalsy();
  });

  it('should calculate total correctly', () => {
    expect(component.calculatedTotal).toBe(214.99); // 199.99 + 10 + 20 - 15
  });

  it('should use provided total if available', () => {
    component.data = { ...mockData, total: 200 };
    expect(component.calculatedTotal).toBe(200);
  });

  it('should handle free shipping', () => {
    component.data = { ...mockData, shipping: 'free' };
    expect(component.calculatedTotal).toBe(204.99); // 199.99 + 0 + 20 - 15
  });

  it('should handle calculated shipping', () => {
    component.data = { ...mockData, shipping: 'calculated' };
    expect(component.calculatedTotal).toBe(204.99); // 199.99 + 0 + 20 - 15
  });

  it('should handle calculated tax', () => {
    component.data = { ...mockData, tax: 'calculated' };
    expect(component.calculatedTotal).toBe(194.99); // 199.99 + 10 + 0 - 15
  });

  it('should not go negative', () => {
    component.data = { subtotal: 10, shipping: 0, tax: 0, discount: 100 };
    expect(component.calculatedTotal).toBe(0);
  });

  it('should emit checkout when checkout is clicked', () => {
    const emitSpy = jest.spyOn(component.checkout, 'emit');
    fixture.detectChanges();

    component.onCheckout();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit payPalClick when PayPal button is clicked', () => {
    const emitSpy = jest.spyOn(component.payPalClick, 'emit');
    fixture.detectChanges();

    component.onPayPalClick();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit promoApply when promo code is applied', () => {
    const emitSpy = jest.spyOn(component.promoApply, 'emit');
    fixture.detectChanges();

    component.onApplyPromo('NEWCODE');

    expect(emitSpy).toHaveBeenCalledWith('NEWCODE');
  });

  it('should emit promoRemove when promo code is removed', () => {
    const emitSpy = jest.spyOn(component.promoRemove, 'emit');
    fixture.detectChanges();

    component.onRemovePromo();

    expect(emitSpy).toHaveBeenCalled();
  });
});
