import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarouselSlider, CarouselSlide } from './carousel-slider';

describe('CarouselSlider', () => {
  let component: CarouselSlider;
  let fixture: ComponentFixture<CarouselSlider>;

  const mockSlides: CarouselSlide[] = [
    { id: 1, imageUrl: '/slide1.jpg', altText: 'Slide 1', title: 'Title 1', subtitle: 'Subtitle 1', ctaText: 'Shop Now', ctaUrl: '/shop' },
    { id: 2, imageUrl: '/slide2.jpg', altText: 'Slide 2', title: 'Title 2' },
    { id: 3, imageUrl: '/slide3.jpg', altText: 'Slide 3' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselSlider]
    }).compileComponents();

    fixture = TestBed.createComponent(CarouselSlider);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.slides).toEqual([]);
    expect(component.autoPlay).toBeFalsy();
    expect(component.autoPlayInterval).toBe(5000);
    expect(component.loop).toBeTruthy();
    expect(component.showArrows).toBeTruthy();
    expect(component.showDots).toBeTruthy();
    expect(component.currentIndex()).toBe(0);
  });

  it('should render slides', () => {
    component.slides = mockSlides;
    fixture.detectChanges();

    const slides = fixture.nativeElement.querySelectorAll('.carousel__slide');
    expect(slides.length).toBe(3);
  });

  it('should render slide images', () => {
    component.slides = mockSlides;
    fixture.detectChanges();

    const images = fixture.nativeElement.querySelectorAll('.carousel__image');
    expect(images[0].getAttribute('src')).toBe('/slide1.jpg');
    expect(images[0].getAttribute('alt')).toBe('Slide 1');
  });

  it('should render slide content when title or subtitle is provided', () => {
    component.slides = mockSlides;
    fixture.detectChanges();

    const content = fixture.nativeElement.querySelectorAll('.carousel__content');
    expect(content.length).toBe(2); // Only first two slides have title/subtitle
  });

  it('should render CTA link when ctaText is provided', () => {
    component.slides = mockSlides;
    fixture.detectChanges();

    const cta = fixture.nativeElement.querySelector('.carousel__cta');
    expect(cta).toBeTruthy();
    expect(cta.textContent.trim()).toBe('Shop Now');
    expect(cta.getAttribute('href')).toBe('/shop');
  });

  it('should show arrows when showArrows is true and multiple slides', () => {
    component.slides = mockSlides;
    component.showArrows = true;
    fixture.detectChanges();

    const arrows = fixture.nativeElement.querySelectorAll('.carousel__arrow');
    expect(arrows.length).toBe(2);
  });

  it('should hide arrows when showArrows is false', () => {
    component.slides = mockSlides;
    component.showArrows = false;
    fixture.detectChanges();

    const arrows = fixture.nativeElement.querySelectorAll('.carousel__arrow');
    expect(arrows.length).toBe(0);
  });

  it('should show dots when showDots is true and multiple slides', () => {
    component.slides = mockSlides;
    component.showDots = true;
    fixture.detectChanges();

    const dots = fixture.nativeElement.querySelectorAll('.carousel__dot');
    expect(dots.length).toBe(3);
  });

  it('should hide dots when showDots is false', () => {
    component.slides = mockSlides;
    component.showDots = false;
    fixture.detectChanges();

    const dots = fixture.nativeElement.querySelectorAll('.carousel__dots');
    expect(dots.length).toBe(0);
  });

  it('should go to next slide', () => {
    component.slides = mockSlides;
    fixture.detectChanges();

    expect(component.currentIndex()).toBe(0);
    component.next();
    expect(component.currentIndex()).toBe(1);
  });

  it('should go to previous slide', () => {
    component.slides = mockSlides;
    component.currentIndex.set(2);
    fixture.detectChanges();

    component.prev();
    expect(component.currentIndex()).toBe(1);
  });

  it('should loop to first slide from last when loop is true', () => {
    component.slides = mockSlides;
    component.loop = true;
    component.currentIndex.set(2);
    fixture.detectChanges();

    component.next();
    expect(component.currentIndex()).toBe(0);
  });

  it('should loop to last slide from first when loop is true', () => {
    component.slides = mockSlides;
    component.loop = true;
    component.currentIndex.set(0);
    fixture.detectChanges();

    component.prev();
    expect(component.currentIndex()).toBe(2);
  });

  it('should not loop when loop is false', () => {
    component.slides = mockSlides;
    component.loop = false;
    component.currentIndex.set(2);
    fixture.detectChanges();

    component.next();
    expect(component.currentIndex()).toBe(2);
  });

  it('should go to specific slide', () => {
    component.slides = mockSlides;
    fixture.detectChanges();

    component.goTo(2);
    expect(component.currentIndex()).toBe(2);
  });

  it('should not go to invalid index', () => {
    component.slides = mockSlides;
    fixture.detectChanges();

    component.goTo(-1);
    expect(component.currentIndex()).toBe(0);

    component.goTo(10);
    expect(component.currentIndex()).toBe(0);
  });

  it('should emit slideChange when navigating', () => {
    component.slides = mockSlides;
    const emitSpy = jest.spyOn(component.slideChange, 'emit');
    fixture.detectChanges();

    component.next();
    expect(emitSpy).toHaveBeenCalledWith(1);
  });

  it('should disable prev button on first slide when not looping', () => {
    component.slides = mockSlides;
    component.loop = false;
    component.currentIndex.set(0);
    fixture.detectChanges();

    const prevButton = fixture.nativeElement.querySelector('.carousel__arrow--prev');
    expect(prevButton.disabled).toBeTruthy();
  });

  it('should disable next button on last slide when not looping', () => {
    component.slides = mockSlides;
    component.loop = false;
    component.currentIndex.set(2);
    fixture.detectChanges();

    const nextButton = fixture.nativeElement.querySelector('.carousel__arrow--next');
    expect(nextButton.disabled).toBeTruthy();
  });

  it('should mark current dot as active', () => {
    component.slides = mockSlides;
    component.currentIndex.set(1);
    fixture.detectChanges();

    const dots = fixture.nativeElement.querySelectorAll('.carousel__dot');
    expect(dots[1].classList.contains('carousel__dot--active')).toBeTruthy();
  });

  it('should calculate correct track transform', () => {
    component.slides = mockSlides;
    component.currentIndex.set(1);
    fixture.detectChanges();

    expect(component.trackTransform()).toBe('translateX(-100%)');
  });
});
