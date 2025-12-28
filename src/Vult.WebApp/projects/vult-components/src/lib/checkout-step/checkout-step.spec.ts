import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutStep, CheckoutStepStatus } from './checkout-step';

describe('CheckoutStep', () => {
  let component: CheckoutStep;
  let fixture: ComponentFixture<CheckoutStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutStep]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutStep);
    component = fixture.componentInstance;
    component.stepNumber = 1;
    component.title = 'Shipping';
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.status).toBe('pending');
    expect(component.summary).toBe('');
    expect(component.testId).toBe('checkout-step');
  });

  it('should emit edit when header is clicked and status is completed', () => {
    component.status = 'completed';
    const emitSpy = jest.spyOn(component.edit, 'emit');
    fixture.detectChanges();

    component.onHeaderClick();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not emit edit when status is not completed', () => {
    component.status = 'pending';
    const emitSpy = jest.spyOn(component.edit, 'emit');
    fixture.detectChanges();

    component.onHeaderClick();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should not emit edit when status is active', () => {
    component.status = 'active';
    const emitSpy = jest.spyOn(component.edit, 'emit');
    fixture.detectChanges();

    component.onHeaderClick();

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
