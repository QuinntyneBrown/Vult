import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreadcrumbNavigation, BreadcrumbItem } from './breadcrumb-navigation';

describe('BreadcrumbNavigation', () => {
  let component: BreadcrumbNavigation;
  let fixture: ComponentFixture<BreadcrumbNavigation>;

  const mockBreadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Shoes', href: '/products/shoes' },
    { label: 'Running Shoes' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbNavigation]
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbNavigation);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default empty items', () => {
    expect(component.items).toEqual([]);
  });

  it('should render breadcrumb items', () => {
    component.items = mockBreadcrumbs;
    fixture.detectChanges();

    const breadcrumbItems = fixture.nativeElement.querySelectorAll('.breadcrumb__item');
    expect(breadcrumbItems.length).toBe(4);
  });

  it('should render links for items with href that are not last', () => {
    component.items = mockBreadcrumbs;
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('.breadcrumb__link');
    expect(links.length).toBe(3);
  });

  it('should render current item without link for last item', () => {
    component.items = mockBreadcrumbs;
    fixture.detectChanges();

    const currentItems = fixture.nativeElement.querySelectorAll('.breadcrumb__current');
    expect(currentItems.length).toBe(1);
    expect(currentItems[0].textContent.trim()).toBe('Running Shoes');
  });

  it('should set aria-current on last item', () => {
    component.items = mockBreadcrumbs;
    fixture.detectChanges();

    const currentItem = fixture.nativeElement.querySelector('[aria-current="page"]');
    expect(currentItem).toBeTruthy();
    expect(currentItem.textContent.trim()).toBe('Running Shoes');
  });

  it('should render separators between items', () => {
    component.items = mockBreadcrumbs;
    fixture.detectChanges();

    const separators = fixture.nativeElement.querySelectorAll('.breadcrumb__separator');
    expect(separators.length).toBe(3); // 4 items - 1 = 3 separators
  });

  it('should emit itemClick when link is clicked', () => {
    component.items = mockBreadcrumbs;
    const emitSpy = jest.spyOn(component.itemClick, 'emit');
    fixture.detectChanges();

    const event = new MouseEvent('click');
    component.onItemClick(event, mockBreadcrumbs[0]);

    expect(emitSpy).toHaveBeenCalledWith(mockBreadcrumbs[0]);
  });

  it('should prevent default on link click', () => {
    component.items = mockBreadcrumbs;
    fixture.detectChanges();

    const event = new MouseEvent('click');
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

    component.onItemClick(event, mockBreadcrumbs[0]);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should have aria-label on nav element', () => {
    fixture.detectChanges();
    const nav = fixture.nativeElement.querySelector('nav');
    expect(nav.getAttribute('aria-label')).toBe('Breadcrumb');
  });
});
