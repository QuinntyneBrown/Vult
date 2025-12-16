import { Component, OnInit, OnDestroy, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { CatalogItemService, SignalRService } from '../../core/services';
import { IngestionProgress, IngestionResult } from '../../core/models';

interface PhotoPreview {
  file: File;
  url: string;
}

@Component({
  selector: 'app-photo-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.scss']
})
export class PhotoUploadComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  photos = signal<PhotoPreview[]>([]);
  isDragging = signal(false);
  isUploading = signal(false);
  uploadProgress = signal<IngestionProgress | null>(null);
  errorMessage = signal<string | null>(null);
  
  uploadComplete = output<IngestionResult>();

  constructor(
    private catalogItemService: CatalogItemService,
    private signalRService: SignalRService
  ) {}

  async ngOnInit(): Promise<void> {
    // Connect to SignalR hub
    await this.signalRService.startConnection();

    // Subscribe to ingestion events
    this.signalRService.ingestionProgress$
      .pipe(takeUntil(this.destroy$))
      .subscribe(progress => {
        this.uploadProgress.set(progress);
      });

    this.signalRService.ingestionComplete$
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isUploading.set(false);
        this.uploadProgress.set(null);
        this.uploadComplete.emit(result);
        this.clearPhotos();
      });

    this.signalRService.ingestionError$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        this.isUploading.set(false);
        this.uploadProgress.set(null);
        this.errorMessage.set(error);
      });
  }

  async ngOnDestroy(): Promise<void> {
    this.destroy$.next();
    this.destroy$.complete();
    await this.signalRService.stopConnection();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(Array.from(files));
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
    }
  }

  private handleFiles(files: File[]): void {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      this.errorMessage.set('Only image files are allowed');
      setTimeout(() => this.errorMessage.set(null), 5000);
    }

    const newPhotos = imageFiles.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));

    this.photos.update(current => [...current, ...newPhotos]);
  }

  removePhoto(index: number): void {
    const photo = this.photos()[index];
    URL.revokeObjectURL(photo.url);
    this.photos.update(current => current.filter((_, i) => i !== index));
  }

  clearPhotos(): void {
    this.photos().forEach(photo => URL.revokeObjectURL(photo.url));
    this.photos.set([]);
  }

  async uploadPhotos(): Promise<void> {
    if (this.photos().length === 0) {
      this.errorMessage.set('Please select at least one photo');
      return;
    }

    this.isUploading.set(true);
    this.errorMessage.set(null);

    const files = this.photos().map(p => p.file);

    this.catalogItemService.uploadPhotos(files).subscribe({
      next: (result) => {
        // Result will be handled by SignalR events
        console.log('Upload initiated successfully');
      },
      error: (error) => {
        this.isUploading.set(false);
        this.errorMessage.set(error.error?.errors?.join(', ') || 'Upload failed. Please try again.');
      }
    });
  }
}
