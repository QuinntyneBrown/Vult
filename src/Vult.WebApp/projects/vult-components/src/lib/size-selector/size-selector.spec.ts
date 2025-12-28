import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SizeSelector, SizeOption } from './size-selector';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SizeSelector', () => {
  let component: SizeSelector;
  let fixture: ComponentFixture<SizeSelector>;

  const mockSizes: SizeOption[] = [
    { id: 's', label: 'S', available: true },
    { id: 'm', label: 'M', available: true },
    { id: 'l', label: 'L', available: false },
    { id: 'xl', label: 'XL', available: true }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SizeSelector, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SizeSelector);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.sizes).toEqual([]);
    expect(component.ariaLabel).toBe('Filter by size');
    expect(component.multiSelect).toBeTruthy();
    expect(component.showStrikethrough).toBeFalsy();
    expect(component.selectedIds()).toEqual([]);
  });

  it('should implement ControlValueAccessor writeValue', () => {
    component.writeValue(['s', 'm']);
    expect(component.selectedIds()).toEqual(['s', 'm']);
  });

  it('should implement ControlValueAccessor writeValue with null', () => {
    component.writeValue(null as any);
    expect(component.selectedIds()).toEqual([]);
  });

  it('should register onChange callback', () => {
    component.sizes = mockSizes;
    const callback = jest.fn();
    component.registerOnChange(callback);
    fixture.detectChanges();

    component.onToggleChange({ value: ['s'] });

    expect(callback).toHaveBeenCalledWith(['s']);
  });

  it('should register onTouched callback', () => {
    component.sizes = mockSizes;
    const callback = jest.fn();
    component.registerOnTouched(callback);
    fixture.detectChanges();

    component.onToggleChange({ value: ['s'] });

    expect(callback).toHaveBeenCalled();
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    expect(component.disabled()).toBeTruthy();

    component.setDisabledState(false);
    expect(component.disabled()).toBeFalsy();
  });

  it('should handle single value in onToggleChange', () => {
    component.sizes = mockSizes;
    fixture.detectChanges();

    component.onToggleChange({ value: 's' });

    expect(component.selectedIds()).toEqual(['s']);
  });

  it('should handle empty value in onToggleChange', () => {
    component.sizes = mockSizes;
    fixture.detectChanges();

    component.onToggleChange({ value: null as any });

    expect(component.selectedIds()).toEqual([]);
  });

  it('should emit selectionChange on toggle', () => {
    component.sizes = mockSizes;
    const emitSpy = jest.spyOn(component.selectionChange, 'emit');
    fixture.detectChanges();

    component.onToggleChange({ value: ['s', 'm'] });

    expect(emitSpy).toHaveBeenCalledWith(['s', 'm']);
  });

  it('should toggle size in multi-select mode', () => {
    component.sizes = mockSizes;
    component.multiSelect = true;
    fixture.detectChanges();

    component.toggleSize(mockSizes[0]); // Add S
    expect(component.selectedIds()).toContain('s');

    component.toggleSize(mockSizes[1]); // Add M
    expect(component.selectedIds()).toContain('m');

    component.toggleSize(mockSizes[0]); // Remove S
    expect(component.selectedIds()).not.toContain('s');
    expect(component.selectedIds()).toContain('m');
  });

  it('should toggle size in single-select mode', () => {
    component.sizes = mockSizes;
    component.multiSelect = false;
    fixture.detectChanges();

    component.toggleSize(mockSizes[0]); // Add S
    expect(component.selectedIds()).toEqual(['s']);

    component.toggleSize(mockSizes[1]); // Add M (replaces S)
    expect(component.selectedIds()).toEqual(['m']);

    component.toggleSize(mockSizes[1]); // Remove M
    expect(component.selectedIds()).toEqual([]);
  });

  it('should not toggle unavailable size', () => {
    component.sizes = mockSizes;
    fixture.detectChanges();

    component.toggleSize(mockSizes[2]); // L - unavailable

    expect(component.selectedIds()).not.toContain('l');
  });

  it('should emit sizeSelect on toggle', () => {
    component.sizes = mockSizes;
    const emitSpy = jest.spyOn(component.sizeSelect, 'emit');
    fixture.detectChanges();

    component.toggleSize(mockSizes[0]);

    expect(emitSpy).toHaveBeenCalledWith(mockSizes[0]);
  });

  it('should set selectedSizeIds via input', () => {
    component.selectedSizeIds = ['s', 'xl'];
    expect(component.selectedIds()).toEqual(['s', 'xl']);
  });
});
