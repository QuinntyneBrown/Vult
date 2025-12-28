import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pagination, PaginationVariant } from './pagination';

describe('Pagination', () => {
  let component: Pagination;
  let fixture: ComponentFixture<Pagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pagination]
    }).compileComponents();

    fixture = TestBed.createComponent(Pagination);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.variant).toBe('numbered');
    expect(component.totalPages).toBe(1);
    expect(component.maxVisiblePages).toBe(7);
    expect(component.loadMoreText).toBe('Load More');
    expect(component.loading).toBeFalsy();
    expect(component.currentPage()).toBe(1);
  });

  it('should render numbered variant by default', () => {
    component.totalPages = 5;
    fixture.detectChanges();

    const pagination = fixture.nativeElement.querySelector('.pagination');
    expect(pagination).toBeTruthy();
  });

  it('should render load-more variant when specified', () => {
    component.variant = 'load-more';
    fixture.detectChanges();

    const loadMore = fixture.nativeElement.querySelector('.load-more');
    expect(loadMore).toBeTruthy();
  });

  it('should set current page via input', () => {
    component.page = 3;
    expect(component.currentPage()).toBe(3);
  });

  it('should disable previous button on first page', () => {
    component.totalPages = 5;
    component.page = 1;
    fixture.detectChanges();

    const prevButton = fixture.nativeElement.querySelector('[aria-label="Previous page"]');
    expect(prevButton.disabled).toBeTruthy();
  });

  it('should disable next button on last page', () => {
    component.totalPages = 5;
    component.page = 5;
    fixture.detectChanges();

    const nextButton = fixture.nativeElement.querySelector('[aria-label="Next page"]');
    expect(nextButton.disabled).toBeTruthy();
  });

  it('should emit pageChange when going to next page', () => {
    component.totalPages = 5;
    component.page = 1;
    const emitSpy = jest.spyOn(component.pageChange, 'emit');
    fixture.detectChanges();

    component.goToPage(2);

    expect(emitSpy).toHaveBeenCalledWith(2);
    expect(component.currentPage()).toBe(2);
  });

  it('should not emit pageChange for same page', () => {
    component.totalPages = 5;
    component.page = 3;
    const emitSpy = jest.spyOn(component.pageChange, 'emit');
    fixture.detectChanges();

    component.goToPage(3);

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should not emit pageChange for invalid page', () => {
    component.totalPages = 5;
    component.page = 1;
    const emitSpy = jest.spyOn(component.pageChange, 'emit');
    fixture.detectChanges();

    component.goToPage(0);
    expect(emitSpy).not.toHaveBeenCalled();

    component.goToPage(6);
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should show all pages when totalPages <= maxVisiblePages', () => {
    component.totalPages = 5;
    component.maxVisiblePages = 7;
    fixture.detectChanges();

    const visiblePages = component.visiblePages();
    expect(visiblePages).toEqual([1, 2, 3, 4, 5]);
  });

  it('should show ellipsis when totalPages > maxVisiblePages', () => {
    component.totalPages = 20;
    component.maxVisiblePages = 7;
    component.page = 1;
    fixture.detectChanges();

    const visiblePages = component.visiblePages();
    expect(visiblePages).toContain('...');
    expect(visiblePages[visiblePages.length - 1]).toBe(20);
  });

  it('should show ellipsis at beginning when near end', () => {
    component.totalPages = 20;
    component.maxVisiblePages = 7;
    component.page = 18;
    fixture.detectChanges();

    const visiblePages = component.visiblePages();
    expect(visiblePages[0]).toBe(1);
    expect(visiblePages[1]).toBe('...');
  });

  it('should show ellipsis on both sides when in middle', () => {
    component.totalPages = 20;
    component.maxVisiblePages = 7;
    component.page = 10;
    fixture.detectChanges();

    const visiblePages = component.visiblePages();
    expect(visiblePages[1]).toBe('...');
    expect(visiblePages[visiblePages.length - 2]).toBe('...');
  });

  it('should render load-more button with correct text', () => {
    component.variant = 'load-more';
    component.loadMoreText = 'Show More';
    fixture.detectChanges();

    const loadMoreButton = fixture.nativeElement.querySelector('.load-more__button');
    expect(loadMoreButton.textContent.trim()).toBe('Show More');
  });

  it('should render progress text in load-more variant', () => {
    component.variant = 'load-more';
    component.showingCount = 20;
    component.totalCount = 100;
    fixture.detectChanges();

    const progressText = fixture.nativeElement.querySelector('.load-more__progress');
    expect(progressText.textContent.trim()).toBe('Showing 20 of 100');
  });

  it('should emit loadMore when load more button is clicked', () => {
    component.variant = 'load-more';
    const emitSpy = jest.spyOn(component.loadMore, 'emit');
    fixture.detectChanges();

    const loadMoreButton = fixture.nativeElement.querySelector('.load-more__button');
    loadMoreButton.click();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should disable load-more button when loading', () => {
    component.variant = 'load-more';
    component.loading = true;
    fixture.detectChanges();

    const loadMoreButton = fixture.nativeElement.querySelector('.load-more__button');
    expect(loadMoreButton.disabled).toBeTruthy();
  });

  it('should show spinner when loading', () => {
    component.variant = 'load-more';
    component.loading = true;
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('.load-more__spinner');
    expect(spinner).toBeTruthy();
  });
});
