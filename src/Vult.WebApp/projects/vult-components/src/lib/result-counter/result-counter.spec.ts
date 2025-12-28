import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultCounter } from './result-counter';

describe('ResultCounter', () => {
  let component: ResultCounter;
  let fixture: ComponentFixture<ResultCounter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultCounter]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultCounter);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.count).toBe(0);
    expect(component.singularLabel).toBe('Result');
    expect(component.pluralLabel).toBe('Results');
    expect(component.loading).toBeFalsy();
    expect(component.animated).toBeFalsy();
    expect(component.updating).toBeFalsy();
  });

  it('should display count', () => {
    component.count = 42;
    fixture.detectChanges();

    const numberElement = fixture.nativeElement.querySelector('.result-counter__number');
    expect(numberElement.textContent.trim()).toBe('42');
  });

  it('should display singular label when count is 1', () => {
    component.count = 1;
    fixture.detectChanges();

    const counter = fixture.nativeElement.querySelector('.result-counter');
    expect(counter.textContent).toContain('Result');
    expect(counter.textContent).not.toContain('Results');
  });

  it('should display plural label when count is not 1', () => {
    component.count = 5;
    fixture.detectChanges();

    const counter = fixture.nativeElement.querySelector('.result-counter');
    expect(counter.textContent).toContain('Results');
  });

  it('should use custom singular label', () => {
    component.count = 1;
    component.singularLabel = 'Item';
    fixture.detectChanges();

    const counter = fixture.nativeElement.querySelector('.result-counter');
    expect(counter.textContent).toContain('Item');
  });

  it('should use custom plural label', () => {
    component.count = 5;
    component.pluralLabel = 'Items';
    fixture.detectChanges();

    const counter = fixture.nativeElement.querySelector('.result-counter');
    expect(counter.textContent).toContain('Items');
  });

  it('should apply loading class when loading', () => {
    component.loading = true;
    fixture.detectChanges();

    const counter = fixture.nativeElement.querySelector('.result-counter');
    expect(counter.classList.contains('result-counter--loading')).toBeTruthy();
  });

  it('should apply animated class when animated', () => {
    component.animated = true;
    fixture.detectChanges();

    const counter = fixture.nativeElement.querySelector('.result-counter');
    expect(counter.classList.contains('result-counter--animated')).toBeTruthy();
  });

  it('should apply updating class when updating', () => {
    component.updating = true;
    fixture.detectChanges();

    const counter = fixture.nativeElement.querySelector('.result-counter');
    expect(counter.classList.contains('result-counter--updating')).toBeTruthy();
  });

  it('should have correct accessibility attributes', () => {
    fixture.detectChanges();

    const counter = fixture.nativeElement.querySelector('.result-counter');
    expect(counter.getAttribute('role')).toBe('status');
    expect(counter.getAttribute('aria-live')).toBe('polite');
  });

  it('should not show count number when loading', () => {
    component.loading = true;
    fixture.detectChanges();

    const numberElement = fixture.nativeElement.querySelector('.result-counter__number');
    expect(numberElement.textContent.trim()).toBe('');
  });
});
