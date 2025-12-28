import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecondaryButton, SecondaryButtonSize, SecondaryButtonVariant, SecondaryButtonTheme } from './secondary-button';

describe('SecondaryButton', () => {
  let component: SecondaryButton;
  let fixture: ComponentFixture<SecondaryButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondaryButton]
    }).compileComponents();

    fixture = TestBed.createComponent(SecondaryButton);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.variant).toBe('outlined');
    expect(component.size).toBe('medium');
    expect(component.theme).toBe('dark');
    expect(component.type).toBe('button');
    expect(component.disabled).toBeFalsy();
  });

  it('should render button when href is not provided', () => {
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement).toBeTruthy();
  });

  it('should render anchor when href is provided', () => {
    component.href = '/test-link';
    fixture.detectChanges();

    const anchorElement = fixture.nativeElement.querySelector('a');
    expect(anchorElement).toBeTruthy();
    expect(anchorElement.getAttribute('href')).toBe('/test-link');
  });

  it('should apply outlined variant class', () => {
    component.variant = 'outlined';
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.classList.contains('outlined')).toBeTruthy();
  });

  it('should apply text variant class', () => {
    component.variant = 'text';
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.classList.contains('text')).toBeTruthy();
  });

  it('should apply ghost variant class', () => {
    component.variant = 'ghost';
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.classList.contains('ghost')).toBeTruthy();
  });

  it('should apply small size class', () => {
    component.size = 'small';
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.classList.contains('small')).toBeTruthy();
  });

  it('should apply medium size class', () => {
    component.size = 'medium';
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.classList.contains('medium')).toBeTruthy();
  });

  it('should apply large size class', () => {
    component.size = 'large';
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.classList.contains('large')).toBeTruthy();
  });

  it('should apply light theme class when theme is light', () => {
    component.theme = 'light';
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.classList.contains('light')).toBeTruthy();
  });

  it('should not apply light class when theme is dark', () => {
    component.theme = 'dark';
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.classList.contains('light')).toBeFalsy();
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
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

    component.handleClick(event);

    expect(clickSpy).not.toHaveBeenCalled();
    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});
