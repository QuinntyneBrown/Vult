import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroSection, HeroSize, HeroTextPosition, HeroTheme } from './hero-section';

describe('HeroSection', () => {
  let component: HeroSection;
  let fixture: ComponentFixture<HeroSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSection]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSection);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.backgroundImage).toBe('');
    expect(component.videoUrl).toBe('');
    expect(component.imageAlt).toBe('');
    expect(component.overline).toBe('');
    expect(component.title).toBe('');
    expect(component.subtitle).toBe('');
    expect(component.primaryCtaText).toBe('');
    expect(component.secondaryCtaText).toBe('');
    expect(component.size).toBe('large');
    expect(component.textPosition).toBe('left');
    expect(component.theme).toBe('dark');
  });

  it('should apply small size class', () => {
    component.size = 'small';
    fixture.detectChanges();
    const heroElement = fixture.nativeElement.querySelector('.hero');
    expect(heroElement.classList.contains('hero--small')).toBeTruthy();
  });

  it('should apply medium size class', () => {
    component.size = 'medium';
    fixture.detectChanges();
    const heroElement = fixture.nativeElement.querySelector('.hero');
    expect(heroElement.classList.contains('hero--medium')).toBeTruthy();
  });

  it('should apply large size class', () => {
    component.size = 'large';
    fixture.detectChanges();
    const heroElement = fixture.nativeElement.querySelector('.hero');
    expect(heroElement.classList.contains('hero--large')).toBeTruthy();
  });

  it('should apply full size class', () => {
    component.size = 'full';
    fixture.detectChanges();
    const heroElement = fixture.nativeElement.querySelector('.hero');
    expect(heroElement.classList.contains('hero--full')).toBeTruthy();
  });

  it('should apply light theme class', () => {
    component.theme = 'light';
    fixture.detectChanges();
    const heroElement = fixture.nativeElement.querySelector('.hero');
    expect(heroElement.classList.contains('hero--light')).toBeTruthy();
  });

  it('should apply dark theme class', () => {
    component.theme = 'dark';
    fixture.detectChanges();
    const heroElement = fixture.nativeElement.querySelector('.hero');
    expect(heroElement.classList.contains('hero--dark')).toBeTruthy();
  });

  it('should apply left text position class', () => {
    component.textPosition = 'left';
    fixture.detectChanges();
    const contentElement = fixture.nativeElement.querySelector('.hero__content');
    expect(contentElement.classList.contains('hero__content--left')).toBeTruthy();
  });

  it('should apply center text position class', () => {
    component.textPosition = 'center';
    fixture.detectChanges();
    const contentElement = fixture.nativeElement.querySelector('.hero__content');
    expect(contentElement.classList.contains('hero__content--center')).toBeTruthy();
  });

  it('should apply right text position class', () => {
    component.textPosition = 'right';
    fixture.detectChanges();
    const contentElement = fixture.nativeElement.querySelector('.hero__content');
    expect(contentElement.classList.contains('hero__content--right')).toBeTruthy();
  });

  it('should render background image when provided', () => {
    component.backgroundImage = '/test-image.jpg';
    component.imageAlt = 'Test image';
    fixture.detectChanges();

    const imageElement = fixture.nativeElement.querySelector('.hero__image');
    expect(imageElement).toBeTruthy();
    expect(imageElement.getAttribute('src')).toBe('/test-image.jpg');
    expect(imageElement.getAttribute('alt')).toBe('Test image');
  });

  it('should render video when videoUrl is provided', () => {
    component.videoUrl = '/test-video.mp4';
    fixture.detectChanges();

    const videoElement = fixture.nativeElement.querySelector('.hero__video');
    expect(videoElement).toBeTruthy();
    expect(videoElement.getAttribute('src')).toBe('/test-video.mp4');
  });

  it('should render overline when provided', () => {
    component.overline = 'New Collection';
    fixture.detectChanges();

    const overlineElement = fixture.nativeElement.querySelector('.hero__overline');
    expect(overlineElement).toBeTruthy();
    expect(overlineElement.textContent.trim()).toBe('New Collection');
  });

  it('should render title when provided', () => {
    component.title = 'Main Title';
    fixture.detectChanges();

    const titleElement = fixture.nativeElement.querySelector('.hero__title');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent.trim()).toBe('Main Title');
  });

  it('should render subtitle when provided', () => {
    component.subtitle = 'Subtitle text';
    fixture.detectChanges();

    const subtitleElement = fixture.nativeElement.querySelector('.hero__subtitle');
    expect(subtitleElement).toBeTruthy();
    expect(subtitleElement.textContent.trim()).toBe('Subtitle text');
  });

  it('should render primary CTA when text is provided', () => {
    component.primaryCtaText = 'Shop Now';
    fixture.detectChanges();

    const primaryCta = fixture.nativeElement.querySelector('.hero__cta--primary');
    expect(primaryCta).toBeTruthy();
    expect(primaryCta.textContent.trim()).toBe('Shop Now');
  });

  it('should render secondary CTA when text is provided', () => {
    component.secondaryCtaText = 'Learn More';
    fixture.detectChanges();

    const secondaryCta = fixture.nativeElement.querySelector('.hero__cta--secondary');
    expect(secondaryCta).toBeTruthy();
    expect(secondaryCta.textContent.trim()).toBe('Learn More');
  });

  it('should emit primaryCtaClick when primary CTA is clicked', () => {
    component.primaryCtaText = 'Shop Now';
    const emitSpy = jest.spyOn(component.primaryCtaClick, 'emit');
    fixture.detectChanges();

    const primaryCta = fixture.nativeElement.querySelector('.hero__cta--primary');
    primaryCta.click();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit secondaryCtaClick when secondary CTA is clicked', () => {
    component.secondaryCtaText = 'Learn More';
    const emitSpy = jest.spyOn(component.secondaryCtaClick, 'emit');
    fixture.detectChanges();

    const secondaryCta = fixture.nativeElement.querySelector('.hero__cta--secondary');
    secondaryCta.click();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should apply custom overlay gradient', () => {
    component.overlayGradient = 'linear-gradient(to bottom, red, blue)';
    fixture.detectChanges();

    const overlayElement = fixture.nativeElement.querySelector('.hero__overlay');
    expect(overlayElement.style.background).toBe('linear-gradient(to bottom, red, blue)');
  });
});
