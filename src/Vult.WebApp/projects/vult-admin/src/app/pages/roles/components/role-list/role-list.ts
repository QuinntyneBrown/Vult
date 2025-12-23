// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { Role } from '../../../../core/models';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './role-list.html',
  styleUrls: ['./role-list.scss']
})
export class RoleList {
  roles = input<Role[]>([]);
  selectedRoleId = input<string | null>(null);
  isLoading = input(false);

  selectRole = output<Role>();
  create = output<void>();
  delete = output<Role>();

  onSelectRole(role: Role): void {
    this.selectRole.emit(role);
  }

  onCreate(): void {
    this.create.emit();
  }

  onDelete(event: Event, role: Role): void {
    event.stopPropagation();
    this.delete.emit(role);
  }
}
