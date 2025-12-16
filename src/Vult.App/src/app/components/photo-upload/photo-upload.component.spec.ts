import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PhotoUploadComponent } from './photo-upload.component';
import { CatalogItemService, SignalRService } from '../../core/services';
import { FakeSignalRService } from '../../pages/catalog/test/fake-signalr.service';

describe('PhotoUploadComponent', () => {
  let component: PhotoUploadComponent;
  let fixture: ComponentFixture<PhotoUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoUploadComponent, HttpClientTestingModule],
      providers: [
        CatalogItemService,
        { provide: SignalRService, useClass: FakeSignalRService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle file selection', () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const files = [file];
    
    component['handleFiles'](files);
    
    expect(component.photos().length).toBe(1);
    expect(component.photos()[0].file.name).toBe('test.jpg');
  });

  it('should remove photo by index', () => {
    const file1 = new File(['test1'], 'test1.jpg', { type: 'image/jpeg' });
    const file2 = new File(['test2'], 'test2.jpg', { type: 'image/jpeg' });
    
    component['handleFiles']([file1, file2]);
    expect(component.photos().length).toBe(2);
    
    component.removePhoto(0);
    expect(component.photos().length).toBe(1);
    expect(component.photos()[0].file.name).toBe('test2.jpg');
  });

  it('should clear all photos', () => {
    const files = [
      new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
      new File(['test2'], 'test2.jpg', { type: 'image/jpeg' })
    ];
    
    component['handleFiles'](files);
    expect(component.photos().length).toBe(2);
    
    component.clearPhotos();
    expect(component.photos().length).toBe(0);
  });

  it('should filter non-image files', () => {
    const imageFile = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
    const textFile = new File(['text'], 'test.txt', { type: 'text/plain' });
    
    component['handleFiles']([imageFile, textFile]);
    
    expect(component.photos().length).toBe(1);
    expect(component.photos()[0].file.name).toBe('test.jpg');
    expect(component.errorMessage()).toBeTruthy();
  });
});
