// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../core/services';
import { User, CreateUserRequest, UpdateUserRequest } from '../../core/models';
import { UserList } from './components/user-list/user-list';
import { UserEdit } from './components/user-edit/user-edit';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    UserList,
    UserEdit
  ],
  templateUrl: './users.html',
  styleUrls: ['./users.scss']
})
export class Users implements OnInit {
  users = signal<User[]>([]);
  selectedUser = signal<User | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  isCreating = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadUsers();

    this.route.params.subscribe(params => {
      const userId = params['userId'];
      if (userId) {
        this.loadUser(userId);
      } else {
        this.selectedUser.set(null);
        this.isCreating.set(false);
      }
    });
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.userService.getUsers().subscribe({
      next: (response) => {
        this.users.set(response.users);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Failed to load users');
        this.isLoading.set(false);
      }
    });
  }

  loadUser(userId: string): void {
    this.isLoading.set(true);
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.selectedUser.set(user);
        this.isLoading.set(false);
      },
      error: () => {
        this.router.navigate(['/users']);
        this.isLoading.set(false);
      }
    });
  }

  onSelectUser(user: User): void {
    this.router.navigate(['/users', user.userId]);
  }

  onCreate(): void {
    this.isCreating.set(true);
    this.selectedUser.set(null);
  }

  onSave(request: CreateUserRequest | UpdateUserRequest): void {
    this.isSaving.set(true);
    this.errorMessage.set(null);

    if (this.isCreating()) {
      this.userService.createUser(request as CreateUserRequest).subscribe({
        next: (user) => {
          this.loadUsers();
          this.router.navigate(['/users', user.userId]);
          this.isSaving.set(false);
          this.isCreating.set(false);
        },
        error: (error) => {
          this.errorMessage.set(error.error?.message || 'Failed to create user');
          this.isSaving.set(false);
        }
      });
    } else if (this.selectedUser()) {
      this.userService.updateUser(this.selectedUser()!.userId, request as UpdateUserRequest).subscribe({
        next: (user) => {
          this.loadUsers();
          this.selectedUser.set(user);
          this.isSaving.set(false);
        },
        error: (error) => {
          this.errorMessage.set(error.error?.message || 'Failed to update user');
          this.isSaving.set(false);
        }
      });
    }
  }

  onDelete(user: User): void {
    if (confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      this.userService.deleteUser(user.userId).subscribe({
        next: () => {
          this.loadUsers();
          this.router.navigate(['/users']);
        },
        error: (error) => {
          this.errorMessage.set(error.error?.message || 'Failed to delete user');
        }
      });
    }
  }

  onCancel(): void {
    this.isCreating.set(false);
    this.selectedUser.set(null);
    this.errorMessage.set(null);
    this.router.navigate(['/users']);
  }
}
