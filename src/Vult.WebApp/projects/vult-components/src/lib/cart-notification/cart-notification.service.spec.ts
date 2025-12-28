import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CartNotificationService } from './cart-notification.service';
import { CartNotification, CartNotificationData } from './cart-notification';
import { Subject } from 'rxjs';

describe('CartNotificationService', () => {
  let service: CartNotificationService;
  let mockDialog: jest.Mocked<MatDialog>;
  let mockDialogRef: jest.Mocked<MatDialogRef<CartNotification>>;
  let afterClosedSubject: Subject<any>;

  const mockData: CartNotificationData = {
    productName: 'Test Product',
    productImage: '/product.jpg',
    colorName: 'Black',
    size: 'US 10',
    price: 129.99,
    cartItemCount: 3,
    cartTotal: 389.97
  };

  beforeEach(() => {
    afterClosedSubject = new Subject();
    mockDialogRef = {
      close: jest.fn(),
      afterClosed: jest.fn().mockReturnValue(afterClosedSubject.asObservable())
    } as unknown as jest.Mocked<MatDialogRef<CartNotification>>;

    mockDialog = {
      open: jest.fn().mockReturnValue(mockDialogRef)
    } as unknown as jest.Mocked<MatDialog>;

    TestBed.configureTestingModule({
      providers: [
        CartNotificationService,
        { provide: MatDialog, useValue: mockDialog }
      ]
    });

    service = TestBed.inject(CartNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open dialog with correct configuration', () => {
    service.open(mockData);

    expect(mockDialog.open).toHaveBeenCalledWith(
      CartNotification,
      expect.objectContaining({
        data: expect.objectContaining({
          productName: 'Test Product',
          variant: 'corner'
        }),
        hasBackdrop: false,
        autoFocus: false,
        restoreFocus: false
      })
    );
  });

  it('should open dialog with dropdown variant', () => {
    service.open(mockData, { position: 'dropdown' });

    expect(mockDialog.open).toHaveBeenCalledWith(
      CartNotification,
      expect.objectContaining({
        data: expect.objectContaining({
          variant: 'dropdown'
        }),
        hasBackdrop: true
      })
    );
  });

  it('should close existing dialog before opening new one', () => {
    // Open first dialog
    const ref1 = service.open(mockData);
    expect(mockDialog.open).toHaveBeenCalledTimes(1);

    // Simulate the first dialog being active
    // Open second dialog - should close first
    service.open(mockData);
    expect(mockDialogRef.close).toHaveBeenCalledWith('close');
  });

  it('should close active dialog', () => {
    service.open(mockData);
    service.close();

    expect(mockDialogRef.close).toHaveBeenCalledWith('close');
  });

  it('should handle close when no dialog is open', () => {
    // Should not throw
    expect(() => service.close()).not.toThrow();
  });

  it('should return afterClosed observable', () => {
    service.open(mockData);
    const result = service.afterClosed();

    expect(result).not.toBeNull();
  });

  it('should return null for afterClosed when no dialog', () => {
    const result = service.afterClosed();
    expect(result).toBeNull();
  });

  it('should get correct panel classes for corner variant', () => {
    service.open(mockData, { position: 'top-right' });

    expect(mockDialog.open).toHaveBeenCalledWith(
      CartNotification,
      expect.objectContaining({
        panelClass: expect.arrayContaining([
          'cart-notification-panel',
          'cart-notification-panel--corner',
          'cart-notification-panel--top-right'
        ])
      })
    );
  });

  it('should get correct panel classes for top-center position', () => {
    service.open(mockData, { position: 'top-center' });

    expect(mockDialog.open).toHaveBeenCalledWith(
      CartNotification,
      expect.objectContaining({
        panelClass: expect.arrayContaining([
          'cart-notification-panel--top-center'
        ])
      })
    );
  });

  it('should get correct dialog position for top-right', () => {
    service.open(mockData, { position: 'top-right' });

    expect(mockDialog.open).toHaveBeenCalledWith(
      CartNotification,
      expect.objectContaining({
        position: { top: '80px', right: '20px' }
      })
    );
  });

  it('should get correct dialog position for top-center', () => {
    service.open(mockData, { position: 'top-center' });

    expect(mockDialog.open).toHaveBeenCalledWith(
      CartNotification,
      expect.objectContaining({
        position: { top: '80px' }
      })
    );
  });

  it('should get correct dialog position for dropdown', () => {
    service.open(mockData, { position: 'dropdown' });

    expect(mockDialog.open).toHaveBeenCalledWith(
      CartNotification,
      expect.objectContaining({
        position: { top: '60px', right: '0' }
      })
    );
  });

  it('should clear active dialog ref after close', () => {
    service.open(mockData);
    afterClosedSubject.next('close');
    afterClosedSubject.complete();

    // After close, afterClosed should return null
    expect(service.afterClosed()).toBeNull();
  });
});
