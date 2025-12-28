import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FavoritesButton, FavoritesButtonVariant } from './favorites-button';

describe('FavoritesButton', () => {
  let component: FavoritesButton;
  let fixture: ComponentFixture<FavoritesButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritesButton]
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesButton);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.isFavorited).toBeFalsy();
    expect(component.loading).toBeFalsy();
    expect(component.variant).toBe('icon-only');
  });

  it('should render icon-only variant by default', () => {
    fixture.detectChanges();
    const iconOnlyBtn = fixture.nativeElement.querySelector('.favorites-btn');
    expect(iconOnlyBtn).toBeTruthy();
  });

  it('should render full-width variant when specified', () => {
    component.variant = 'full-width';
    fixture.detectChanges();
    const fullWidthBtn = fixture.nativeElement.querySelector('.favorites-btn--full');
    expect(fullWidthBtn).toBeTruthy();
  });

  it('should apply favorited class when isFavorited is true', () => {
    component.isFavorited = true;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.favorites-btn');
    expect(button.classList.contains('favorites-btn--favorited')).toBeTruthy();
  });

  it('should apply loading class when loading is true', () => {
    component.loading = true;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.favorites-btn');
    expect(button.classList.contains('favorites-btn--loading')).toBeTruthy();
  });

  it('should be disabled when loading', () => {
    component.loading = true;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeTruthy();
  });

  it('should set aria-label to Add to favorites when not favorited', () => {
    component.isFavorited = false;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Add to favorites');
  });

  it('should set aria-label to Remove from favorites when favorited', () => {
    component.isFavorited = true;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Remove from favorites');
  });

  it('should set aria-pressed based on isFavorited state', () => {
    component.isFavorited = true;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-pressed')).toBe('true');
  });

  it('should emit favoriteToggle with opposite value on click', () => {
    const emitSpy = jest.spyOn(component.favoriteToggle, 'emit');
    fixture.detectChanges();

    component.handleClick();

    expect(emitSpy).toHaveBeenCalledWith(true);
  });

  it('should emit favoriteToggle with false when currently favorited', () => {
    component.isFavorited = true;
    const emitSpy = jest.spyOn(component.favoriteToggle, 'emit');
    fixture.detectChanges();

    component.handleClick();

    expect(emitSpy).toHaveBeenCalledWith(false);
  });

  it('should not emit favoriteToggle when loading', () => {
    component.loading = true;
    const emitSpy = jest.spyOn(component.favoriteToggle, 'emit');
    fixture.detectChanges();

    component.handleClick();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should set isAnimating to true on click and reset after timeout', fakeAsync(() => {
    fixture.detectChanges();

    component.handleClick();

    expect(component.isAnimating()).toBeTruthy();

    tick(300);

    expect(component.isAnimating()).toBeFalsy();
  }));

  it('should display text in full-width variant', () => {
    component.variant = 'full-width';
    fixture.detectChanges();
    const textElement = fixture.nativeElement.querySelector('.favorites-btn__text');
    expect(textElement.textContent.trim()).toBe('Favorite');
  });

  it('should display "Favorited" text when isFavorited in full-width variant', () => {
    component.variant = 'full-width';
    component.isFavorited = true;
    fixture.detectChanges();
    const textElement = fixture.nativeElement.querySelector('.favorites-btn__text');
    expect(textElement.textContent.trim()).toBe('Favorited');
  });
});
