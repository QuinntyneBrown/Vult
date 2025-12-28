import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddToBagButton, AddToBagButtonState } from './add-to-bag-button';

describe('AddToBagButton', () => {
  let component: AddToBagButton;
  let fixture: ComponentFixture<AddToBagButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddToBagButton]
    }).compileComponents();

    fixture = TestBed.createComponent(AddToBagButton);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.disabled).toBeFalsy();
    expect(component.state).toBe('default');
    expect(component.fullWidth).toBeTruthy();
    expect(component.showIcon).toBeFalsy();
    expect(component.ariaLabel).toBe('Add to bag');
    expect(component.errorMessage).toBe('');
  });

  it('should display "Add to Bag" text in default state', () => {
    fixture.detectChanges();
    const textElement = fixture.nativeElement.querySelector('.add-to-bag-btn__text');
    expect(textElement.textContent.trim()).toBe('Add to Bag');
  });

  it('should display "Added" text in success state', () => {
    component.state = 'success';
    fixture.detectChanges();
    const textElement = fixture.nativeElement.querySelector('.add-to-bag-btn__text');
    expect(textElement.textContent.trim()).toBe('Added');
  });

  it('should display "Try Again" text in error state', () => {
    component.state = 'error';
    fixture.detectChanges();
    const textElement = fixture.nativeElement.querySelector('.add-to-bag-btn__text');
    expect(textElement.textContent.trim()).toBe('Try Again');
  });

  it('should apply loading class in loading state', () => {
    component.state = 'loading';
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('.add-to-bag-btn');
    expect(buttonElement.classList.contains('add-to-bag-btn--loading')).toBeTruthy();
  });

  it('should apply success class in success state', () => {
    component.state = 'success';
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('.add-to-bag-btn');
    expect(buttonElement.classList.contains('add-to-bag-btn--success')).toBeTruthy();
  });

  it('should be disabled when disabled is true', () => {
    component.disabled = true;
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.disabled).toBeTruthy();
  });

  it('should be disabled when state is loading', () => {
    component.state = 'loading';
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.disabled).toBeTruthy();
  });

  it('should show icon when showIcon is true and state is default', () => {
    component.showIcon = true;
    component.state = 'default';
    fixture.detectChanges();
    const iconElement = fixture.nativeElement.querySelector('.add-to-bag-btn__icon');
    expect(iconElement).toBeTruthy();
  });

  it('should show check icon when state is success', () => {
    component.state = 'success';
    fixture.detectChanges();
    const checkElement = fixture.nativeElement.querySelector('.add-to-bag-btn__check');
    expect(checkElement).toBeTruthy();
  });

  it('should show error message when state is error and errorMessage is set', () => {
    component.state = 'error';
    component.errorMessage = 'Something went wrong';
    fixture.detectChanges();
    const errorElement = fixture.nativeElement.querySelector('.add-to-bag-error');
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent).toContain('Something went wrong');
  });

  it('should emit addToBag on click when not disabled', () => {
    const emitSpy = jest.spyOn(component.addToBag, 'emit');
    fixture.detectChanges();

    component.handleClick();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not emit addToBag when disabled', () => {
    component.disabled = true;
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.addToBag, 'emit');
    component.handleClick();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should not emit addToBag when loading', () => {
    component.state = 'loading';
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.addToBag, 'emit');
    component.handleClick();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should set aria-busy when loading', () => {
    component.state = 'loading';
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.getAttribute('aria-busy')).toBe('true');
  });
});
