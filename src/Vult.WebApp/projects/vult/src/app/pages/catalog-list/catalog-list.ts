// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { BehaviorSubject, combineLatest, switchMap, map, catchError, of, startWith, shareReplay, tap } from 'rxjs';
import { CatalogItemImagesUpload } from '../../components/catalog-item-images-upload';
import { CatalogItemService } from '../../core/services';
import { CatalogItem, IngestionResult } from '../../core/models';

interface CatalogListViewModel {
  catalogItems: CatalogItem[];
  isLoading: boolean;
  errorMessage: string | null;
  showUpload: boolean;
  pageNumber: number;
  pageSize: number;
  totalItems: number;
}

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
export class CatalogList {
  private _catalogItemService = inject(CatalogItemService);

  private _pageNumber$ = new BehaviorSubject<number>(1);
  private _pageSize$ = new BehaviorSubject<number>(20);
  private _showUpload$ = new BehaviorSubject<boolean>(false);
  private _refreshTrigger$ = new BehaviorSubject<void>(undefined);
  private _localItems$ = new BehaviorSubject<CatalogItem[] | null>(null);
  private _errorMessage$ = new BehaviorSubject<string | null>(null);

  private _catalogData$ = combineLatest([
    this._pageNumber$,
    this._pageSize$,
    this._refreshTrigger$
  ]).pipe(
    switchMap(([pageNumber, pageSize]) =>
      this._catalogItemService.getCatalogItems(pageNumber, pageSize).pipe(
        map(response => ({
          items: response.items || [],
          totalCount: response.totalCount || 0,
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
            error: 'Failed to load catalog items. Please try again.'
          });
        })
      )
    ),
    tap(data => {
      if (data.error) {
        this._errorMessage$.next(data.error);
      } else if (!data.isLoading) {
        this._errorMessage$.next(null);
        this._localItems$.next(null);
      }
    }),
    shareReplay(1)
  );

  viewModel$ = combineLatest([
    this._catalogData$,
    this._showUpload$,
    this._pageNumber$,
    this._pageSize$,
    this._localItems$,
    this._errorMessage$
  ]).pipe(
    map(([catalogData, showUpload, pageNumber, pageSize, localItems, errorMessage]): CatalogListViewModel => ({
      catalogItems: localItems !== null ? localItems : catalogData.items,
      isLoading: catalogData.isLoading,
      errorMessage: errorMessage,
      showUpload: showUpload,
      pageNumber: pageNumber,
      pageSize: pageSize,
      totalItems: catalogData.totalCount
    }))
  );

  onUploadComplete(result: IngestionResult): void {
    if (result.catalogItems && result.catalogItems.length > 0) {
      this._localItems$.next([...result.catalogItems, ...(this._localItems$.value || [])]);
      this._refreshTrigger$.next();
    }
    this._showUpload$.next(false);
  }

  toggleUpload(): void {
    this._showUpload$.next(!this._showUpload$.value);
  }

  deleteCatalogItem(id: string): void {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    this._catalogItemService.deleteCatalogItem(id).subscribe({
      next: () => {
        this._refreshTrigger$.next();
      },
      error: (error) => {
        this._errorMessage$.next('Failed to delete item. Please try again.');
        console.error('Error deleting catalog item:', error);
      }
    });
  }

  nextPage(): void {
    this._pageNumber$.next(this._pageNumber$.value + 1);
  }

  previousPage(): void {
    if (this._pageNumber$.value > 1) {
      this._pageNumber$.next(this._pageNumber$.value - 1);
    }
  }

  showUploadPanel(): void {
    this._showUpload$.next(true);
  }

  trackByCatalogItemId(_index: number, item: CatalogItem): string {
    return item.catalogItemId;
  }
}
