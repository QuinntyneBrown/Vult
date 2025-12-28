import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { CartNotification, CartNotificationData, CartNotificationItem } from './cart-notification';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CartNotification', () => {
  let component: CartNotification;
  let fixture: ComponentFixture<CartNotification>;
  let mockDialogRef: jest.Mocked<MatDialogRef<CartNotification>>;

  const mockItem: CartNotificationItem = {
    name: 'Test Product',
    subtitle: 'Running Shoes',
    imageUrl: '/product.jpg',
    color: 'Black',
    size: 'US 10',
    price: 129.99
  };

  const mockData: CartNotificationData = {
    item: mockItem,
    itemCount: 1,
    variant: 'corner',
    autoDismiss: false
  };

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn()
    } as unknown as jest.Mocked<MatDialogRef<CartNotification>>;

    await TestBed.configureTestingModule({
      imports: [CartNotification, NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialogRef, useValue: mockDialogRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartNotification);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have correct data', () => {
    fixture.detectChanges();
    expect(component.item).toEqual(mockItem);
    expect(component.itemCount).toBe(1);
    expect(component.variant).toBe('corner');
  });

  it('should close dialog on close', () => {
    fixture.detectChanges();

    component.onClose();

    expect(mockDialogRef.close).toHaveBeenCalledWith('close');
  });

  it('should close dialog on view bag', () => {
    fixture.detectChanges();

    const event = new MouseEvent('click');
    component.onViewBag(event);

    expect(mockDialogRef.close).toHaveBeenCalledWith('viewBag');
  });

  it('should close dialog on checkout', () => {
    fixture.detectChanges();

    const event = new MouseEvent('click');
    component.onCheckout(event);

    expect(mockDialogRef.close).toHaveBeenCalledWith('checkout');
  });

  it('should have default values', () => {
    fixture.detectChanges();
    expect(component.cartUrl).toBe('/cart');
    expect(component.checkoutUrl).toBe('/checkout');
  });
});

describe('CartNotification with auto dismiss', () => {
  let component: CartNotification;
  let fixture: ComponentFixture<CartNotification>;
  let mockDialogRef: jest.Mocked<MatDialogRef<CartNotification>>;

  const mockData: CartNotificationData = {
    item: {
      name: 'Test',
      subtitle: 'Test',
      imageUrl: '/test.jpg',
      color: 'Black',
      size: 'M',
      price: 100
    },
    variant: 'corner',
    autoDismiss: true,
    autoDismissDelay: 100
  };

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn()
    } as unknown as jest.Mocked<MatDialogRef<CartNotification>>;

    await TestBed.configureTestingModule({
      imports: [CartNotification, NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialogRef, useValue: mockDialogRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartNotification);
    component = fixture.componentInstance;
  });

  it('should auto dismiss after delay', () => {
    jest.useFakeTimers();
    fixture.detectChanges();

    // Fast-forward past the autoDismissDelay (100ms)
    jest.advanceTimersByTime(100);

    expect(mockDialogRef.close).toHaveBeenCalledWith('close');
    jest.useRealTimers();
  });

  it('should clear timer on destroy', () => {
    jest.useFakeTimers();
    fixture.detectChanges();

    component.ngOnDestroy();
    jest.advanceTimersByTime(150);

    // Timer was cleared, so close should not have been called
    expect(mockDialogRef.close).not.toHaveBeenCalled();
    jest.useRealTimers();
  });
});
