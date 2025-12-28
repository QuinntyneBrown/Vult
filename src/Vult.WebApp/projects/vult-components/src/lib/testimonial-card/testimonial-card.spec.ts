import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestimonialCard, TestimonialCardData } from './testimonial-card';
import { StarRating } from '../star-rating/star-rating';

describe('TestimonialCard', () => {
  let component: TestimonialCard;
  let fixture: ComponentFixture<TestimonialCard>;

  const mockTestimonial: TestimonialCardData = {
    id: '1',
    customerName: 'John Doe',
    photoUrl: '/customer-photo.jpg',
    rating: 5,
    text: 'This is a great product! I love it.'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialCard, StarRating]
    }).compileComponents();

    fixture = TestBed.createComponent(TestimonialCard);
    component = fixture.componentInstance;
    component.testimonial = mockTestimonial;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render customer photo', () => {
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('.testimonial-card__image img');
    expect(image.getAttribute('src')).toBe('/customer-photo.jpg');
    expect(image.getAttribute('alt')).toBe('John Doe - Vult customer');
  });

  it('should render star rating', () => {
    fixture.detectChanges();

    const starRating = fixture.nativeElement.querySelector('v-star-rating');
    expect(starRating).toBeTruthy();
  });

  it('should render testimonial text', () => {
    fixture.detectChanges();

    const textElement = fixture.nativeElement.querySelector('.testimonial-card__text');
    expect(textElement.textContent.trim()).toBe('This is a great product! I love it.');
  });

  it('should have testimonial data assigned', () => {
    fixture.detectChanges();

    expect(component.testimonial.rating).toBe(5);
    expect(component.testimonial.customerName).toBe('John Doe');
  });
});
