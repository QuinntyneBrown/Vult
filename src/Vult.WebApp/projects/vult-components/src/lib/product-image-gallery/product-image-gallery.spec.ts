import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductImageGallery, ProductImage } from './product-image-gallery';

describe('ProductImageGallery', () => {
  let component: ProductImageGallery;
  let fixture: ComponentFixture<ProductImageGallery>;

  const mockImages: ProductImage[] = [
    { id: '1', url: '/image1.jpg', altText: 'Image 1', thumbnailUrl: '/thumb1.jpg' },
    { id: '2', url: '/image2.jpg', altText: 'Image 2', thumbnailUrl: '/thumb2.jpg' },
    { id: '3', url: '/image3.jpg', altText: 'Image 3' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductImageGallery]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductImageGallery);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.images).toEqual([]);
    expect(component.enableZoom).toBeFalsy();
    expect(component.stickyOnDesktop).toBeFalsy();
    expect(component.ariaLabel).toBe('Product images');
    expect(component.loading).toBeFalsy();
    expect(component.selectedIndex()).toBe(0);
  });

  it('should render thumbnails for each image', () => {
    component.images = mockImages;
    fixture.detectChanges();

    const thumbnails = fixture.nativeElement.querySelectorAll('.gallery-thumbnail');
    expect(thumbnails.length).toBe(3);
  });

  it('should render thumbnail images', () => {
    component.images = mockImages;
    fixture.detectChanges();

    const thumbnailImages = fixture.nativeElement.querySelectorAll('.gallery-thumbnail__image');
    expect(thumbnailImages[0].getAttribute('src')).toBe('/thumb1.jpg');
    expect(thumbnailImages[2].getAttribute('src')).toBe('/image3.jpg'); // No thumbnail, uses main url
  });

  it('should render main image', () => {
    component.images = mockImages;
    fixture.detectChanges();

    const mainImage = fixture.nativeElement.querySelector('.gallery-main-image__img');
    expect(mainImage.getAttribute('src')).toBe('/image1.jpg');
    expect(mainImage.getAttribute('alt')).toBe('Image 1');
  });

  it('should mark selected thumbnail', () => {
    component.images = mockImages;
    component.selectedIndex.set(1);
    fixture.detectChanges();

    const thumbnails = fixture.nativeElement.querySelectorAll('.gallery-thumbnail');
    expect(thumbnails[1].classList.contains('gallery-thumbnail--selected')).toBeTruthy();
  });

  it('should select image when thumbnail is clicked', () => {
    component.images = mockImages;
    const emitSpy = jest.spyOn(component.imageChange, 'emit');
    fixture.detectChanges();

    component.selectImage(2);

    expect(component.selectedIndex()).toBe(2);
    expect(emitSpy).toHaveBeenCalledWith(2);
  });

  it('should not select invalid index', () => {
    component.images = mockImages;
    fixture.detectChanges();

    component.selectImage(-1);
    expect(component.selectedIndex()).toBe(0);

    component.selectImage(10);
    expect(component.selectedIndex()).toBe(0);
  });

  it('should emit imageClick when main image is clicked', () => {
    component.images = mockImages;
    const emitSpy = jest.spyOn(component.imageClick, 'emit');
    fixture.detectChanges();

    component.onMainImageClick();

    expect(emitSpy).toHaveBeenCalledWith(mockImages[0]);
  });

  it('should not emit imageClick when no images', () => {
    component.images = [];
    const emitSpy = jest.spyOn(component.imageClick, 'emit');
    fixture.detectChanges();

    component.onMainImageClick();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should apply zoomable class when enableZoom is true', () => {
    component.images = mockImages;
    component.enableZoom = true;
    fixture.detectChanges();

    const mainImage = fixture.nativeElement.querySelector('.gallery-main-image');
    expect(mainImage.classList.contains('gallery-main-image--zoomable')).toBeTruthy();
  });

  it('should show skeleton when loading', () => {
    component.images = mockImages;
    component.loading = true;
    fixture.detectChanges();

    const skeletons = fixture.nativeElement.querySelectorAll('.gallery-thumbnail__skeleton');
    expect(skeletons.length).toBe(3);
  });

  it('should show main image skeleton when loading', () => {
    component.loading = true;
    fixture.detectChanges();

    const skeleton = fixture.nativeElement.querySelector('.gallery-main-image__skeleton');
    expect(skeleton).toBeTruthy();
  });

  it('should render dots for navigation', () => {
    component.images = mockImages;
    fixture.detectChanges();

    const dots = fixture.nativeElement.querySelectorAll('.gallery-dot');
    expect(dots.length).toBe(3);
  });

  it('should mark current dot as active', () => {
    component.images = mockImages;
    component.selectedIndex.set(1);
    fixture.detectChanges();

    const dots = fixture.nativeElement.querySelectorAll('.gallery-dot');
    expect(dots[1].classList.contains('gallery-dot--active')).toBeTruthy();
  });

  it('should set selectedImageIndex via input', () => {
    component.images = mockImages;
    component.selectedImageIndex = 2;
    fixture.detectChanges();

    expect(component.selectedIndex()).toBe(2);
  });

  it('should return current image computed value', () => {
    component.images = mockImages;
    component.selectedIndex.set(1);
    fixture.detectChanges();

    expect(component.currentImage()).toEqual(mockImages[1]);
  });

  it('should return null for current image when no images', () => {
    component.images = [];
    fixture.detectChanges();

    expect(component.currentImage()).toBeNull();
  });
});
