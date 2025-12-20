// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserList } from './components/user-list/user-list';
import { UserEdit } from './components/user-edit/user-edit';
import { UserService } from '../../core/services';
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  GetUsersQueryResult,
  GetUserByIdQueryResult,
  UserCommandResult,
  DeleteUserDto
} from '../../core/models';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, UserList, UserEdit, MatIconModule],
  templateUrl: './users.html',
  styleUrls: ['./users.scss']
})
export class Users implements OnInit {
  users = signal<User[]>([]);
  selectedUser = signal<User | null>(null);
  isCreating = signal(false);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);

  pageNumber = signal(1);
  pageSize = signal(20);
  totalCount = signal(0);
  totalPages = computed(() => Math.ceil(this.totalCount() / this.pageSize()));

  showEdit = computed(() => this.selectedUser() !== null || this.isCreating());

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();

    this.route.paramMap.subscribe(params => {
      const userId = params.get('userId');
      if (userId) {
        this.loadUserForEditing(userId);
      }
    });
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.userService.getUsers(this.pageNumber(), this.pageSize()).subscribe({
      next: (response: GetUsersQueryResult) => {
        this.users.set(response.users);
        this.totalCount.set(response.totalCount);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Failed to load users');
        this.isLoading.set(false);
        console.error('Error loading users:', error);
      }
    });
  }

  loadUserForEditing(userId: string): void {
    this.isLoading.set(true);
    this.userService.getUserById(userId).subscribe({
      next: (response: GetUserByIdQueryResult) => {
        if (response.found && response.user) {
          this.selectedUser.set(response.user);
        } else {
          this.errorMessage.set('User not found');
        }
        this.isCreating.set(false);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Failed to load user');
        this.isLoading.set(false);
        console.error('Error loading user:', error);
      }
    });
  }

  onSelectUser(user: User): void {
    this.selectedUser.set(user);
    this.isCreating.set(false);
    this.router.navigate(['/users', user.userId]);
  }

  onCreate(): void {
    this.selectedUser.set(null);
    this.isCreating.set(true);
  }

  onCancel(): void {
    this.selectedUser.set(null);
    this.isCreating.set(false);
    this.router.navigate(['/users']);
  }

  onSave(data: CreateUserRequest | UpdateUserRequest): void {
    this.isSaving.set(true);
    this.errorMessage.set(null);

    if (this.isCreating()) {
      this.userService.createUser(data as CreateUserRequest).subscribe({
        next: (result: UserCommandResult) => {
          if (result.success && result.user) {
            this.users.update(users => [result.user!, ...users]);
            this.selectedUser.set(null);
            this.isCreating.set(false);
            this.router.navigate(['/users']);
          } else {
            this.errorMessage.set(result.errors?.join(', ') || 'Failed to create user');
          }
          this.isSaving.set(false);
        },
        error: (error) => {
          this.errorMessage.set(error.error?.message || 'Failed to create user');
          this.isSaving.set(false);
        }
      });
    } else if (this.selectedUser()) {
      this.userService.updateUser(this.selectedUser()!.userId, data as UpdateUserRequest).subscribe({
        next: (result: UserCommandResult) => {
          if (result.success && result.user) {
            const updatedUser = result.user;
            this.users.update(users =>
              users.map(u => u.userId === updatedUser.userId ? updatedUser : u)
            );
            this.selectedUser.set(null);
            this.router.navigate(['/users']);
          } else {
            this.errorMessage.set(result.errors?.join(', ') || 'Failed to update user');
          }
          this.isSaving.set(false);
        },
        error: (error) => {
          this.errorMessage.set(error.error?.message || 'Failed to update user');
          this.isSaving.set(false);
        }
      });
    }
  }

  onDelete(userId: string): void {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    const deleteRequest: DeleteUserDto = {
      reason: 'Deleted by admin',
      hardDelete: false
    };

    this.userService.deleteUser(userId, deleteRequest).subscribe({
      next: () => {
        this.users.update(users => users.filter(u => u.userId !== userId));
        if (this.selectedUser()?.userId === userId) {
          this.selectedUser.set(null);
          this.router.navigate(['/users']);
        }
      },
      error: (error) => {
        this.errorMessage.set('Failed to delete user');
        console.error('Error deleting user:', error);
      }
    });
  }

  onPageChange(page: number): void {
    this.pageNumber.set(page);
    this.loadUsers();
  }
}
