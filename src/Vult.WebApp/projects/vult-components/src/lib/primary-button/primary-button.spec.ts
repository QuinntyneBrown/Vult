import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrimaryButton, ButtonSize, ButtonTheme } from './primary-button';

describe('PrimaryButton', () => {
  let component: PrimaryButton;
  let fixture: ComponentFixture<PrimaryButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimaryButton]
    }).compileComponents();

    fixture = TestBed.createComponent(PrimaryButton);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.size).toBe('medium');
    expect(component.theme).toBe('dark');
    expect(component.type).toBe('button');
    expect(component.disabled).toBeFalsy();
    expect(component.loading).toBeFalsy();
    expect(component.fullWidth).toBeFalsy();
  });

  it('should render button when href is not provided', () => {
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    const anchorElement = fixture.nativeElement.querySelector('a');

    expect(buttonElement).toBeTruthy();
    expect(anchorElement).toBeFalsy();
  });

  it('should render anchor when href is provided', () => {
    component.href = '/test-link';
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    const anchorElement = fixture.nativeElement.querySelector('a');

    expect(buttonElement).toBeFalsy();
    expect(anchorElement).toBeTruthy();
    expect(anchorElement.getAttribute('href')).toBe('/test-link');
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

  it('should apply dark theme class', () => {
    component.theme = 'dark';
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.classList.contains('dark')).toBeTruthy();
  });

  it('should apply light theme class', () => {
    component.theme = 'light';
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.classList.contains('light')).toBeTruthy();
  });

  it('should apply full-width class when fullWidth is true', () => {
    component.fullWidth = true;
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.classList.contains('full-width')).toBeTruthy();
  });

  it('should apply loading class when loading is true', () => {
    component.loading = true;
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.classList.contains('loading')).toBeTruthy();
  });

  it('should be disabled when disabled is true', () => {
    component.disabled = true;
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.disabled).toBeTruthy();
  });

  it('should be disabled when loading is true', () => {
    component.loading = true;
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.disabled).toBeTruthy();
  });

  it('should emit buttonClick on click when not disabled', () => {
    const clickSpy = jest.spyOn(component.buttonClick, 'emit');
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    buttonElement.click();

    expect(clickSpy).toHaveBeenCalled();
  });

  it('should not emit buttonClick when disabled', () => {
    component.disabled = true;
    fixture.detectChanges();

    const clickSpy = jest.spyOn(component.buttonClick, 'emit');
    component.handleClick(new MouseEvent('click'));

    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('should not emit buttonClick when loading', () => {
    component.loading = true;
    fixture.detectChanges();

    const clickSpy = jest.spyOn(component.buttonClick, 'emit');
    component.handleClick(new MouseEvent('click'));

    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('should set type attribute on button', () => {
    component.type = 'submit';
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.getAttribute('type')).toBe('submit');
  });

  it('should prevent default when disabled anchor is clicked', () => {
    component.href = '/test';
    component.disabled = true;
    fixture.detectChanges();

    const event = new MouseEvent('click');
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

    component.handleClick(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});
