// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { CatalogItem, GenderLabels, ItemTypeLabels } from '../../../../core/models';

@Component({
  selector: 'app-catalog-item-list',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatChipsModule
  ],
  templateUrl: './catalog-item-list.html',
  styleUrls: ['./catalog-item-list.scss']
})
export class CatalogItemList {
  catalogItems = input.required<CatalogItem[]>();
  selectedItemId = input<string | undefined>();
  isLoading = input(false);
  pageNumber = input(1);
  pageSize = input(20);
  totalCount = input(0);
  totalPages = input(1);

  selectItem = output<CatalogItem>();
  create = output<void>();
  delete = output<string>();
  pageChange = output<number>();

  GenderLabels = GenderLabels;
  ItemTypeLabels = ItemTypeLabels;

  onSelectItem(item: CatalogItem): void {
    this.selectItem.emit(item);
  }

  onCreate(): void {
    this.create.emit();
  }

  onDelete(event: Event, catalogItemId: string): void {
    event.stopPropagation();
    this.delete.emit(catalogItemId);
  }

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event.pageIndex + 1);
  }

  getItemTypeLabel(itemType: number | undefined): string {
    return itemType !== undefined ? this.ItemTypeLabels[itemType as keyof typeof this.ItemTypeLabels] || 'Unknown' : '';
  }

  getGenderLabel(gender: number | undefined): string {
    return gender !== undefined ? this.GenderLabels[gender as keyof typeof this.GenderLabels] || 'Unknown' : '';
  }
}
