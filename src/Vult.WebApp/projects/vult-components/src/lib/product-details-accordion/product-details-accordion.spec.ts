import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailsAccordion, AccordionSection } from './product-details-accordion';

describe('ProductDetailsAccordion', () => {
  let component: ProductDetailsAccordion;
  let fixture: ComponentFixture<ProductDetailsAccordion>;

  const mockSections: AccordionSection[] = [
    { id: 'desc', title: 'Description', content: '<p>Product description here.</p>' },
    { id: 'details', title: 'Product Details', content: '<ul><li>Material: Cotton</li></ul>' },
    { id: 'shipping', title: 'Shipping & Returns', content: '<p>Free shipping available.</p>', disabled: true }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsAccordion]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsAccordion);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.sections).toEqual([]);
    expect(component.mode).toBe('multiple');
    expect(component.ariaLabel).toBe('Product information');
    expect(component.expandedIds()).toEqual([]);
  });

  it('should render sections', () => {
    component.sections = mockSections;
    fixture.detectChanges();

    const sections = fixture.nativeElement.querySelectorAll('.accordion-item');
    expect(sections.length).toBe(3);
  });

  it('should render section titles', () => {
    component.sections = mockSections;
    fixture.detectChanges();

    const titles = fixture.nativeElement.querySelectorAll('.accordion-title');
    expect(titles[0].textContent.trim()).toBe('Description');
    expect(titles[1].textContent.trim()).toBe('Product Details');
  });

  it('should expand section on toggle', () => {
    component.sections = mockSections;
    fixture.detectChanges();

    component.toggleSection(mockSections[0]);

    expect(component.expandedIds()).toContain('desc');
  });

  it('should collapse expanded section on toggle', () => {
    component.sections = mockSections;
    component.expandedIds.set(['desc']);
    fixture.detectChanges();

    component.toggleSection(mockSections[0]);

    expect(component.expandedIds()).not.toContain('desc');
  });

  it('should allow multiple expanded sections in multiple mode', () => {
    component.sections = mockSections;
    component.mode = 'multiple';
    fixture.detectChanges();

    component.toggleSection(mockSections[0]);
    component.toggleSection(mockSections[1]);

    expect(component.expandedIds()).toContain('desc');
    expect(component.expandedIds()).toContain('details');
  });

  it('should only allow one expanded section in single mode', () => {
    component.sections = mockSections;
    component.mode = 'single';
    fixture.detectChanges();

    component.toggleSection(mockSections[0]);
    expect(component.expandedIds()).toContain('desc');

    component.toggleSection(mockSections[1]);
    expect(component.expandedIds()).not.toContain('desc');
    expect(component.expandedIds()).toContain('details');
  });

  it('should not toggle disabled section', () => {
    component.sections = mockSections;
    fixture.detectChanges();

    component.toggleSection(mockSections[2]); // Disabled section

    expect(component.expandedIds()).not.toContain('shipping');
  });

  it('should disable button for disabled section', () => {
    component.sections = mockSections;
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.accordion-header');
    expect(buttons[2].disabled).toBeTruthy();
  });

  it('should apply is-disabled class to disabled section', () => {
    component.sections = mockSections;
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.accordion-header');
    expect(buttons[2].classList.contains('is-disabled')).toBeTruthy();
  });

  it('should apply is-expanded class to expanded section', () => {
    component.sections = mockSections;
    component.expandedIds.set(['desc']);
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.accordion-item');
    expect(items[0].classList.contains('is-expanded')).toBeTruthy();
  });

  it('should emit sectionToggle event', () => {
    component.sections = mockSections;
    const emitSpy = jest.spyOn(component.sectionToggle, 'emit');
    fixture.detectChanges();

    component.toggleSection(mockSections[0]);

    expect(emitSpy).toHaveBeenCalledWith({ id: 'desc', isExpanded: true });
  });

  it('should emit expandedChange event', () => {
    component.sections = mockSections;
    const emitSpy = jest.spyOn(component.expandedChange, 'emit');
    fixture.detectChanges();

    component.toggleSection(mockSections[0]);

    expect(emitSpy).toHaveBeenCalledWith(['desc']);
  });

  it('should set initial expanded ids via input', () => {
    component.sections = mockSections;
    component.initialExpandedIds = ['desc', 'details'];
    fixture.detectChanges();

    expect(component.expandedIds()).toEqual(['desc', 'details']);
  });

  it('should render content as HTML', () => {
    component.sections = mockSections;
    component.expandedIds.set(['desc']);
    fixture.detectChanges();

    const content = fixture.nativeElement.querySelector('.accordion-content-inner');
    expect(content.innerHTML).toContain('<p>Product description here.</p>');
  });

  it('should set aria-expanded attribute', () => {
    component.sections = mockSections;
    component.expandedIds.set(['desc']);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.accordion-header');
    expect(buttons[0].getAttribute('aria-expanded')).toBe('true');
    expect(buttons[1].getAttribute('aria-expanded')).toBe('false');
  });

  it('should set aria-controls attribute', () => {
    component.sections = mockSections;
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.accordion-header');
    expect(buttons[0].getAttribute('aria-controls')).toBe('panel-desc');
  });

  it('should set aria-hidden on panel', () => {
    component.sections = mockSections;
    component.expandedIds.set(['desc']);
    fixture.detectChanges();

    const panels = fixture.nativeElement.querySelectorAll('.accordion-panel');
    expect(panels[0].getAttribute('aria-hidden')).toBe('false');
    expect(panels[1].getAttribute('aria-hidden')).toBe('true');
  });
});
