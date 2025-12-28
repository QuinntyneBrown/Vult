import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductInfoSection, ProductPrice } from './product-info-section';

describe('ProductInfoSection', () => {
  let component: ProductInfoSection;
  let fixture: ComponentFixture<ProductInfoSection>;

  const mockPrice: ProductPrice = {
    current: 99,
    original: 129,
    currency: 'USD',
    currencySymbol: '$',
    salePercentage: 23
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductInfoSection]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductInfoSection);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.title).toBe('');
    expect(component.subtitle).toBe('');
    expect(component.colorName).toBe('');
    expect(component.promotionalMessage).toBe('');
    expect(component.isMemberExclusive).toBeFalsy();
  });

  it('should render title', () => {
    component.title = 'Product Name';
    fixture.detectChanges();

    const titleElement = fixture.nativeElement.querySelector('.product-info__title');
    expect(titleElement.textContent.trim()).toBe('Product Name');
  });

  it('should render subtitle when provided', () => {
    component.subtitle = "Men's Shoes";
    fixture.detectChanges();

    const subtitleElement = fixture.nativeElement.querySelector('.product-info__subtitle');
    expect(subtitleElement.textContent.trim()).toBe("Men's Shoes");
  });

  it('should not render subtitle when not provided', () => {
    fixture.detectChanges();

    const subtitleElement = fixture.nativeElement.querySelector('.product-info__subtitle');
    expect(subtitleElement).toBeFalsy();
  });

  it('should render color name when provided', () => {
    component.colorName = 'Black/White';
    fixture.detectChanges();

    const colorElement = fixture.nativeElement.querySelector('.product-info__color');
    expect(colorElement.textContent.trim()).toBe('Black/White');
  });

  it('should render current price', () => {
    component.price = mockPrice;
    fixture.detectChanges();

    const priceElement = fixture.nativeElement.querySelector('.product-info__price');
    expect(priceElement.textContent).toContain('$99');
  });

  it('should render original price when on sale', () => {
    component.price = mockPrice;
    fixture.detectChanges();

    const originalPriceElement = fixture.nativeElement.querySelector('.product-info__price--original');
    expect(originalPriceElement).toBeTruthy();
    expect(originalPriceElement.textContent).toContain('$129');
  });

  it('should not render original price when not on sale', () => {
    component.price = { current: 99, currency: 'USD', currencySymbol: '$' };
    fixture.detectChanges();

    const originalPriceElement = fixture.nativeElement.querySelector('.product-info__price--original');
    expect(originalPriceElement).toBeFalsy();
  });

  it('should render sale badge when on sale', () => {
    component.price = mockPrice;
    fixture.detectChanges();

    const saleBadge = fixture.nativeElement.querySelector('.product-info__sale-badge');
    expect(saleBadge).toBeTruthy();
    expect(saleBadge.textContent.trim()).toBe('23% off');
  });

  it('should render member exclusive badge when isMemberExclusive is true', () => {
    component.isMemberExclusive = true;
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.product-info__badge');
    expect(badge).toBeTruthy();
    expect(badge.textContent.trim()).toBe('Exclusive Access');
  });

  it('should not render member exclusive badge when isMemberExclusive is false', () => {
    component.isMemberExclusive = false;
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.product-info__badge');
    expect(badge).toBeFalsy();
  });

  it('should render promotional message when provided', () => {
    component.promotionalMessage = 'Free shipping on this item';
    fixture.detectChanges();

    const promoElement = fixture.nativeElement.querySelector('.product-info__promo');
    expect(promoElement).toBeTruthy();
    expect(promoElement.textContent.trim()).toBe('Free shipping on this item');
  });

  it('should not render promotional message when not provided', () => {
    fixture.detectChanges();

    const promoElement = fixture.nativeElement.querySelector('.product-info__promo');
    expect(promoElement).toBeFalsy();
  });
});
