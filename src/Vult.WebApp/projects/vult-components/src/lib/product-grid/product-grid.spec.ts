import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductGrid } from './product-grid';
import { ProductCardData } from '../product-card/product-card';

describe('ProductGrid', () => {
  let component: ProductGrid;
  let fixture: ComponentFixture<ProductGrid>;

  const mockProducts: ProductCardData[] = [
    {
      id: '1',
      name: 'Product 1',
      price: 99.99,
      imageUrl: '/image1.jpg'
    },
    {
      id: '2',
      name: 'Product 2',
      price: 149.99,
      imageUrl: '/image2.jpg'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductGrid]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductGrid);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.products).toEqual([]);
    expect(component.loading).toBeFalsy();
    expect(component.singleColumn).toBeFalsy();
    expect(component.skeletonItems).toBe(8);
    expect(component.emptyTitle).toBe('No products found');
    expect(component.emptyMessage).toBe('Try adjusting your filters or search criteria.');
    expect(component.emptyActionText).toBe('');
    expect(component.emptyActionUrl).toBe('/');
  });

  it('should render product cards when products are provided', () => {
    component.products = mockProducts;
    fixture.detectChanges();

    const productCards = fixture.nativeElement.querySelectorAll('v-product-card');
    expect(productCards.length).toBe(2);
  });

  it('should render skeleton items when loading', () => {
    component.loading = true;
    component.skeletonItems = 4;
    fixture.detectChanges();

    const skeletons = fixture.nativeElement.querySelectorAll('.product-card-skeleton');
    expect(skeletons.length).toBe(4);
  });

  it('should render empty state when no products and not loading', () => {
    component.products = [];
    component.loading = false;
    fixture.detectChanges();

    const emptyState = fixture.nativeElement.querySelector('.product-grid__empty');
    expect(emptyState).toBeTruthy();
  });

  it('should render empty title', () => {
    component.products = [];
    component.emptyTitle = 'No results';
    fixture.detectChanges();

    const emptyTitle = fixture.nativeElement.querySelector('.product-grid__empty-title');
    expect(emptyTitle.textContent.trim()).toBe('No results');
  });

  it('should render empty message', () => {
    component.products = [];
    component.emptyMessage = 'Custom message';
    fixture.detectChanges();

    const emptyMessage = fixture.nativeElement.querySelector('.product-grid__empty-message');
    expect(emptyMessage.textContent.trim()).toBe('Custom message');
  });

  it('should render empty action when emptyActionText is provided', () => {
    component.products = [];
    component.emptyActionText = 'Browse All';
    component.emptyActionUrl = '/all';
    fixture.detectChanges();

    const emptyAction = fixture.nativeElement.querySelector('.product-grid__empty-action');
    expect(emptyAction).toBeTruthy();
    expect(emptyAction.textContent.trim()).toBe('Browse All');
    expect(emptyAction.getAttribute('href')).toBe('/all');
  });

  it('should apply single-column class when singleColumn is true', () => {
    component.singleColumn = true;
    fixture.detectChanges();

    const grid = fixture.nativeElement.querySelector('.product-grid');
    expect(grid.classList.contains('product-grid--single-column')).toBeTruthy();
  });

  it('should apply loading class when loading', () => {
    component.loading = true;
    fixture.detectChanges();

    const grid = fixture.nativeElement.querySelector('.product-grid');
    expect(grid.classList.contains('product-grid--loading')).toBeTruthy();
  });

  it('should emit productClick when product card is clicked', () => {
    component.products = mockProducts;
    const emitSpy = jest.spyOn(component.productClick, 'emit');
    fixture.detectChanges();

    component.onProductClick(mockProducts[0]);

    expect(emitSpy).toHaveBeenCalledWith(mockProducts[0]);
  });

  it('should emit favoriteToggle when favorite is toggled', () => {
    component.products = mockProducts;
    const emitSpy = jest.spyOn(component.favoriteToggle, 'emit');
    fixture.detectChanges();

    const event = { product: mockProducts[0], isFavorite: true };
    component.onFavoriteToggle(event);

    expect(emitSpy).toHaveBeenCalledWith(event);
  });

  it('should return correct skeleton count array', () => {
    component.skeletonItems = 6;
    expect(component.skeletonCount.length).toBe(6);
  });
});
