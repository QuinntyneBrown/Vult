import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuantitySelector } from './quantity-selector';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('QuantitySelector', () => {
  let component: QuantitySelector;
  let fixture: ComponentFixture<QuantitySelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuantitySelector, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(QuantitySelector);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.maxQuantity).toBe(10);
    expect(component.minQuantity).toBe(1);
    expect(component.showLabel).toBeTruthy();
    expect(component.label).toBe('Quantity');
    expect(component.ariaLabel).toBe('');
    expect(component.testId).toBe('quantity-selector');
  });

  it('should implement ControlValueAccessor writeValue', () => {
    component.writeValue(5);
    expect(component.quantityValue).toBe(5);
  });

  it('should use minQuantity when writeValue receives null', () => {
    component.minQuantity = 1;
    component.writeValue(null as any);
    expect(component.quantityValue).toBe(1);
  });

  it('should register onChange callback', () => {
    const callback = jest.fn();
    component.registerOnChange(callback);

    component.onSelectionChange(3);

    expect(callback).toHaveBeenCalledWith(3);
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

  it('should emit quantityChange on selection change', () => {
    const emitSpy = jest.spyOn(component.quantityChange, 'emit');
    fixture.detectChanges();

    component.onSelectionChange(4);

    expect(emitSpy).toHaveBeenCalledWith(4);
  });

  it('should compute quantity options correctly', () => {
    component.minQuantity = 1;
    component.maxQuantity = 5;
    fixture.detectChanges();

    expect(component.quantityOptions()).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle custom min/max range', () => {
    component.minQuantity = 3;
    component.maxQuantity = 7;
    fixture.detectChanges();

    expect(component.quantityOptions()).toEqual([3, 4, 5, 6, 7]);
  });

  it('should set quantity via quantity input', () => {
    component.quantity = 5;
    expect(component.quantityValue).toBe(5);
  });

  it('should not set quantity via input when undefined', () => {
    const initialValue = component.quantityValue;
    component.quantity = undefined as any;
    expect(component.quantityValue).toBe(initialValue);
  });
});
