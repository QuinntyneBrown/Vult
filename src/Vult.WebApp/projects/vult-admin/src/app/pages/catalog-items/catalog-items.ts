// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogItemList } from './components/catalog-item-list/catalog-item-list';
import { CatalogItemEdit } from './components/catalog-item-edit/catalog-item-edit';
import { CatalogItemService } from '../../core/services';
import {
  CatalogItem,
  PaginatedResponse,
  CreateCatalogItemRequest,
  UpdateCatalogItemRequest
} from '../../core/models';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-catalog-items',
  standalone: true,
  imports: [CommonModule, CatalogItemList, CatalogItemEdit, MatIconModule],
  templateUrl: './catalog-items.html',
  styleUrls: ['./catalog-items.scss']
})
export class CatalogItems implements OnInit {
  catalogItems = signal<CatalogItem[]>([]);
  selectedItem = signal<CatalogItem | null>(null);
  isCreating = signal(false);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);

  pageNumber = signal(1);
  pageSize = signal(20);
  totalCount = signal(0);
  totalPages = computed(() => Math.ceil(this.totalCount() / this.pageSize()));

  showEdit = computed(() => this.selectedItem() !== null || this.isCreating());

  constructor(
    private catalogItemService: CatalogItemService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCatalogItems();

    this.route.paramMap.subscribe(params => {
      const catalogItemId = params.get('catalogItemId');
      if (catalogItemId) {
        this.loadItemForEditing(catalogItemId);
      }
    });
  }

  loadCatalogItems(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.catalogItemService.getCatalogItems(this.pageNumber(), this.pageSize()).subscribe({
      next: (response: PaginatedResponse<CatalogItem>) => {
        this.catalogItems.set(response.items);
        this.totalCount.set(response.totalCount);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Failed to load catalog items');
        this.isLoading.set(false);
        console.error('Error loading catalog items:', error);
      }
    });
  }

  loadItemForEditing(catalogItemId: string): void {
    this.isLoading.set(true);
    this.catalogItemService.getCatalogItemById(catalogItemId).subscribe({
      next: (item) => {
        this.selectedItem.set(item);
        this.isCreating.set(false);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Failed to load catalog item');
        this.isLoading.set(false);
        console.error('Error loading catalog item:', error);
      }
    });
  }

  onSelectItem(item: CatalogItem): void {
    this.selectedItem.set(item);
    this.isCreating.set(false);
    this.router.navigate(['/catalog-items', item.catalogItemId]);
  }

  onCreate(): void {
    this.selectedItem.set(null);
    this.isCreating.set(true);
  }

  onCancel(): void {
    this.selectedItem.set(null);
    this.isCreating.set(false);
    this.router.navigate(['/catalog-items']);
  }

  onSave(data: CreateCatalogItemRequest | UpdateCatalogItemRequest): void {
    this.isSaving.set(true);
    this.errorMessage.set(null);

    if (this.isCreating()) {
      this.catalogItemService.createCatalogItem(data as CreateCatalogItemRequest).subscribe({
        next: (newItem) => {
          this.catalogItems.update(items => [newItem, ...items]);
          this.selectedItem.set(null);
          this.isCreating.set(false);
          this.isSaving.set(false);
          this.router.navigate(['/catalog-items']);
        },
        error: (error) => {
          this.errorMessage.set(error.error?.message || 'Failed to create catalog item');
          this.isSaving.set(false);
        }
      });
    } else if (this.selectedItem()) {
      this.catalogItemService.updateCatalogItem(
        this.selectedItem()!.catalogItemId,
        data as UpdateCatalogItemRequest
      ).subscribe({
        next: (updatedItem) => {
          this.catalogItems.update(items =>
            items.map(i => i.catalogItemId === updatedItem.catalogItemId ? updatedItem : i)
          );
          this.selectedItem.set(null);
          this.isSaving.set(false);
          this.router.navigate(['/catalog-items']);
        },
        error: (error) => {
          this.errorMessage.set(error.error?.message || 'Failed to update catalog item');
          this.isSaving.set(false);
        }
      });
    }
  }

  onDelete(catalogItemId: string): void {
    if (!confirm('Are you sure you want to delete this catalog item?')) {
      return;
    }

    this.catalogItemService.deleteCatalogItem(catalogItemId).subscribe({
      next: () => {
        this.catalogItems.update(items => items.filter(i => i.catalogItemId !== catalogItemId));
        if (this.selectedItem()?.catalogItemId === catalogItemId) {
          this.selectedItem.set(null);
          this.router.navigate(['/catalog-items']);
        }
      },
      error: (error) => {
        this.errorMessage.set('Failed to delete catalog item');
        console.error('Error deleting catalog item:', error);
      }
    });
  }

  onPageChange(page: number): void {
    this.pageNumber.set(page);
    this.loadCatalogItems();
  }
}
