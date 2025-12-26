// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, map, switchMap, catchError, of, startWith, shareReplay, tap, filter } from 'rxjs';
import { ProductList } from './components/product-list/product-list';
import { ProductEdit } from './components/product-edit/product-edit';
import { ProductService } from '../../core/services';
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest
} from '../../core/models';
import { MatIconModule } from '@angular/material/icon';

interface ProductsViewModel {
  products: Product[];
  selectedItem: Product | null;
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
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductList, ProductEdit, MatIconModule],
  templateUrl: './products.html',
  styleUrls: ['./products.scss']
})
export class Products {
  private _productService = inject(ProductService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);

  private _pageNumber$ = new BehaviorSubject<number>(1);
  private _pageSize$ = new BehaviorSubject<number>(20);
  private _refreshTrigger$ = new BehaviorSubject<void>(undefined);
  private _isCreating$ = new BehaviorSubject<boolean>(false);
  private _isSaving$ = new BehaviorSubject<boolean>(false);
  private _errorMessage$ = new BehaviorSubject<string | null>(null);
  private _localSelectedItem$ = new BehaviorSubject<Product | null>(null);

  private _productData$ = combineLatest([
    this._pageNumber$,
    this._pageSize$,
    this._refreshTrigger$
  ]).pipe(
    switchMap(([pageNumber, pageSize]) =>
      this._productService.getProducts(pageNumber, pageSize).pipe(
        map(response => ({
          items: response.items,
          totalCount: response.totalCount,
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
            error: 'Failed to load products'
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
    map(params => params.get('productId')),
    switchMap(productId => {
      if (!productId) {
        return of({ item: null as Product | null, isLoading: false, error: null as string | null });
      }
      return this._productService.getProductById(productId).pipe(
        map(item => ({ item, isLoading: false, error: null as string | null })),
        startWith({ item: null as Product | null, isLoading: true, error: null as string | null }),
        catchError(error => {
          console.error('Error loading product:', error);
          return of({ item: null as Product | null, isLoading: false, error: 'Failed to load product' });
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
    this._productData$,
    this._selectedItemFromRoute$,
    this._localSelectedItem$,
    this._isCreating$,
    this._isSaving$,
    this._errorMessage$,
    this._pageNumber$,
    this._pageSize$
  ]).pipe(
    map(([productData, _routeItem, localSelectedItem, isCreating, isSaving, errorMessage, pageNumber, pageSize]): ProductsViewModel => ({
      products: productData.items,
      selectedItem: localSelectedItem,
      isCreating: isCreating,
      isLoading: productData.isLoading,
      isSaving: isSaving,
      errorMessage: errorMessage,
      pageNumber: pageNumber,
      pageSize: pageSize,
      totalCount: productData.totalCount,
      totalPages: Math.ceil(productData.totalCount / pageSize),
      showEdit: localSelectedItem !== null || isCreating
    }))
  );

  onSelectItem(item: Product): void {
    this._localSelectedItem$.next(item);
    this._isCreating$.next(false);
    this._router.navigate(['/products', item.productId]);
  }

  onCreate(): void {
    this._localSelectedItem$.next(null);
    this._isCreating$.next(true);
  }

  onCancel(): void {
    this._localSelectedItem$.next(null);
    this._isCreating$.next(false);
    this._router.navigate(['/products']);
  }

  onSave(data: CreateProductRequest | UpdateProductRequest): void {
    this._isSaving$.next(true);
    this._errorMessage$.next(null);

    if (this._isCreating$.value) {
      this._productService.createProduct(data as CreateProductRequest).subscribe({
        next: () => {
          this._localSelectedItem$.next(null);
          this._isCreating$.next(false);
          this._isSaving$.next(false);
          this._refreshTrigger$.next();
          this._router.navigate(['/products']);
        },
        error: (error) => {
          this._errorMessage$.next(error.error?.message || 'Failed to create product');
          this._isSaving$.next(false);
        }
      });
    } else {
      const selectedItem = this._localSelectedItem$.value;
      if (selectedItem) {
        this._productService.updateProduct(
          selectedItem.productId,
          data as UpdateProductRequest
        ).subscribe({
          next: () => {
            this._localSelectedItem$.next(null);
            this._isSaving$.next(false);
            this._refreshTrigger$.next();
            this._router.navigate(['/products']);
          },
          error: (error) => {
            this._errorMessage$.next(error.error?.message || 'Failed to update product');
            this._isSaving$.next(false);
          }
        });
      }
    }
  }

  onDelete(productId: string): void {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    this._productService.deleteProduct(productId).subscribe({
      next: () => {
        if (this._localSelectedItem$.value?.productId === productId) {
          this._localSelectedItem$.next(null);
          this._router.navigate(['/products']);
        }
        this._refreshTrigger$.next();
      },
      error: (error) => {
        this._errorMessage$.next('Failed to delete product');
        console.error('Error deleting product:', error);
      }
    });
  }

  onPageChange(page: number): void {
    this._pageNumber$.next(page);
  }
}
