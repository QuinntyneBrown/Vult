import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageHeader, PageHeaderAlignment } from './page-header';

describe('PageHeader', () => {
  let component: PageHeader;
  let fixture: ComponentFixture<PageHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeader]
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeader);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.title).toBe('');
    expect(component.subtitle).toBe('');
    expect(component.count).toBeUndefined();
    expect(component.alignment).toBe('left');
  });

  it('should render title', () => {
    component.title = 'Test Title';
    fixture.detectChanges();

    const titleElement = fixture.nativeElement.querySelector('.page-header__title');
    expect(titleElement.textContent).toContain('Test Title');
  });

  it('should render count when provided', () => {
    component.title = 'Products';
    component.count = 42;
    fixture.detectChanges();

    const countElement = fixture.nativeElement.querySelector('.page-header__count');
    expect(countElement).toBeTruthy();
    expect(countElement.textContent.trim()).toBe('(42)');
  });

  it('should not render count when not provided', () => {
    component.title = 'Products';
    fixture.detectChanges();

    const countElement = fixture.nativeElement.querySelector('.page-header__count');
    expect(countElement).toBeFalsy();
  });

  it('should render subtitle when provided', () => {
    component.subtitle = 'Subtitle text';
    fixture.detectChanges();

    const subtitleElement = fixture.nativeElement.querySelector('.page-header__subtitle');
    expect(subtitleElement).toBeTruthy();
    expect(subtitleElement.textContent.trim()).toBe('Subtitle text');
  });

  it('should not render subtitle when not provided', () => {
    fixture.detectChanges();

    const subtitleElement = fixture.nativeElement.querySelector('.page-header__subtitle');
    expect(subtitleElement).toBeFalsy();
  });

  it('should render HTML content in subtitle', () => {
    component.subtitle = '<strong>Bold</strong> text';
    fixture.detectChanges();

    const subtitleElement = fixture.nativeElement.querySelector('.page-header__subtitle');
    expect(subtitleElement.innerHTML).toContain('<strong>Bold</strong>');
  });

  it('should apply center alignment class', () => {
    component.alignment = 'center';
    fixture.detectChanges();

    const headerElement = fixture.nativeElement.querySelector('.page-header');
    expect(headerElement.classList.contains('page-header--center')).toBeTruthy();
  });

  it('should not apply center class when alignment is left', () => {
    component.alignment = 'left';
    fixture.detectChanges();

    const headerElement = fixture.nativeElement.querySelector('.page-header');
    expect(headerElement.classList.contains('page-header--center')).toBeFalsy();
  });
});
