import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCard, ProductCardData } from './product-card';

describe('ProductCard', () => {
  let component: ProductCard;
  let fixture: ComponentFixture<ProductCard>;

  const mockProduct: ProductCardData = {
    id: '1',
    name: 'Test Product',
    category: 'Test Category',
    colorCount: 3,
    price: 99.99,
    originalPrice: 129.99,
    imageUrl: '/test-image.jpg',
    hoverImageUrl: '/test-hover-image.jpg',
    badge: 'Sale',
    badgeType: 'sale',
    soldOut: false,
    isFavorite: false
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    component = fixture.componentInstance;
    component.product = mockProduct;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render product name', () => {
    fixture.detectChanges();

    const nameElement = fixture.nativeElement.querySelector('.product-name');
    expect(nameElement.textContent.trim()).toBe('Test Product');
  });

  it('should render product category', () => {
    fixture.detectChanges();

    const categoryElement = fixture.nativeElement.querySelector('.product-category');
    expect(categoryElement.textContent.trim()).toBe('Test Category');
  });

  it('should render color count when more than 1', () => {
    fixture.detectChanges();

    const colorsElement = fixture.nativeElement.querySelector('.product-colors');
    expect(colorsElement.textContent.trim()).toBe('3 Colors');
  });

  it('should not render color count when 1 or less', () => {
    component.product = { ...mockProduct, colorCount: 1 };
    fixture.detectChanges();

    const colorsElement = fixture.nativeElement.querySelector('.product-colors');
    expect(colorsElement).toBeFalsy();
  });

  it('should render product price', () => {
    fixture.detectChanges();

    const priceElement = fixture.nativeElement.querySelector('.product-price');
    expect(priceElement).toBeTruthy();
  });

  it('should render original price when provided', () => {
    fixture.detectChanges();

    const originalPriceElement = fixture.nativeElement.querySelector('.original-price');
    expect(originalPriceElement).toBeTruthy();
  });

  it('should render product image', () => {
    fixture.detectChanges();

    const imageElement = fixture.nativeElement.querySelector('.card-image');
    expect(imageElement.getAttribute('src')).toBe('/test-image.jpg');
    expect(imageElement.getAttribute('alt')).toBe('Test Product');
  });

  it('should render hover image when provided', () => {
    fixture.detectChanges();

    const hoverImageElement = fixture.nativeElement.querySelector('.card-image-hover');
    expect(hoverImageElement).toBeTruthy();
    expect(hoverImageElement.getAttribute('src')).toBe('/test-hover-image.jpg');
  });

  it('should render badge when provided', () => {
    fixture.detectChanges();

    const badgeElement = fixture.nativeElement.querySelector('.card-badge');
    expect(badgeElement).toBeTruthy();
    expect(badgeElement.textContent.trim()).toBe('Sale');
  });

  it('should apply sale class to badge', () => {
    fixture.detectChanges();

    const badgeElement = fixture.nativeElement.querySelector('.card-badge');
    expect(badgeElement.classList.contains('sale')).toBeTruthy();
  });

  it('should render sold out overlay when product is sold out', () => {
    component.product = { ...mockProduct, soldOut: true };
    fixture.detectChanges();

    const soldOutOverlay = fixture.nativeElement.querySelector('.sold-out-overlay');
    expect(soldOutOverlay).toBeTruthy();
  });

  it('should apply sold-out class to card when product is sold out', () => {
    component.product = { ...mockProduct, soldOut: true };
    fixture.detectChanges();

    const cardElement = fixture.nativeElement.querySelector('.product-card');
    expect(cardElement.classList.contains('product-card--sold-out')).toBeTruthy();
  });

  it('should emit cardClick when card is clicked and not sold out', () => {
    const emitSpy = jest.spyOn(component.cardClick, 'emit');
    fixture.detectChanges();

    const event = new MouseEvent('click');
    component.onCardClick(event);

    expect(emitSpy).toHaveBeenCalledWith(mockProduct);
  });

  it('should not emit cardClick when product is sold out', () => {
    component.product = { ...mockProduct, soldOut: true };
    const emitSpy = jest.spyOn(component.cardClick, 'emit');
    fixture.detectChanges();

    const event = new MouseEvent('click');
    component.onCardClick(event);

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should toggle favorite on button click', () => {
    fixture.detectChanges();

    expect(component.isFavorite()).toBeFalsy();

    const event = new MouseEvent('click');
    component.toggleFavorite(event);

    expect(component.isFavorite()).toBeTruthy();
  });

  it('should emit favoriteToggle with correct data', () => {
    const emitSpy = jest.spyOn(component.favoriteToggle, 'emit');
    fixture.detectChanges();

    const event = new MouseEvent('click');
    component.toggleFavorite(event);

    expect(emitSpy).toHaveBeenCalledWith({
      product: mockProduct,
      isFavorite: true
    });
  });

  it('should stop propagation on favorite toggle', () => {
    fixture.detectChanges();

    const event = new MouseEvent('click');
    const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');

    component.toggleFavorite(event);

    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it('should initialize isFavorite from product data', () => {
    component.product = { ...mockProduct, isFavorite: true };
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.isFavorite()).toBeTruthy();
  });

  it('should render favorite button with correct aria-label', () => {
    fixture.detectChanges();

    const favButton = fixture.nativeElement.querySelector('.favorite-btn');
    expect(favButton.getAttribute('aria-label')).toBe('Add to favorites');

    component.isFavorite.set(true);
    fixture.detectChanges();
    expect(favButton.getAttribute('aria-label')).toBe('Remove from favorites');
  });
});
