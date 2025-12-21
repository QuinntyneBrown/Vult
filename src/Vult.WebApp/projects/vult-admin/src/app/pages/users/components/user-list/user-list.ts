// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { User } from '../../../../core/models';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.scss']
})
export class UserList {
  users = input<User[]>([]);
  selectedUserId = input<string | null>(null);
  isLoading = input(false);

  selectUser = output<User>();
  create = output<void>();
  delete = output<User>();

  onSelectUser(user: User): void {
    this.selectUser.emit(user);
  }

  onCreate(): void {
    this.create.emit();
  }

  onDelete(event: Event, user: User): void {
    event.stopPropagation();
    this.delete.emit(user);
  }
}
