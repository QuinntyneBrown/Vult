import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartItem, CartItemData } from './cart-item';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CartItem', () => {
  let component: CartItem;
  let fixture: ComponentFixture<CartItem>;

  const mockCartItem: CartItemData = {
    cartItemId: 'cart-1',
    productId: 'prod-1',
    name: 'Test Product',
    subtitle: "Men's Running Shoes",
    imageUrl: '/product.jpg',
    color: 'Black/White',
    size: 'US 10',
    price: 129.99,
    originalPrice: 159.99,
    quantity: 2,
    maxQuantity: 10,
    isLowStock: false
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartItem, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CartItem);
    component = fixture.componentInstance;
    component.item = mockCartItem;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.showFavoritesButton).toBeTruthy();
    expect(component.testId).toBe('cart-item');
  });

  it('should emit quantityChange when quantity changes', () => {
    const emitSpy = jest.spyOn(component.quantityChange, 'emit');
    fixture.detectChanges();

    component.onQuantityChange(3);

    expect(emitSpy).toHaveBeenCalledWith({ cartItemId: 'cart-1', quantity: 3 });
  });

  it('should emit remove when remove is called', () => {
    const emitSpy = jest.spyOn(component.remove, 'emit');
    fixture.detectChanges();

    component.onRemove();

    expect(emitSpy).toHaveBeenCalledWith('cart-1');
  });

  it('should emit moveToFavorites when moveToFavorites is called', () => {
    const emitSpy = jest.spyOn(component.moveToFavorites, 'emit');
    fixture.detectChanges();

    component.onMoveToFavorites();

    expect(emitSpy).toHaveBeenCalledWith('cart-1');
  });

  it('should emit productClick when product is clicked', () => {
    const emitSpy = jest.spyOn(component.productClick, 'emit');
    fixture.detectChanges();

    const event = new MouseEvent('click');
    component.onProductClick(event);

    expect(emitSpy).toHaveBeenCalledWith('prod-1');
  });

  it('should prevent default on product click', () => {
    fixture.detectChanges();

    const event = new MouseEvent('click');
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

    component.onProductClick(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});
