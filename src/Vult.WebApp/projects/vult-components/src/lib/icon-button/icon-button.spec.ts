import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconButton, IconButtonSize, IconButtonVariant } from './icon-button';

describe('IconButton', () => {
  let component: IconButton;
  let fixture: ComponentFixture<IconButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconButton]
    }).compileComponents();

    fixture = TestBed.createComponent(IconButton);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.size).toBe('medium');
    expect(component.variant).toBe('default');
    expect(component.active).toBeFalsy();
    expect(component.disabled).toBeFalsy();
    expect(component.ariaLabel).toBe('');
  });

  it('should apply icon-button--small class', () => {
    component.size = 'small';
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.classList.contains('icon-button--small')).toBeTruthy();
  });

  it('should apply icon-button--medium class', () => {
    component.size = 'medium';
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.classList.contains('icon-button--medium')).toBeTruthy();
  });

  it('should apply icon-button--large class', () => {
    component.size = 'large';
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.classList.contains('icon-button--large')).toBeTruthy();
  });

  it('should apply icon-button--filled class for filled variant', () => {
    component.variant = 'filled';
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.classList.contains('icon-button--filled')).toBeTruthy();
  });

  it('should apply icon-button--outlined class for outlined variant', () => {
    component.variant = 'outlined';
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.classList.contains('icon-button--outlined')).toBeTruthy();
  });

  it('should not apply variant class for default variant', () => {
    component.variant = 'default';
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.classList.contains('icon-button--filled')).toBeFalsy();
    expect(buttonElement.classList.contains('icon-button--outlined')).toBeFalsy();
  });

  it('should apply active class when active is true', () => {
    component.active = true;
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.classList.contains('icon-button--active')).toBeTruthy();
  });

  it('should be disabled when disabled is true', () => {
    component.disabled = true;
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.disabled).toBeTruthy();
  });

  it('should set aria-label', () => {
    component.ariaLabel = 'Test label';
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.getAttribute('aria-label')).toBe('Test label');
  });

  it('should set aria-pressed when active', () => {
    component.active = true;
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.getAttribute('aria-pressed')).toBe('true');
  });

  it('should emit buttonClick on click when not disabled', () => {
    const clickSpy = jest.spyOn(component.buttonClick, 'emit');
    fixture.detectChanges();

    const event = new MouseEvent('click');
    component.handleClick(event);

    expect(clickSpy).toHaveBeenCalledWith(event);
  });

  it('should not emit buttonClick when disabled', () => {
    component.disabled = true;
    fixture.detectChanges();

    const clickSpy = jest.spyOn(component.buttonClick, 'emit');
    const event = new MouseEvent('click');
    component.handleClick(event);

    expect(clickSpy).not.toHaveBeenCalled();
  });
});
