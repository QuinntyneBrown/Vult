import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormField, FormFieldType } from './form-field';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('FormField', () => {
  let component: FormField;
  let fixture: ComponentFixture<FormField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormField, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FormField);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.type).toBe('text');
    expect(component.label).toBe('');
    expect(component.required).toBeFalsy();
    expect(component.autocomplete).toBe('off');
    expect(component.showValidation).toBeTruthy();
    expect(component.hasError).toBeFalsy();
    expect(component.errorMessage).toBe('');
    expect(component.hint).toBe('');
    expect(component.testId).toBe('form-field');
  });

  it('should implement ControlValueAccessor writeValue', () => {
    component.writeValue('test value');
    expect(component.value()).toBe('test value');
  });

  it('should implement ControlValueAccessor writeValue with null', () => {
    component.writeValue(null as any);
    expect(component.value()).toBe('');
  });

  it('should register onChange callback', () => {
    const callback = jest.fn();
    component.registerOnChange(callback);

    const event = { target: { value: 'new value' } } as unknown as Event;
    component.onInput(event);

    expect(callback).toHaveBeenCalledWith('new value');
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

  it('should emit valueChange on input', () => {
    const emitSpy = jest.spyOn(component.valueChange, 'emit');
    fixture.detectChanges();

    const event = { target: { value: 'new value' } } as unknown as Event;
    component.onInput(event);

    expect(emitSpy).toHaveBeenCalledWith('new value');
  });

  it('should emit fieldFocus on focus', () => {
    const emitSpy = jest.spyOn(component.fieldFocus, 'emit');
    fixture.detectChanges();

    component.onFocus();

    expect(emitSpy).toHaveBeenCalled();
    expect(component.isFocused()).toBeTruthy();
  });

  it('should emit fieldBlur on blur', () => {
    const emitSpy = jest.spyOn(component.fieldBlur, 'emit');
    fixture.detectChanges();

    component.onBlur();

    expect(emitSpy).toHaveBeenCalled();
    expect(component.isFocused()).toBeFalsy();
  });

  it('should set valid state via valid input', () => {
    component.valid = true;
    expect(component.isValid()).toBeTruthy();
  });

  it('should set valid state via isValid input', () => {
    component.isValidInput = true;
    expect(component.isValid()).toBeTruthy();
  });

  it('should compute hasValue correctly', () => {
    expect(component.hasValue()).toBeFalsy();

    component.writeValue('test');
    expect(component.hasValue()).toBeTruthy();
  });
});
