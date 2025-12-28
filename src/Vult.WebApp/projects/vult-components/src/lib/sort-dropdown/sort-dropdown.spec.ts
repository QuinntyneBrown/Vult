import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SortDropdown, SortOption } from './sort-dropdown';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SortDropdown', () => {
  let component: SortDropdown;
  let fixture: ComponentFixture<SortDropdown>;

  const mockOptions: SortOption[] = [
    { id: 'featured', label: 'Featured' },
    { id: 'price-asc', label: 'Price: Low to High' },
    { id: 'price-desc', label: 'Price: High to Low' },
    { id: 'newest', label: 'Newest' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortDropdown, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SortDropdown);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.options).toEqual([]);
    expect(component.label).toBe('Sort By');
    expect(component.showLabel).toBeTruthy();
    expect(component.selectedId()).toBeUndefined();
  });

  it('should implement ControlValueAccessor writeValue', () => {
    component.writeValue('featured');
    expect(component.selectedId()).toBe('featured');
  });

  it('should implement ControlValueAccessor writeValue with undefined', () => {
    component.writeValue(undefined);
    expect(component.selectedId()).toBeUndefined();
  });

  it('should register onChange callback', () => {
    component.options = mockOptions;
    const callback = jest.fn();
    component.registerOnChange(callback);
    fixture.detectChanges();

    component.onSelectionChange('price-asc');

    expect(callback).toHaveBeenCalledWith('price-asc');
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

  it('should emit selectionChange on selection', () => {
    component.options = mockOptions;
    const emitSpy = jest.spyOn(component.selectionChange, 'emit');
    fixture.detectChanges();

    component.onSelectionChange('price-asc');

    expect(emitSpy).toHaveBeenCalledWith(mockOptions[1]);
  });

  it('should not emit selectionChange for unknown option', () => {
    component.options = mockOptions;
    const emitSpy = jest.spyOn(component.selectionChange, 'emit');
    fixture.detectChanges();

    component.onSelectionChange('unknown');

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should compute selectedOption correctly', () => {
    component.options = mockOptions;
    component.selectedId.set('price-desc');
    fixture.detectChanges();

    expect(component.selectedOption()).toEqual(mockOptions[2]);
  });

  it('should return undefined for selectedOption when not found', () => {
    component.options = mockOptions;
    component.selectedId.set('unknown');
    fixture.detectChanges();

    expect(component.selectedOption()).toBeUndefined();
  });

  it('should set selectedOptionId via input', () => {
    component.selectedOptionId = 'newest';
    expect(component.selectedId()).toBe('newest');
  });
});
