import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationBar, NavItem } from './navigation-bar';

describe('NavigationBar', () => {
  let component: NavigationBar;
  let fixture: ComponentFixture<NavigationBar>;

  const mockNavItems: NavItem[] = [
    { id: '1', label: 'Home', href: '/' },
    { id: '2', label: 'Products', href: '/products', children: [
      { id: '2-1', label: 'Category 1', href: '/products/cat1' },
      { id: '2-2', label: 'Category 2', href: '/products/cat2' }
    ]},
    { id: '3', label: 'About', href: '/about' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationBar]
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationBar);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.items).toEqual([]);
    expect(component.logoHref).toBe('/');
    expect(component.activeItemId).toBe('');
    expect(component.ariaLabel).toBe('Main navigation');
  });

  it('should render navigation items', () => {
    component.items = mockNavItems;
    fixture.detectChanges();

    const navLinks = fixture.nativeElement.querySelectorAll('.nav__link');
    expect(navLinks.length).toBe(3);
  });

  it('should apply active class to active item', () => {
    component.items = mockNavItems;
    component.activeItemId = '1';
    fixture.detectChanges();

    const activeItem = fixture.nativeElement.querySelector('.nav__item--active');
    expect(activeItem).toBeTruthy();
  });

  it('should emit logoClick on logo click', () => {
    const emitSpy = jest.spyOn(component.logoClick, 'emit');
    fixture.detectChanges();

    const event = new MouseEvent('click');
    component.onLogoClick(event);

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit itemClick on item click', () => {
    component.items = mockNavItems;
    const emitSpy = jest.spyOn(component.itemClick, 'emit');
    fixture.detectChanges();

    const event = new MouseEvent('click');
    component.onItemClick(event, mockNavItems[0]);

    expect(emitSpy).toHaveBeenCalledWith(mockNavItems[0]);
  });

  it('should set hoveredItemId on item hover when item has children', () => {
    component.items = mockNavItems;
    fixture.detectChanges();

    component.onItemHover(mockNavItems[1]); // Item with children

    expect(component.hoveredItemId()).toBe('2');
  });

  it('should not set hoveredItemId when item has no children', () => {
    component.items = mockNavItems;
    fixture.detectChanges();

    component.onItemHover(mockNavItems[0]); // Item without children

    expect(component.hoveredItemId()).toBeNull();
  });

  it('should clear hoveredItemId on item leave', () => {
    component.hoveredItemId.set('2');
    fixture.detectChanges();

    component.onItemLeave();

    expect(component.hoveredItemId()).toBeNull();
  });

  it('should toggle mobile menu', () => {
    fixture.detectChanges();

    expect(component.mobileMenuOpen()).toBeFalsy();

    component.toggleMobileMenu();
    expect(component.mobileMenuOpen()).toBeTruthy();

    component.toggleMobileMenu();
    expect(component.mobileMenuOpen()).toBeFalsy();
  });

  it('should handle mobile item click - prevent default for items with children', () => {
    component.items = mockNavItems;
    fixture.detectChanges();

    const event = new MouseEvent('click');
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

    component.onMobileItemClick(event, mockNavItems[1]); // Item with children

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should close mobile menu and emit itemClick for items without children', () => {
    component.items = mockNavItems;
    component.mobileMenuOpen.set(true);
    const emitSpy = jest.spyOn(component.itemClick, 'emit');
    fixture.detectChanges();

    const event = new MouseEvent('click');
    component.onMobileItemClick(event, mockNavItems[0]); // Item without children

    expect(component.mobileMenuOpen()).toBeFalsy();
    expect(emitSpy).toHaveBeenCalledWith(mockNavItems[0]);
  });

  it('should show dropdown when item is hovered and has children', () => {
    component.items = mockNavItems;
    component.hoveredItemId.set('2');
    fixture.detectChanges();

    const dropdown = fixture.nativeElement.querySelector('.nav__dropdown');
    expect(dropdown).toBeTruthy();
  });

  it('should render dropdown items', () => {
    component.items = mockNavItems;
    component.hoveredItemId.set('2');
    fixture.detectChanges();

    const dropdownItems = fixture.nativeElement.querySelectorAll('.nav__dropdown-item');
    expect(dropdownItems.length).toBe(2);
  });
});
