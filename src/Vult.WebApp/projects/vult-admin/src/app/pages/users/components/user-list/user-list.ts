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
import { User } from '../../../../core/models';

@Component({
  selector: 'app-user-list',
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
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.scss']
})
export class UserList {
  users = input.required<User[]>();
  selectedUserId = input<string | undefined>();
  isLoading = input(false);
  pageNumber = input(1);
  pageSize = input(20);
  totalCount = input(0);
  totalPages = input(1);

  selectUser = output<User>();
  create = output<void>();
  delete = output<string>();
  pageChange = output<number>();

  onSelectUser(user: User): void {
    this.selectUser.emit(user);
  }

  onCreate(): void {
    this.create.emit();
  }

  onDelete(event: Event, userId: string): void {
    event.stopPropagation();
    this.delete.emit(userId);
  }

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event.pageIndex + 1);
  }
}
