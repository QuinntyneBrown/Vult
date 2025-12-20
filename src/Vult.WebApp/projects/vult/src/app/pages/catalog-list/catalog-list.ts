// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CatalogItemImagesUpload } from '../../components/catalog-item-images-upload';
import { CatalogItemService } from '../../core/services';
import { CatalogItem, IngestionResult } from '../../core/models';

@Component({
  selector: 'app-catalog-list',
  standalone: true,
  imports: [
    CommonModule,
    CatalogItemImagesUpload,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './catalog-list.html',
  styleUrls: ['./catalog-list.scss']
})
export class CatalogList implements OnInit {
  catalogItems = signal<CatalogItem[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  showUpload = signal(false);

  pageNumber = signal(1);
  pageSize = signal(20);
  totalItems = signal(0);

  constructor(private catalogItemService: CatalogItemService) {}

  ngOnInit(): void {
    this.loadCatalogItems();
  }

  loadCatalogItems(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.catalogItemService.getCatalogItems(this.pageNumber(), this.pageSize())
      .subscribe({
        next: (response) => {
          this.catalogItems.set(response.items || []);
          this.totalItems.set(response.totalCount || 0);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.errorMessage.set('Failed to load catalog items. Please try again.');
          this.isLoading.set(false);
          console.error('Error loading catalog items:', error);
        }
      });
  }

  onUploadComplete(result: IngestionResult): void {
    console.log('Upload complete:', result);

    if (result.catalogItems && result.catalogItems.length > 0) {
      this.catalogItems.update(current => [...result.catalogItems, ...current]);
    }

    this.showUpload.set(false);
  }

  toggleUpload(): void {
    this.showUpload.update(current => !current);
  }

  deleteCatalogItem(id: string): void {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    this.catalogItemService.deleteCatalogItem(id).subscribe({
      next: () => {
        this.catalogItems.update(items => items.filter(item => item.catalogItemId !== id));
      },
      error: (error) => {
        this.errorMessage.set('Failed to delete item. Please try again.');
        console.error('Error deleting catalog item:', error);
      }
    });
  }

  nextPage(): void {
    this.pageNumber.update(n => n + 1);
    this.loadCatalogItems();
  }

  previousPage(): void {
    if (this.pageNumber() > 1) {
      this.pageNumber.update(n => n - 1);
      this.loadCatalogItems();
    }
  }
}
