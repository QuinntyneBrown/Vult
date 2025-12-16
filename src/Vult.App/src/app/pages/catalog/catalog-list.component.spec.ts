import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { CatalogListComponent } from './catalog-list.component';
import { PhotoUploadComponent } from '../../components/photo-upload/photo-upload.component';
import { CatalogItemService, SignalRService } from '../../core/services';
import { FakeSignalRService } from './test/fake-signalr.service';

describe('CatalogListComponent E2E Tests', () => {
  let component: CatalogListComponent;
  let fixture: ComponentFixture<CatalogListComponent>;
  let catalogItemService: CatalogItemService;
  let fakeSignalRService: FakeSignalRService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CatalogListComponent,
        PhotoUploadComponent,
        HttpClientTestingModule
      ],
      providers: [
        CatalogItemService,
        {
          provide: SignalRService,
          useClass: FakeSignalRService
        },
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogListComponent);
    component = fixture.componentInstance;
    catalogItemService = TestBed.inject(CatalogItemService);
    fakeSignalRService = TestBed.inject(SignalRService) as unknown as FakeSignalRService;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load catalog items on init', () => {
    const mockResponse = {
      catalogItems: [
        {
          catalogItemId: '1',
          brandName: 'Test Brand',
          description: 'Test Item',
          estimatedResaleValue: 100,
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString()
        }
      ],
      totalCount: 1
    };

    fixture.detectChanges();

    const req = httpMock.expectOne('/api/catalogitems?pageNumber=1&pageSize=20');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(component.catalogItems().length).toBe(1);
    expect(component.catalogItems()[0].brandName).toBe('Test Brand');
  });

  it('should toggle upload section', () => {
    expect(component.showUpload()).toBe(false);
    
    component.toggleUpload();
    
    expect(component.showUpload()).toBe(true);
    
    component.toggleUpload();
    
    expect(component.showUpload()).toBe(false);
  });

  it('should handle upload completion and update catalog items', () => {
    const mockIngestionResult = {
      success: true,
      errors: [],
      totalProcessed: 2,
      successfullyProcessed: 2,
      failed: 0,
      catalogItems: [
        {
          catalogItemId: '2',
          brandName: 'New Brand',
          description: 'New Item',
          estimatedResaleValue: 150,
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString()
        },
        {
          catalogItemId: '3',
          brandName: 'Another Brand',
          description: 'Another Item',
          estimatedResaleValue: 200,
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString()
        }
      ]
    };

    // Initialize with existing items
    component.catalogItems.set([{
      catalogItemId: '1',
      brandName: 'Existing Brand',
      description: 'Existing Item',
      estimatedResaleValue: 100,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
    }]);

    component.showUpload.set(true);

    component.onUploadComplete(mockIngestionResult);

    expect(component.catalogItems().length).toBe(3);
    expect(component.catalogItems()[0].brandName).toBe('New Brand');
    expect(component.catalogItems()[1].brandName).toBe('Another Brand');
    expect(component.catalogItems()[2].brandName).toBe('Existing Brand');
    expect(component.showUpload()).toBe(false);
  });

  it('should delete catalog item', () => {
    // Setup initial items
    component.catalogItems.set([
      {
        catalogItemId: '1',
        brandName: 'Brand 1',
        description: 'Item 1',
        estimatedResaleValue: 100,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString()
      },
      {
        catalogItemId: '2',
        brandName: 'Brand 2',
        description: 'Item 2',
        estimatedResaleValue: 200,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString()
      }
    ]);

    // Mock window.confirm
    spyOn(window, 'confirm').and.returnValue(true);

    component.deleteCatalogItem('1');

    const req = httpMock.expectOne('/api/catalogitems/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    expect(component.catalogItems().length).toBe(1);
    expect(component.catalogItems()[0].catalogItemId).toBe('2');
  });

  it('should handle deletion cancellation', () => {
    component.catalogItems.set([
      {
        catalogItemId: '1',
        brandName: 'Brand 1',
        description: 'Item 1',
        estimatedResaleValue: 100,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString()
      }
    ]);

    // Mock window.confirm to return false
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteCatalogItem('1');

    // No HTTP request should be made
    httpMock.expectNone('/api/catalogitems/1');
    
    expect(component.catalogItems().length).toBe(1);
  });

  it('should handle pagination', () => {
    expect(component.pageNumber()).toBe(1);

    fixture.detectChanges();
    
    // Expect initial load
    const req1 = httpMock.expectOne('/api/catalogitems?pageNumber=1&pageSize=20');
    req1.flush({ catalogItems: [], totalCount: 0 });

    component.nextPage();

    expect(component.pageNumber()).toBe(2);
    
    const req2 = httpMock.expectOne('/api/catalogitems?pageNumber=2&pageSize=20');
    req2.flush({ catalogItems: [], totalCount: 0 });

    component.previousPage();

    expect(component.pageNumber()).toBe(1);
    
    const req3 = httpMock.expectOne('/api/catalogitems?pageNumber=1&pageSize=20');
    req3.flush({ catalogItems: [], totalCount: 0 });
  });

  it('should not go below page 1 when calling previousPage', () => {
    expect(component.pageNumber()).toBe(1);
    
    fixture.detectChanges();
    const req = httpMock.expectOne('/api/catalogitems?pageNumber=1&pageSize=20');
    req.flush({ catalogItems: [], totalCount: 0 });

    component.previousPage();

    expect(component.pageNumber()).toBe(1);
    // No additional HTTP request should be made
    httpMock.expectNone('/api/catalogitems?pageNumber=0&pageSize=20');
  });

  it('should handle loading errors gracefully', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('/api/catalogitems?pageNumber=1&pageSize=20');
    req.error(new ProgressEvent('error'));

    expect(component.isLoading()).toBe(false);
    expect(component.errorMessage()).toBe('Failed to load catalog items. Please try again.');
  });

  it('should complete photo upload flow with fake SignalR events', (done) => {
    fixture.detectChanges();
    
    // Mock initial catalog load
    const req = httpMock.expectOne('/api/catalogitems?pageNumber=1&pageSize=20');
    req.flush({ catalogItems: [], totalCount: 0 });

    // Show upload section
    component.toggleUpload();
    fixture.detectChanges();

    // Simulate the upload process
    const mockIngestionResult = {
      success: true,
      errors: [],
      totalProcessed: 2,
      successfullyProcessed: 2,
      failed: 0,
      catalogItems: [
        {
          catalogItemId: '1',
          brandName: 'Nike',
          description: 'Running shoes',
          estimatedResaleValue: 120,
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString()
        },
        {
          catalogItemId: '2',
          brandName: 'Adidas',
          description: 'Sports jacket',
          estimatedResaleValue: 85,
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString()
        }
      ]
    };

    // Simulate SignalR events using the fake service
    fakeSignalRService.simulateProgress(1, 2, 'Processing image 1 of 2...');
    fakeSignalRService.simulateProgress(2, 2, 'Processing image 2 of 2...');
    
    // Handle completion
    component.onUploadComplete(mockIngestionResult);
    
    expect(component.catalogItems().length).toBe(2);
    expect(component.catalogItems()[0].brandName).toBe('Nike');
    expect(component.catalogItems()[1].brandName).toBe('Adidas');
    done();
  });
});
