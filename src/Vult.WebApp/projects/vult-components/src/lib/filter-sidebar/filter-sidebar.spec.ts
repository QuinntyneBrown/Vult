import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterSidebar, FilterSection } from './filter-sidebar';

describe('FilterSidebar', () => {
  let component: FilterSidebar;
  let fixture: ComponentFixture<FilterSidebar>;

  const mockSections: FilterSection[] = [
    {
      id: 'category',
      title: 'Category',
      type: 'checkbox',
      options: [
        { id: 'shoes', label: 'Shoes', count: 10, checked: false },
        { id: 'clothing', label: 'Clothing', count: 25, checked: true }
      ],
      expanded: true
    },
    {
      id: 'size',
      title: 'Size',
      type: 'size',
      options: [
        { id: 's', label: 'S', count: 5 },
        { id: 'm', label: 'M', count: 8 }
      ],
      expanded: false
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterSidebar]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterSidebar);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.title).toBe('Filters');
    expect(component.sections).toEqual([]);
    expect(component.showCloseButton).toBeFalsy();
    expect(component.showClearButton).toBeTruthy();
  });

  it('should render title', () => {
    component.title = 'Filter Products';
    fixture.detectChanges();

    const titleElement = fixture.nativeElement.querySelector('.filter-sidebar__title');
    expect(titleElement.textContent.trim()).toBe('Filter Products');
  });

  it('should render sections', () => {
    component.sections = mockSections;
    fixture.detectChanges();

    const sections = fixture.nativeElement.querySelectorAll('.filter-section');
    expect(sections.length).toBe(2);
  });

  it('should render section titles', () => {
    component.sections = mockSections;
    fixture.detectChanges();

    const titles = fixture.nativeElement.querySelectorAll('.filter-section__title');
    expect(titles[0].textContent.trim()).toBe('Category');
    expect(titles[1].textContent.trim()).toBe('Size');
  });

  it('should render filter options for expanded sections', () => {
    component.sections = mockSections;
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('.filter-option');
    expect(options.length).toBe(2); // Only from the expanded section
  });

  it('should render option counts', () => {
    component.sections = mockSections;
    fixture.detectChanges();

    const counts = fixture.nativeElement.querySelectorAll('.filter-option__count');
    expect(counts[0].textContent.trim()).toBe('(10)');
    expect(counts[1].textContent.trim()).toBe('(25)');
  });

  it('should show close button when showCloseButton is true', () => {
    component.showCloseButton = true;
    fixture.detectChanges();

    const closeButton = fixture.nativeElement.querySelector('.filter-sidebar__close');
    expect(closeButton).toBeTruthy();
  });

  it('should hide close button when showCloseButton is false', () => {
    component.showCloseButton = false;
    fixture.detectChanges();

    const closeButton = fixture.nativeElement.querySelector('.filter-sidebar__close');
    expect(closeButton).toBeFalsy();
  });

  it('should show clear button when showClearButton is true', () => {
    component.showClearButton = true;
    fixture.detectChanges();

    const clearButton = fixture.nativeElement.querySelector('.filter-sidebar__clear');
    expect(clearButton).toBeTruthy();
  });

  it('should toggle section expansion', () => {
    component.sections = mockSections;
    fixture.detectChanges();

    const section = mockSections[0];
    expect(section.expanded).toBeTruthy();

    component.toggleSection(section);
    expect(section.expanded).toBeFalsy();

    component.toggleSection(section);
    expect(section.expanded).toBeTruthy();
  });

  it('should emit filterChange when option is changed', () => {
    component.sections = mockSections;
    const emitSpy = jest.spyOn(component.filterChange, 'emit');
    fixture.detectChanges();

    const event = { target: { checked: true } } as unknown as Event;
    component.onFilterChange(mockSections[0], mockSections[0].options![0], event);

    expect(emitSpy).toHaveBeenCalledWith({
      section: mockSections[0],
      option: mockSections[0].options![0],
      checked: true
    });
  });

  it('should emit clearAll when clear button is clicked', () => {
    component.showClearButton = true;
    const emitSpy = jest.spyOn(component.clearAll, 'emit');
    fixture.detectChanges();

    component.clearFilters();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit closePanel and set visible to false when close is called', () => {
    component.showCloseButton = true;
    const emitSpy = jest.spyOn(component.closePanel, 'emit');
    fixture.detectChanges();

    component.close();

    expect(component.visible()).toBeFalsy();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should hide sidebar when visible is false', () => {
    component.isVisible = false;
    fixture.detectChanges();

    const sidebar = fixture.nativeElement.querySelector('.filter-sidebar');
    expect(sidebar.classList.contains('filter-sidebar--hidden')).toBeTruthy();
  });
});
