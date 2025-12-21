// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
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
  catalogItems$ = new BehaviorSubject<CatalogItem[]>([]);
  selectedItem$ = new BehaviorSubject<CatalogItem | null>(null);
  isCreating$ = new BehaviorSubject<boolean>(false);
  isLoading$ = new BehaviorSubject<boolean>(false);
  isSaving$ = new BehaviorSubject<boolean>(false);
  errorMessage$ = new BehaviorSubject<string | null>(null);

  pageNumber$ = new BehaviorSubject<number>(1);
  pageSize$ = new BehaviorSubject<number>(20);
  totalCount$ = new BehaviorSubject<number>(0);
  totalPages$ = combineLatest([this.totalCount$, this.pageSize$]).pipe(
    map(([totalCount, pageSize]) => Math.ceil(totalCount / pageSize))
  );

  showEdit$ = combineLatest([this.selectedItem$, this.isCreating$]).pipe(
    map(([selectedItem, isCreating]) => selectedItem !== null || isCreating)
  );

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
    this.isLoading$.next(true);
    this.errorMessage$.next(null);

    this.catalogItemService.getCatalogItems(this.pageNumber$.value, this.pageSize$.value).subscribe({
      next: (response: PaginatedResponse<CatalogItem>) => {
        this.catalogItems$.next(response.items);
        this.totalCount$.next(response.totalCount);
        this.isLoading$.next(false);
      },
      error: (error) => {
        this.errorMessage$.next('Failed to load catalog items');
        this.isLoading$.next(false);
        console.error('Error loading catalog items:', error);
      }
    });
  }

  loadItemForEditing(catalogItemId: string): void {
    this.isLoading$.next(true);
    this.catalogItemService.getCatalogItemById(catalogItemId).subscribe({
      next: (item) => {
        this.selectedItem$.next(item);
        this.isCreating$.next(false);
        this.isLoading$.next(false);
      },
      error: (error) => {
        this.errorMessage$.next('Failed to load catalog item');
        this.isLoading$.next(false);
        console.error('Error loading catalog item:', error);
      }
    });
  }

  onSelectItem(item: CatalogItem): void {
    this.selectedItem$.next(item);
    this.isCreating$.next(false);
    this.router.navigate(['/catalog-items', item.catalogItemId]);
  }

  onCreate(): void {
    this.selectedItem$.next(null);
    this.isCreating$.next(true);
  }

  onCancel(): void {
    this.selectedItem$.next(null);
    this.isCreating$.next(false);
    this.router.navigate(['/catalog-items']);
  }

  onSave(data: CreateCatalogItemRequest | UpdateCatalogItemRequest): void {
    this.isSaving$.next(true);
    this.errorMessage$.next(null);

    if (this.isCreating$.value) {
      this.catalogItemService.createCatalogItem(data as CreateCatalogItemRequest).subscribe({
        next: (newItem) => {
          const currentItems = this.catalogItems$.value;
          this.catalogItems$.next([newItem, ...currentItems]);
          this.selectedItem$.next(null);
          this.isCreating$.next(false);
          this.isSaving$.next(false);
          this.router.navigate(['/catalog-items']);
        },
        error: (error) => {
          this.errorMessage$.next(error.error?.message || 'Failed to create catalog item');
          this.isSaving$.next(false);
        }
      });
    } else if (this.selectedItem$.value) {
      this.catalogItemService.updateCatalogItem(
        this.selectedItem$.value!.catalogItemId,
        data as UpdateCatalogItemRequest
      ).subscribe({
        next: (updatedItem) => {
          const currentItems = this.catalogItems$.value;
          this.catalogItems$.next(
            currentItems.map(i => i.catalogItemId === updatedItem.catalogItemId ? updatedItem : i)
          );
          this.selectedItem$.next(null);
          this.isSaving$.next(false);
          this.router.navigate(['/catalog-items']);
        },
        error: (error) => {
          this.errorMessage$.next(error.error?.message || 'Failed to update catalog item');
          this.isSaving$.next(false);
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
        const currentItems = this.catalogItems$.value;
        this.catalogItems$.next(currentItems.filter(i => i.catalogItemId !== catalogItemId));
        if (this.selectedItem$.value?.catalogItemId === catalogItemId) {
          this.selectedItem$.next(null);
          this.router.navigate(['/catalog-items']);
        }
      },
      error: (error) => {
        this.errorMessage$.next('Failed to delete catalog item');
        console.error('Error deleting catalog item:', error);
      }
    });
  }

  onPageChange(page: number): void {
    this.pageNumber$.next(page);
    this.loadCatalogItems();
  }
}
