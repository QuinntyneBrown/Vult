import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckboxFilter, CheckboxOption } from './checkbox-filter';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CheckboxFilter', () => {
  let component: CheckboxFilter;
  let fixture: ComponentFixture<CheckboxFilter>;

  const mockOptions: CheckboxOption[] = [
    { id: 'opt1', label: 'Option 1', count: 10 },
    { id: 'opt2', label: 'Option 2', count: 5 },
    { id: 'opt3', label: 'Option 3', count: 3 }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxFilter, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxFilter);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.label).toBe('');
    expect(component.options).toEqual([]);
    expect(component.collapsible).toBeTruthy();
    expect(component.expanded()).toBeTruthy();
    expect(component.selectedIds()).toEqual([]);
  });

  it('should implement ControlValueAccessor writeValue', () => {
    component.writeValue(['opt1', 'opt2']);
    expect(component.selectedIds()).toEqual(['opt1', 'opt2']);
  });

  it('should implement ControlValueAccessor writeValue with null', () => {
    component.writeValue(null as any);
    expect(component.selectedIds()).toEqual([]);
  });

  it('should register onChange callback', () => {
    const callback = jest.fn();
    component.registerOnChange(callback);

    component.onOptionChange(mockOptions[0], true);

    expect(callback).toHaveBeenCalledWith(['opt1']);
  });

  it('should register onTouched callback', () => {
    const callback = jest.fn();
    component.registerOnTouched(callback);

    component.onOptionChange(mockOptions[0], true);

    expect(callback).toHaveBeenCalled();
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    expect(component.disabled()).toBeTruthy();

    component.setDisabledState(false);
    expect(component.disabled()).toBeFalsy();
  });

  it('should toggle expanded when collapsible', () => {
    component.collapsible = true;
    expect(component.expanded()).toBeTruthy();

    component.toggleExpanded();
    expect(component.expanded()).toBeFalsy();

    component.toggleExpanded();
    expect(component.expanded()).toBeTruthy();
  });

  it('should not toggle expanded when not collapsible', () => {
    component.collapsible = false;
    expect(component.expanded()).toBeTruthy();

    component.toggleExpanded();
    expect(component.expanded()).toBeTruthy();
  });

  it('should check if option is checked', () => {
    component.selectedIds.set(['opt1', 'opt2']);

    expect(component.isChecked('opt1')).toBeTruthy();
    expect(component.isChecked('opt2')).toBeTruthy();
    expect(component.isChecked('opt3')).toBeFalsy();
  });

  it('should add option to selected when checked', () => {
    component.options = mockOptions;
    fixture.detectChanges();

    component.onOptionChange(mockOptions[0], true);

    expect(component.selectedIds()).toContain('opt1');
  });

  it('should remove option from selected when unchecked', () => {
    component.options = mockOptions;
    component.selectedIds.set(['opt1', 'opt2']);
    fixture.detectChanges();

    component.onOptionChange(mockOptions[0], false);

    expect(component.selectedIds()).not.toContain('opt1');
    expect(component.selectedIds()).toContain('opt2');
  });

  it('should emit optionChange event', () => {
    component.options = mockOptions;
    const emitSpy = jest.spyOn(component.optionChange, 'emit');
    fixture.detectChanges();

    component.onOptionChange(mockOptions[0], true);

    expect(emitSpy).toHaveBeenCalledWith({ option: mockOptions[0], checked: true });
  });

  it('should generate correct labelId', () => {
    component.label = 'Test Label';
    expect(component.labelId).toBe('checkbox-filter-label-test-label');
  });

  it('should generate correct contentId', () => {
    component.label = 'Test Label';
    expect(component.contentId).toBe('checkbox-filter-content-test-label');
  });
});
