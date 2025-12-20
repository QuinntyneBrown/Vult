// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../core/services';
import { UserDto, UserStatus } from '../../core/models';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatMenuModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.scss']
})
export class UserList implements OnInit {
  users = signal<UserDto[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  pageNumber = signal(1);
  pageSize = signal(20);
  totalItems = signal(0);
  totalPages = signal(0);

  searchTerm = signal('');
  statusFilter = signal<string>('');
  sortBy = signal('created_desc');

  displayedColumns = ['username', 'email', 'name', 'status', 'lastLogin', 'actions'];
  statusOptions: { value: string; label: string }[] = [
    { value: '', label: 'All Statuses' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Locked', label: 'Locked' },
    { value: 'Deleted', label: 'Deleted' }
  ];

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.userService.getUsers(
      this.pageNumber(),
      this.pageSize(),
      {
        status: this.statusFilter() || undefined,
        searchTerm: this.searchTerm() || undefined,
        sortBy: this.sortBy()
      }
    ).subscribe({
      next: (response) => {
        this.users.set(response.users || []);
        this.totalItems.set(response.totalCount || 0);
        this.totalPages.set(response.totalPages || 0);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Failed to load users. Please try again.');
        this.isLoading.set(false);
        console.error('Error loading users:', error);
      }
    });
  }

  onSearch(): void {
    this.pageNumber.set(1);
    this.loadUsers();
  }

  onStatusFilterChange(): void {
    this.pageNumber.set(1);
    this.loadUsers();
  }

  getStatusColor(status: UserStatus): string {
    switch (status) {
      case 'Active': return 'primary';
      case 'Inactive': return 'accent';
      case 'Locked': return 'warn';
      case 'Deleted': return '';
      default: return '';
    }
  }

  getFullName(user: UserDto): string {
    const parts = [user.firstName, user.lastName].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : '-';
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  }

  activateUser(user: UserDto): void {
    this.userService.activateUser(user.userId, { activationMethod: 'AdminManual' })
      .subscribe({
        next: (result) => {
          if (result.success) {
            this.snackBar.open('User activated successfully', 'Close', { duration: 3000 });
            this.loadUsers();
          } else {
            this.snackBar.open(result.errors.join(', '), 'Close', { duration: 5000 });
          }
        },
        error: (error) => {
          this.snackBar.open('Failed to activate user', 'Close', { duration: 3000 });
          console.error('Error activating user:', error);
        }
      });
  }

  deactivateUser(user: UserDto): void {
    const reason = prompt('Enter reason for deactivation:');
    if (!reason) return;

    this.userService.deactivateUser(user.userId, { reason })
      .subscribe({
        next: (result) => {
          if (result.success) {
            this.snackBar.open('User deactivated successfully', 'Close', { duration: 3000 });
            this.loadUsers();
          } else {
            this.snackBar.open(result.errors.join(', '), 'Close', { duration: 5000 });
          }
        },
        error: (error) => {
          this.snackBar.open('Failed to deactivate user', 'Close', { duration: 3000 });
          console.error('Error deactivating user:', error);
        }
      });
  }

  lockUser(user: UserDto): void {
    const reason = prompt('Enter reason for locking:');
    if (!reason) return;

    const durationStr = prompt('Enter lock duration in minutes (leave empty for indefinite):');
    const durationMinutes = durationStr ? parseInt(durationStr, 10) : undefined;

    this.userService.lockUser(user.userId, { reason, durationMinutes })
      .subscribe({
        next: (result) => {
          if (result.success) {
            this.snackBar.open('User locked successfully', 'Close', { duration: 3000 });
            this.loadUsers();
          } else {
            this.snackBar.open(result.errors.join(', '), 'Close', { duration: 5000 });
          }
        },
        error: (error) => {
          this.snackBar.open('Failed to lock user', 'Close', { duration: 3000 });
          console.error('Error locking user:', error);
        }
      });
  }

  unlockUser(user: UserDto): void {
    this.userService.unlockUser(user.userId)
      .subscribe({
        next: (result) => {
          if (result.success) {
            this.snackBar.open('User unlocked successfully', 'Close', { duration: 3000 });
            this.loadUsers();
          } else {
            this.snackBar.open(result.errors.join(', '), 'Close', { duration: 5000 });
          }
        },
        error: (error) => {
          this.snackBar.open('Failed to unlock user', 'Close', { duration: 3000 });
          console.error('Error unlocking user:', error);
        }
      });
  }

  deleteUser(user: UserDto): void {
    const reason = prompt('Enter reason for deletion:');
    if (!reason) return;

    const hardDelete = confirm('Perform hard delete? (Cannot be recovered)');

    this.userService.deleteUser(user.userId, { reason, hardDelete })
      .subscribe({
        next: () => {
          this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
          this.loadUsers();
        },
        error: (error) => {
          this.snackBar.open('Failed to delete user', 'Close', { duration: 3000 });
          console.error('Error deleting user:', error);
        }
      });
  }

  restoreUser(user: UserDto): void {
    this.userService.restoreUser(user.userId)
      .subscribe({
        next: (result) => {
          if (result.success) {
            this.snackBar.open('User restored successfully', 'Close', { duration: 3000 });
            this.loadUsers();
          } else {
            this.snackBar.open(result.errors.join(', '), 'Close', { duration: 5000 });
          }
        },
        error: (error) => {
          this.snackBar.open('Failed to restore user', 'Close', { duration: 3000 });
          console.error('Error restoring user:', error);
        }
      });
  }

  nextPage(): void {
    if (this.pageNumber() < this.totalPages()) {
      this.pageNumber.update(n => n + 1);
      this.loadUsers();
    }
  }

  previousPage(): void {
    if (this.pageNumber() > 1) {
      this.pageNumber.update(n => n - 1);
      this.loadUsers();
    }
  }
}
