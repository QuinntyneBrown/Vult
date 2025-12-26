// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, map, switchMap, catchError, of, startWith, shareReplay, tap, filter } from 'rxjs';
import { CatalogItemList } from './components/catalog-item-list/catalog-item-list';
import { CatalogItemEdit } from './components/catalog-item-edit/catalog-item-edit';
import { CatalogItemService } from '../../core/services';
import {
  CatalogItem,
  CreateCatalogItemRequest,
  UpdateCatalogItemRequest
} from '../../core/models';
import { MatIconModule } from '@angular/material/icon';

interface CatalogItemsViewModel {
  catalogItems: CatalogItem[];
  selectedItem: CatalogItem | null;
  isCreating: boolean;
  isLoading: boolean;
  isSaving: boolean;
  errorMessage: string | null;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  showEdit: boolean;
}

@Component({
  selector: 'app-catalog-items',
  standalone: true,
  imports: [CommonModule, CatalogItemList, CatalogItemEdit, MatIconModule],
  templateUrl: './catalog-items.html',
  styleUrls: ['./catalog-items.scss']
})
export class CatalogItems {
  private _catalogItemService = inject(CatalogItemService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);

  private _pageNumber$ = new BehaviorSubject<number>(1);
  private _pageSize$ = new BehaviorSubject<number>(20);
  private _refreshTrigger$ = new BehaviorSubject<void>(undefined);
  private _isCreating$ = new BehaviorSubject<boolean>(false);
  private _isSaving$ = new BehaviorSubject<boolean>(false);
  private _errorMessage$ = new BehaviorSubject<string | null>(null);
  private _localSelectedItem$ = new BehaviorSubject<CatalogItem | null>(null);

  private _catalogData$ = combineLatest([
    this._pageNumber$,
    this._pageSize$,
    this._refreshTrigger$
  ]).pipe(
    switchMap(([pageNumber, pageSize]) =>
      this._catalogItemService.getCatalogItems(pageNumber, pageSize).pipe(
        map(response => ({
          items: response.items,
          totalCount: response.totalCount,
          isLoading: false,
          error: null as string | null
        })),
        startWith({
          items: [] as CatalogItem[],
          totalCount: 0,
          isLoading: true,
          error: null as string | null
        }),
        catchError(error => {
          console.error('Error loading catalog items:', error);
          return of({
            items: [] as CatalogItem[],
            totalCount: 0,
            isLoading: false,
            error: 'Failed to load catalog items'
          });
        })
      )
    ),
    tap(data => {
      if (data.error) {
        this._errorMessage$.next(data.error);
      }
    }),
    shareReplay(1)
  );

  private _selectedItemFromRoute$ = this._route.paramMap.pipe(
    map(params => params.get('catalogItemId')),
    switchMap(catalogItemId => {
      if (!catalogItemId) {
        return of({ item: null as CatalogItem | null, isLoading: false, error: null as string | null });
      }
      return this._catalogItemService.getCatalogItemById(catalogItemId).pipe(
        map(item => ({ item, isLoading: false, error: null as string | null })),
        startWith({ item: null as CatalogItem | null, isLoading: true, error: null as string | null }),
        catchError(error => {
          console.error('Error loading catalog item:', error);
          return of({ item: null as CatalogItem | null, isLoading: false, error: 'Failed to load catalog item' });
        })
      );
    }),
    tap(data => {
      if (data.item) {
        this._localSelectedItem$.next(data.item);
        this._isCreating$.next(false);
      } else if (!data.isLoading) {
        this._localSelectedItem$.next(null);
      }
      if (data.error) {
        this._errorMessage$.next(data.error);
      }
    }),
    shareReplay(1)
  );

  viewModel$ = combineLatest([
    this._catalogData$,
    this._selectedItemFromRoute$,
    this._localSelectedItem$,
    this._isCreating$,
    this._isSaving$,
    this._errorMessage$,
    this._pageNumber$,
    this._pageSize$
  ]).pipe(
    map(([catalogData, _routeItem, localSelectedItem, isCreating, isSaving, errorMessage, pageNumber, pageSize]): CatalogItemsViewModel => ({
      catalogItems: catalogData.items,
      selectedItem: localSelectedItem,
      isCreating: isCreating,
      isLoading: catalogData.isLoading,
      isSaving: isSaving,
      errorMessage: errorMessage,
      pageNumber: pageNumber,
      pageSize: pageSize,
      totalCount: catalogData.totalCount,
      totalPages: Math.ceil(catalogData.totalCount / pageSize),
      showEdit: localSelectedItem !== null || isCreating
    }))
  );

  onSelectItem(item: CatalogItem): void {
    this._localSelectedItem$.next(item);
    this._isCreating$.next(false);
    this._router.navigate(['/catalog-items', item.catalogItemId]);
  }

  onCreate(): void {
    this._localSelectedItem$.next(null);
    this._isCreating$.next(true);
  }

  onCancel(): void {
    this._localSelectedItem$.next(null);
    this._isCreating$.next(false);
    this._router.navigate(['/catalog-items']);
  }

  onSave(data: CreateCatalogItemRequest | UpdateCatalogItemRequest): void {
    this._isSaving$.next(true);
    this._errorMessage$.next(null);

    if (this._isCreating$.value) {
      this._catalogItemService.createCatalogItem(data as CreateCatalogItemRequest).subscribe({
        next: () => {
          this._localSelectedItem$.next(null);
          this._isCreating$.next(false);
          this._isSaving$.next(false);
          this._refreshTrigger$.next();
          this._router.navigate(['/catalog-items']);
        },
        error: (error) => {
          this._errorMessage$.next(error.error?.message || 'Failed to create catalog item');
          this._isSaving$.next(false);
        }
      });
    } else {
      const selectedItem = this._localSelectedItem$.value;
      if (selectedItem) {
        this._catalogItemService.updateCatalogItem(
          selectedItem.catalogItemId,
          data as UpdateCatalogItemRequest
        ).subscribe({
          next: () => {
            this._localSelectedItem$.next(null);
            this._isSaving$.next(false);
            this._refreshTrigger$.next();
            this._router.navigate(['/catalog-items']);
          },
          error: (error) => {
            this._errorMessage$.next(error.error?.message || 'Failed to update catalog item');
            this._isSaving$.next(false);
          }
        });
      }
    }
  }

  onDelete(catalogItemId: string): void {
    if (!confirm('Are you sure you want to delete this catalog item?')) {
      return;
    }

    this._catalogItemService.deleteCatalogItem(catalogItemId).subscribe({
      next: () => {
        if (this._localSelectedItem$.value?.catalogItemId === catalogItemId) {
          this._localSelectedItem$.next(null);
          this._router.navigate(['/catalog-items']);
        }
        this._refreshTrigger$.next();
      },
      error: (error) => {
        this._errorMessage$.next('Failed to delete catalog item');
        console.error('Error deleting catalog item:', error);
      }
    });
  }

  onPageChange(page: number): void {
    this._pageNumber$.next(page);
  }
}
