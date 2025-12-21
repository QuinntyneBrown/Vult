// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject } from 'rxjs';
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
  users$ = new BehaviorSubject<User[]>([]);
  selectedUser$ = new BehaviorSubject<User | null>(null);
  isLoading$ = new BehaviorSubject<boolean>(false);
  isSaving$ = new BehaviorSubject<boolean>(false);
  isCreating$ = new BehaviorSubject<boolean>(false);
  errorMessage$ = new BehaviorSubject<string | null>(null);

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
        this.selectedUser$.next(null);
        this.isCreating$.next(false);
      }
    });
  }

  loadUsers(): void {
    this.isLoading$.next(true);
    this.userService.getUsers().subscribe({
      next: (response) => {
        this.users$.next(response.users);
        this.isLoading$.next(false);
      },
      error: (error) => {
        this.errorMessage$.next(error.error?.message || 'Failed to load users');
        this.isLoading$.next(false);
      }
    });
  }

  loadUser(userId: string): void {
    this.isLoading$.next(true);
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.selectedUser$.next(user);
        this.isLoading$.next(false);
      },
      error: () => {
        this.router.navigate(['/users']);
        this.isLoading$.next(false);
      }
    });
  }

  onSelectUser(user: User): void {
    this.router.navigate(['/users', user.userId]);
  }

  onCreate(): void {
    this.isCreating$.next(true);
    this.selectedUser$.next(null);
  }

  onSave(request: CreateUserRequest | UpdateUserRequest): void {
    this.isSaving$.next(true);
    this.errorMessage$.next(null);

    if (this.isCreating$.value) {
      this.userService.createUser(request as CreateUserRequest).subscribe({
        next: (user) => {
          this.loadUsers();
          this.router.navigate(['/users', user.userId]);
          this.isSaving$.next(false);
          this.isCreating$.next(false);
        },
        error: (error) => {
          this.errorMessage$.next(error.error?.message || 'Failed to create user');
          this.isSaving$.next(false);
        }
      });
    } else if (this.selectedUser$.value) {
      this.userService.updateUser(this.selectedUser$.value!.userId, request as UpdateUserRequest).subscribe({
        next: (user) => {
          this.loadUsers();
          this.selectedUser$.next(user);
          this.isSaving$.next(false);
        },
        error: (error) => {
          this.errorMessage$.next(error.error?.message || 'Failed to update user');
          this.isSaving$.next(false);
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
          this.errorMessage$.next(error.error?.message || 'Failed to delete user');
        }
      });
    }
  }

  onCancel(): void {
    this.isCreating$.next(false);
    this.selectedUser$.next(null);
    this.errorMessage$.next(null);
    this.router.navigate(['/users']);
  }
}
