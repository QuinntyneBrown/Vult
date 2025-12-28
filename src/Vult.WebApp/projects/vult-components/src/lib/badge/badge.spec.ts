import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Badge, BadgeVariant } from './badge';

describe('Badge', () => {
  let component: Badge;
  let fixture: ComponentFixture<Badge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Badge]
    }).compileComponents();

    fixture = TestBed.createComponent(Badge);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default variant', () => {
    expect(component.variant).toBe('default');
  });

  it('should apply badge--new class for new variant', () => {
    component.variant = 'new';
    fixture.detectChanges();
    const badgeElement = fixture.nativeElement.querySelector('.badge');
    expect(badgeElement.classList.contains('badge--new')).toBeTruthy();
  });

  it('should apply badge--sale class for sale variant', () => {
    component.variant = 'sale';
    fixture.detectChanges();
    const badgeElement = fixture.nativeElement.querySelector('.badge');
    expect(badgeElement.classList.contains('badge--sale')).toBeTruthy();
  });

  it('should apply badge--member class for member variant', () => {
    component.variant = 'member';
    fixture.detectChanges();
    const badgeElement = fixture.nativeElement.querySelector('.badge');
    expect(badgeElement.classList.contains('badge--member')).toBeTruthy();
  });

  it('should apply badge--sustainable class for sustainable variant', () => {
    component.variant = 'sustainable';
    fixture.detectChanges();
    const badgeElement = fixture.nativeElement.querySelector('.badge');
    expect(badgeElement.classList.contains('badge--sustainable')).toBeTruthy();
  });

  it('should apply badge--bestseller class for bestseller variant', () => {
    component.variant = 'bestseller';
    fixture.detectChanges();
    const badgeElement = fixture.nativeElement.querySelector('.badge');
    expect(badgeElement.classList.contains('badge--bestseller')).toBeTruthy();
  });

  it('should not apply variant class for default variant', () => {
    component.variant = 'default';
    fixture.detectChanges();

    const badgeElement = fixture.nativeElement.querySelector('.badge');
    expect(badgeElement.classList.contains('badge--new')).toBeFalsy();
    expect(badgeElement.classList.contains('badge--sale')).toBeFalsy();
    expect(badgeElement.classList.contains('badge--member')).toBeFalsy();
    expect(badgeElement.classList.contains('badge--sustainable')).toBeFalsy();
    expect(badgeElement.classList.contains('badge--bestseller')).toBeFalsy();
  });

  it('should set aria-label when provided', () => {
    component.ariaLabel = 'Test label';
    fixture.detectChanges();

    const badgeElement = fixture.nativeElement.querySelector('.badge');
    expect(badgeElement.getAttribute('aria-label')).toBe('Test label');
  });

  it('should not set aria-label when not provided', () => {
    fixture.detectChanges();

    const badgeElement = fixture.nativeElement.querySelector('.badge');
    expect(badgeElement.getAttribute('aria-label')).toBeNull();
  });
});
