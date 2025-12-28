import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PromoCodeInput } from './promo-code-input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PromoCodeInput', () => {
  let component: PromoCodeInput;
  let fixture: ComponentFixture<PromoCodeInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoCodeInput, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PromoCodeInput);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.appliedCode).toBe('');
    expect(component.isLoading).toBeFalsy();
    expect(component.error).toBe('');
    expect(component.toggleLabel).toBe('Do you have a Promo Code?');
    expect(component.placeholder).toBe('Enter promo code');
    expect(component.testId).toBe('promo-code-input');
  });

  it('should implement ControlValueAccessor writeValue', () => {
    component.writeValue('PROMO20');
    expect(component.promoCode()).toBe('PROMO20');
  });

  it('should implement ControlValueAccessor writeValue with null', () => {
    component.writeValue(null as any);
    expect(component.promoCode()).toBe('');
  });

  it('should register onChange callback', () => {
    const callback = jest.fn();
    component.registerOnChange(callback);

    const event = { target: { value: 'NEWCODE' } } as unknown as Event;
    component.onInput(event);

    expect(callback).toHaveBeenCalledWith('NEWCODE');
  });

  it('should register onTouched callback', () => {
    const callback = jest.fn();
    component.registerOnTouched(callback);

    component.onBlur();

    expect(callback).toHaveBeenCalled();
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    expect(component.disabled()).toBeTruthy();

    component.setDisabledState(false);
    expect(component.disabled()).toBeFalsy();
  });

  it('should toggle expanded state', () => {
    expect(component.isExpanded()).toBeFalsy();

    component.toggleExpanded();
    expect(component.isExpanded()).toBeTruthy();

    component.toggleExpanded();
    expect(component.isExpanded()).toBeFalsy();
  });

  it('should emit apply when promo code is applied', () => {
    component.promoCode.set('SAVE10');
    const emitSpy = jest.spyOn(component.apply, 'emit');
    fixture.detectChanges();

    component.onApply();

    expect(emitSpy).toHaveBeenCalledWith('SAVE10');
  });

  it('should not emit apply when promo code is empty', () => {
    component.promoCode.set('   ');
    const emitSpy = jest.spyOn(component.apply, 'emit');
    fixture.detectChanges();

    component.onApply();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit remove and clear promo code on remove', () => {
    component.promoCode.set('SAVE10');
    const emitSpy = jest.spyOn(component.remove, 'emit');
    const onChangeSpy = jest.fn();
    component.registerOnChange(onChangeSpy);
    fixture.detectChanges();

    component.onRemove();

    expect(component.promoCode()).toBe('');
    expect(onChangeSpy).toHaveBeenCalledWith('');
    expect(emitSpy).toHaveBeenCalled();
  });
});
