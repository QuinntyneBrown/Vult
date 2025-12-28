import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileFilterToggle } from './mobile-filter-toggle';

describe('MobileFilterToggle', () => {
  let component: MobileFilterToggle;
  let fixture: ComponentFixture<MobileFilterToggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileFilterToggle]
    }).compileComponents();

    fixture = TestBed.createComponent(MobileFilterToggle);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.isActive).toBeFalsy();
    expect(component.showText).toBe('Show Filters');
    expect(component.hideText).toBe('Hide Filters');
    expect(component.activeFilterCount).toBe(0);
    expect(component.controlsId).toBe('');
  });

  it('should display showText when not active', () => {
    component.isActive = false;
    fixture.detectChanges();

    const textElement = fixture.nativeElement.querySelector('.mobile-filter-toggle__text');
    expect(textElement.textContent.trim()).toBe('Show Filters');
  });

  it('should display hideText when active', () => {
    component.isActive = true;
    fixture.detectChanges();

    const textElement = fixture.nativeElement.querySelector('.mobile-filter-toggle__text');
    expect(textElement.textContent.trim()).toBe('Hide Filters');
  });

  it('should use custom showText when not active', () => {
    component.showText = 'Open';
    component.isActive = false;
    fixture.detectChanges();

    const textElement = fixture.nativeElement.querySelector('.mobile-filter-toggle__text');
    expect(textElement.textContent.trim()).toBe('Open');
  });

  it('should use custom hideText when active', () => {
    component.hideText = 'Close';
    component.isActive = true;
    fixture.detectChanges();

    const textElement = fixture.nativeElement.querySelector('.mobile-filter-toggle__text');
    expect(textElement.textContent.trim()).toBe('Close');
  });

  it('should apply active class when isActive is true', () => {
    component.isActive = true;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.mobile-filter-toggle');
    expect(button.classList.contains('mobile-filter-toggle--active')).toBeTruthy();
  });

  it('should display active filter count when greater than 0', () => {
    component.activeFilterCount = 3;
    fixture.detectChanges();

    const countElement = fixture.nativeElement.querySelector('.mobile-filter-toggle__count');
    expect(countElement).toBeTruthy();
    expect(countElement.textContent.trim()).toBe('3');
  });

  it('should not display count badge when activeFilterCount is 0', () => {
    component.activeFilterCount = 0;
    fixture.detectChanges();

    const countElement = fixture.nativeElement.querySelector('.mobile-filter-toggle__count');
    expect(countElement).toBeFalsy();
  });

  it('should set aria-expanded to false when not active', () => {
    component.isActive = false;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('should set aria-expanded to true when active', () => {
    component.isActive = true;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  it('should set aria-controls', () => {
    component.controlsId = 'filter-panel';
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-controls')).toBe('filter-panel');
  });

  it('should emit toggleFilters with opposite value when clicked', () => {
    component.isActive = false;
    const emitSpy = jest.spyOn(component.toggleFilters, 'emit');
    fixture.detectChanges();

    component.toggle();

    expect(emitSpy).toHaveBeenCalledWith(true);
  });

  it('should emit false when active and toggled', () => {
    component.isActive = true;
    const emitSpy = jest.spyOn(component.toggleFilters, 'emit');
    fixture.detectChanges();

    component.toggle();

    expect(emitSpy).toHaveBeenCalledWith(false);
  });

  it('should have correct aria-label on count badge', () => {
    component.activeFilterCount = 5;
    fixture.detectChanges();

    const countElement = fixture.nativeElement.querySelector('.mobile-filter-toggle__count');
    expect(countElement.getAttribute('aria-label')).toBe('Active filters');
  });
});
