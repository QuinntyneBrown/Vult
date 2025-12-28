import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorSwatchSelector, ColorOption } from './color-swatch-selector';

describe('ColorSwatchSelector', () => {
  let component: ColorSwatchSelector;
  let fixture: ComponentFixture<ColorSwatchSelector>;

  const mockColors: ColorOption[] = [
    { id: 'black', name: 'Black', color: '#000000' },
    { id: 'white', name: 'White', color: '#FFFFFF' },
    { id: 'red', name: 'Red', color: '#FF0000', available: false }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorSwatchSelector]
    }).compileComponents();

    fixture = TestBed.createComponent(ColorSwatchSelector);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.colors).toEqual([]);
    expect(component.ariaLabel).toBe('Select color');
    expect(component.moreCount).toBe(0);
    expect(component.selectedId()).toBeUndefined();
  });

  it('should implement ControlValueAccessor writeValue', () => {
    component.writeValue('black');
    expect(component.selectedId()).toBe('black');
  });

  it('should implement ControlValueAccessor writeValue with undefined', () => {
    component.writeValue(undefined);
    expect(component.selectedId()).toBeUndefined();
  });

  it('should register onChange callback', () => {
    component.colors = mockColors;
    const callback = jest.fn();
    component.registerOnChange(callback);
    fixture.detectChanges();

    component.selectColor(mockColors[0]);

    expect(callback).toHaveBeenCalledWith('black');
  });

  it('should register onTouched callback', () => {
    component.colors = mockColors;
    const callback = jest.fn();
    component.registerOnTouched(callback);
    fixture.detectChanges();

    component.selectColor(mockColors[0]);

    expect(callback).toHaveBeenCalled();
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    expect(component.disabled()).toBeTruthy();

    component.setDisabledState(false);
    expect(component.disabled()).toBeFalsy();
  });

  it('should select color', () => {
    component.colors = mockColors;
    const emitSpy = jest.spyOn(component.colorSelect, 'emit');
    fixture.detectChanges();

    component.selectColor(mockColors[0]);

    expect(component.selectedId()).toBe('black');
    expect(emitSpy).toHaveBeenCalledWith(mockColors[0]);
  });

  it('should not select unavailable color', () => {
    component.colors = mockColors;
    const emitSpy = jest.spyOn(component.colorSelect, 'emit');
    fixture.detectChanges();

    component.selectColor(mockColors[2]); // Red - unavailable

    expect(component.selectedId()).toBeUndefined();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should not select color when disabled', () => {
    component.colors = mockColors;
    component.setDisabledState(true);
    const emitSpy = jest.spyOn(component.colorSelect, 'emit');
    fixture.detectChanges();

    component.selectColor(mockColors[0]);

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should set selectedColorId via input', () => {
    component.selectedColorId = 'white';
    expect(component.selectedId()).toBe('white');
  });
});
