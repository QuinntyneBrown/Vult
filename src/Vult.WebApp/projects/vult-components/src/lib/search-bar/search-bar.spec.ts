import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchBar, SearchSuggestion } from './search-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SearchBar', () => {
  let component: SearchBar;
  let fixture: ComponentFixture<SearchBar>;

  const mockSuggestions: SearchSuggestion[] = [
    { id: '1', text: 'Running shoes', type: 'recent' },
    { id: '2', text: 'Basketball shoes', type: 'trending' },
    { id: '3', text: 'Air Max 90', type: 'product', imageUrl: '/product.jpg', price: 120 }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBar, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBar);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.placeholder).toBe('Search');
    expect(component.suggestions).toEqual([]);
    expect(component.variant).toBe('compact');
    expect(component.searchValue()).toBe('');
    expect(component.expanded()).toBeFalsy();
    expect(component.showSuggestions()).toBeFalsy();
  });

  it('should implement ControlValueAccessor writeValue', () => {
    component.writeValue('test query');
    expect(component.searchValue()).toBe('test query');
  });

  it('should implement ControlValueAccessor writeValue with null', () => {
    component.writeValue(null as any);
    expect(component.searchValue()).toBe('');
  });

  it('should register onChange callback', () => {
    const callback = jest.fn();
    component.registerOnChange(callback);

    const event = { target: { value: 'new query' } } as unknown as Event;
    component.onInput(event);

    expect(callback).toHaveBeenCalledWith('new query');
  });

  it('should register onTouched callback', fakeAsync(() => {
    const callback = jest.fn();
    component.registerOnTouched(callback);

    component.onBlur();
    tick(200);

    expect(callback).toHaveBeenCalled();
  }));

  it('should set disabled state', () => {
    component.setDisabledState(true);
    expect(component.disabled()).toBeTruthy();

    component.setDisabledState(false);
    expect(component.disabled()).toBeFalsy();
  });

  it('should expand and show suggestions on focus', () => {
    component.onFocus();

    expect(component.expanded()).toBeTruthy();
    expect(component.showSuggestions()).toBeTruthy();
  });

  it('should collapse on blur when empty', fakeAsync(() => {
    component.onFocus();
    component.onBlur();
    tick(200);

    expect(component.expanded()).toBeFalsy();
    expect(component.showSuggestions()).toBeFalsy();
  }));

  it('should emit inputChange on input', () => {
    const emitSpy = jest.spyOn(component.inputChange, 'emit');
    fixture.detectChanges();

    const event = { target: { value: 'new query' } } as unknown as Event;
    component.onInput(event);

    expect(emitSpy).toHaveBeenCalledWith('new query');
    expect(component.showSuggestions()).toBeTruthy();
  });

  it('should emit search on submit with value', () => {
    component.searchValue.set('shoes');
    const emitSpy = jest.spyOn(component.search, 'emit');
    fixture.detectChanges();

    component.onSubmit();

    expect(emitSpy).toHaveBeenCalledWith('shoes');
    expect(component.showSuggestions()).toBeFalsy();
  });

  it('should not emit search on submit with empty value', () => {
    component.searchValue.set('   ');
    const emitSpy = jest.spyOn(component.search, 'emit');
    fixture.detectChanges();

    component.onSubmit();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should clear search value', () => {
    component.searchValue.set('test');
    const emitSpy = jest.spyOn(component.inputChange, 'emit');
    fixture.detectChanges();

    component.clearSearch();

    expect(component.searchValue()).toBe('');
    expect(emitSpy).toHaveBeenCalledWith('');
  });

  it('should select suggestion', () => {
    component.suggestions = mockSuggestions;
    const emitSpy = jest.spyOn(component.suggestionSelect, 'emit');
    fixture.detectChanges();

    component.selectSuggestion(mockSuggestions[0]);

    expect(component.searchValue()).toBe('Running shoes');
    expect(emitSpy).toHaveBeenCalledWith(mockSuggestions[0]);
    expect(component.showSuggestions()).toBeFalsy();
  });

  it('should emit clearRecents', () => {
    const emitSpy = jest.spyOn(component.clearRecents, 'emit');
    fixture.detectChanges();

    const event = new MouseEvent('click');
    component.clearRecent(event);

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should group suggestions by type', () => {
    component.suggestions = mockSuggestions;

    const grouped = component.groupedSuggestions;

    expect(grouped.length).toBe(3);
    expect(grouped[0].type).toBe('recent');
    expect(grouped[0].title).toBe('Recent Searches');
    expect(grouped[1].type).toBe('trending');
    expect(grouped[1].title).toBe('Trending');
    expect(grouped[2].type).toBe('product');
    expect(grouped[2].title).toBe('Products');
  });

  it('should compute hasValue correctly', () => {
    expect(component.hasValue()).toBeFalsy();

    component.searchValue.set('test');
    expect(component.hasValue()).toBeTruthy();
  });
});
