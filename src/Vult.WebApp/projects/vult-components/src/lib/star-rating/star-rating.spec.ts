import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StarRating, StarRatingSize } from './star-rating';

describe('StarRating', () => {
  let component: StarRating;
  let fixture: ComponentFixture<StarRating>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarRating]
    }).compileComponents();

    fixture = TestBed.createComponent(StarRating);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.rating).toBe(0);
    expect(component.maxRating).toBe(5);
    expect(component.size).toBe('medium');
  });

  it('should render correct number of stars based on maxRating', () => {
    component.maxRating = 5;
    fixture.detectChanges();

    const stars = fixture.nativeElement.querySelectorAll('.star-rating__star');
    expect(stars.length).toBe(5);
  });

  it('should fill correct number of stars based on rating', () => {
    component.rating = 3;
    component.maxRating = 5;
    fixture.detectChanges();

    const filledStars = fixture.nativeElement.querySelectorAll('.star-rating__star--filled');
    const emptyStars = fixture.nativeElement.querySelectorAll('.star-rating__star--empty');

    expect(filledStars.length).toBe(3);
    expect(emptyStars.length).toBe(2);
  });

  it('should apply star-rating--small class', () => {
    component.size = 'small';
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('.star-rating');
    expect(container.classList.contains('star-rating--small')).toBeTruthy();
  });

  it('should apply star-rating--medium class', () => {
    component.size = 'medium';
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('.star-rating');
    expect(container.classList.contains('star-rating--medium')).toBeTruthy();
  });

  it('should apply star-rating--large class', () => {
    component.size = 'large';
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('.star-rating');
    expect(container.classList.contains('star-rating--large')).toBeTruthy();
  });

  it('should return correct star array', () => {
    component.rating = 2;
    component.maxRating = 5;

    const starArray = component.getStarArray();
    expect(starArray).toEqual([true, true, false, false, false]);
  });

  it('should return correct star size for small', () => {
    component.size = 'small';
    expect(component.getStarSize()).toBe(12);
  });

  it('should return correct star size for medium', () => {
    component.size = 'medium';
    expect(component.getStarSize()).toBe(16);
  });

  it('should return correct star size for large', () => {
    component.size = 'large';
    expect(component.getStarSize()).toBe(20);
  });

  it('should have correct aria-label', () => {
    component.rating = 4;
    component.maxRating = 5;
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.star-rating');
    expect(container.getAttribute('aria-label')).toBe('4 out of 5 stars');
  });

  it('should have role img', () => {
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.star-rating');
    expect(container.getAttribute('role')).toBe('img');
  });

  it('should handle zero rating', () => {
    component.rating = 0;
    component.maxRating = 5;
    fixture.detectChanges();

    const filledStars = fixture.nativeElement.querySelectorAll('.star-rating__star--filled');
    expect(filledStars.length).toBe(0);
  });

  it('should handle full rating', () => {
    component.rating = 5;
    component.maxRating = 5;
    fixture.detectChanges();

    const filledStars = fixture.nativeElement.querySelectorAll('.star-rating__star--filled');
    expect(filledStars.length).toBe(5);
  });

  it('should handle custom maxRating', () => {
    component.rating = 8;
    component.maxRating = 10;
    fixture.detectChanges();

    const stars = fixture.nativeElement.querySelectorAll('.star-rating__star');
    const filledStars = fixture.nativeElement.querySelectorAll('.star-rating__star--filled');

    expect(stars.length).toBe(10);
    expect(filledStars.length).toBe(8);
  });
});
