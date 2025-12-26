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
import { ProductImagesUpload } from '../../../../../vult/src/app/components/product-images-upload';
import { ProductService } from '../../../../../vult/src/app/core/services';
import { Product, IngestionResult } from '../../../../../vult/src/app/core/models';

interface ProductListViewModel {
  products: Product[];
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
    ProductImagesUpload,
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
  private _productService = inject(ProductService);

  private _pageNumber$ = new BehaviorSubject<number>(1);
  private _pageSize$ = new BehaviorSubject<number>(20);
  private _showUpload$ = new BehaviorSubject<boolean>(false);
  private _refreshTrigger$ = new BehaviorSubject<void>(undefined);
  private _localItems$ = new BehaviorSubject<Product[] | null>(null);
  private _errorMessage$ = new BehaviorSubject<string | null>(null);

  private _productData$ = combineLatest([
    this._pageNumber$,
    this._pageSize$,
    this._refreshTrigger$
  ]).pipe(
    switchMap(([pageNumber, pageSize]) =>
      this._productService.getProducts(pageNumber, pageSize).pipe(
        map(response => ({
          items: response.items || [],
          totalCount: response.totalCount || 0,
          isLoading: false,
          error: null as string | null
        })),
        startWith({
          items: [] as Product[],
          totalCount: 0,
          isLoading: true,
          error: null as string | null
        }),
        catchError(error => {
          console.error('Error loading products:', error);
          return of({
            items: [] as Product[],
            totalCount: 0,
            isLoading: false,
            error: 'Failed to load products. Please try again.'
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
    this._productData$,
    this._showUpload$,
    this._pageNumber$,
    this._pageSize$,
    this._localItems$,
    this._errorMessage$
  ]).pipe(
    map(([productData, showUpload, pageNumber, pageSize, localItems, errorMessage]): ProductListViewModel => ({
      products: localItems !== null ? localItems : productData.items,
      isLoading: productData.isLoading,
      errorMessage: errorMessage,
      showUpload: showUpload,
      pageNumber: pageNumber,
      pageSize: pageSize,
      totalItems: productData.totalCount
    }))
  );

  onUploadComplete(result: IngestionResult): void {
    if (result.products && result.products.length > 0) {
      this._localItems$.next([...result.products, ...(this._localItems$.value || [])]);
      this._refreshTrigger$.next();
    }
    this._showUpload$.next(false);
  }

  toggleUpload(): void {
    this._showUpload$.next(!this._showUpload$.value);
  }

  deleteProduct(id: string): void {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    this._productService.deleteProduct(id).subscribe({
      next: () => {
        this._refreshTrigger$.next();
      },
      error: (error) => {
        this._errorMessage$.next('Failed to delete item. Please try again.');
        console.error('Error deleting product:', error);
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

  trackByProductId(_index: number, item: Product): string {
    return item.productId;
  }
}
