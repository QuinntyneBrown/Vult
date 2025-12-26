// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject, combineLatest, map, switchMap, catchError, of, startWith, shareReplay, tap } from 'rxjs';
import { UserService } from '../../core/services';
import { User, CreateUserRequest, UpdateUserRequest } from '../../core/models';
import { UserList } from './components/user-list/user-list';
import { UserEdit } from './components/user-edit/user-edit';

interface UsersViewModel {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  isSaving: boolean;
  isCreating: boolean;
  errorMessage: string | null;
  showEdit: boolean;
}

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
export class Users {
  private _userService = inject(UserService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  private _refreshTrigger$ = new BehaviorSubject<void>(undefined);
  private _isCreating$ = new BehaviorSubject<boolean>(false);
  private _isSaving$ = new BehaviorSubject<boolean>(false);
  private _errorMessage$ = new BehaviorSubject<string | null>(null);
  private _localSelectedUser$ = new BehaviorSubject<User | null>(null);

  private _usersData$ = this._refreshTrigger$.pipe(
    switchMap(() =>
      this._userService.getUsers().pipe(
        map(response => ({
          users: response.users,
          isLoading: false,
          error: null as string | null
        })),
        startWith({
          users: [] as User[],
          isLoading: true,
          error: null as string | null
        }),
        catchError(error => {
          console.error('Error loading users:', error);
          return of({
            users: [] as User[],
            isLoading: false,
            error: error.error?.message || 'Failed to load users'
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

  private _selectedUserFromRoute$ = this._route.params.pipe(
    map(params => params['userId'] as string | undefined),
    switchMap(userId => {
      if (!userId) {
        return of({ user: null as User | null, isLoading: false, error: null as string | null });
      }
      return this._userService.getUserById(userId).pipe(
        map(user => ({ user, isLoading: false, error: null as string | null })),
        startWith({ user: null as User | null, isLoading: true, error: null as string | null }),
        catchError(() => {
          this._router.navigate(['/users']);
          return of({ user: null as User | null, isLoading: false, error: null as string | null });
        })
      );
    }),
    tap(data => {
      if (data.user) {
        this._localSelectedUser$.next(data.user);
        this._isCreating$.next(false);
      } else if (!data.isLoading) {
        this._localSelectedUser$.next(null);
      }
    }),
    shareReplay(1)
  );

  viewModel$ = combineLatest([
    this._usersData$,
    this._selectedUserFromRoute$,
    this._localSelectedUser$,
    this._isCreating$,
    this._isSaving$,
    this._errorMessage$
  ]).pipe(
    map(([usersData, _routeUser, localSelectedUser, isCreating, isSaving, errorMessage]): UsersViewModel => ({
      users: usersData.users,
      selectedUser: localSelectedUser,
      isLoading: usersData.isLoading,
      isSaving: isSaving,
      isCreating: isCreating,
      errorMessage: errorMessage,
      showEdit: localSelectedUser !== null || isCreating
    }))
  );

  onSelectUser(user: User): void {
    this._router.navigate(['/users', user.userId]);
  }

  onCreate(): void {
    this._isCreating$.next(true);
    this._localSelectedUser$.next(null);
  }

  onSave(request: CreateUserRequest | UpdateUserRequest): void {
    this._isSaving$.next(true);
    this._errorMessage$.next(null);

    if (this._isCreating$.value) {
      this._userService.createUser(request as CreateUserRequest).subscribe({
        next: (user) => {
          this._refreshTrigger$.next();
          this._router.navigate(['/users', user.userId]);
          this._isSaving$.next(false);
          this._isCreating$.next(false);
        },
        error: (error) => {
          this._errorMessage$.next(error.error?.message || 'Failed to create user');
          this._isSaving$.next(false);
        }
      });
    } else {
      const selectedUser = this._localSelectedUser$.value;
      if (selectedUser) {
        this._userService.updateUser(selectedUser.userId, request as UpdateUserRequest).subscribe({
          next: (user) => {
            this._refreshTrigger$.next();
            this._localSelectedUser$.next(user);
            this._isSaving$.next(false);
          },
          error: (error) => {
            this._errorMessage$.next(error.error?.message || 'Failed to update user');
            this._isSaving$.next(false);
          }
        });
      }
    }
  }

  onDelete(user: User): void {
    if (confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      this._userService.deleteUser(user.userId).subscribe({
        next: () => {
          this._refreshTrigger$.next();
          this._router.navigate(['/users']);
        },
        error: (error) => {
          this._errorMessage$.next(error.error?.message || 'Failed to delete user');
        }
      });
    }
  }

  onCancel(): void {
    this._isCreating$.next(false);
    this._localSelectedUser$.next(null);
    this._errorMessage$.next(null);
    this._router.navigate(['/users']);
  }
}
