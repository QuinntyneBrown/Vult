import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TypographyDisplay, TypographyVariant, TypographyColor } from './typography-display';

describe('TypographyDisplay', () => {
  let component: TypographyDisplay;
  let fixture: ComponentFixture<TypographyDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypographyDisplay]
    }).compileComponents();

    fixture = TestBed.createComponent(TypographyDisplay);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.variant).toBe('body-1');
    expect(component.color).toBe('primary');
    expect(component.align).toBe('left');
    expect(component.truncate).toBeFalsy();
    expect(component.lineClamp).toBeUndefined();
  });

  it('should apply display-1 variant class', () => {
    component.variant = 'display-1';
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('.typography');
    expect(element.classList.contains('display-1')).toBeTruthy();
  });

  it('should apply body-1 variant class', () => {
    component.variant = 'body-1';
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('.typography');
    expect(element.classList.contains('body-1')).toBeTruthy();
  });

  it('should apply text-primary color class', () => {
    component.color = 'primary';
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('.typography');
    expect(element.classList.contains('text-primary')).toBeTruthy();
  });

  it('should apply text-sale color class', () => {
    component.color = 'sale';
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('.typography');
    expect(element.classList.contains('text-sale')).toBeTruthy();
  });

  it('should apply center alignment class', () => {
    component.align = 'center';
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('.typography');
    expect(element.classList.contains('text-center')).toBeTruthy();
  });

  it('should apply truncate class when truncate is true', () => {
    component.truncate = true;
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('.typography');
    expect(element.classList.contains('text-truncate')).toBeTruthy();
  });

  it('should apply line clamp class when lineClamp is 2', () => {
    component.lineClamp = 2;
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('.typography');
    expect(element.classList.contains('text-clamp-2')).toBeTruthy();
  });

  it('should not apply line clamp class when lineClamp is not 2', () => {
    component.lineClamp = 3;
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('.typography');
    expect(element.classList.contains('text-clamp-2')).toBeFalsy();
  });

  it('should render ng-content', () => {
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('.typography');
    expect(element).toBeTruthy();
  });
});
