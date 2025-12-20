// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  UserDto,
  RoleDto,
  CreateUserRequest,
  UpdateUserRequest,
  ActivateUserDto,
  DeactivateUserDto,
  LockUserDto,
  DeleteUserDto,
  GetUsersQueryResult,
  GetUserByIdQueryResult,
  GetUserRolesQueryResult,
  UserCommandResult,
  DeleteUserCommandResult
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = '/api';

  constructor(private http: HttpClient) {}

  getUsers(
    pageNumber: number = 1,
    pageSize: number = 10,
    includeDeleted: boolean = false
  ): Observable<GetUsersQueryResult> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('includeDeleted', includeDeleted.toString());

    return this.http.get<GetUsersQueryResult>(`${this.API_URL}/users`, { params });
  }

  getUserById(userId: string): Observable<GetUserByIdQueryResult> {
    return this.http.get<GetUserByIdQueryResult>(`${this.API_URL}/users/${userId}`);
  }

  getUserRoles(userId: string): Observable<GetUserRolesQueryResult> {
    return this.http.get<GetUserRolesQueryResult>(`${this.API_URL}/users/${userId}/roles`);
  }

  createUser(request: CreateUserRequest): Observable<UserCommandResult> {
    return this.http.post<UserCommandResult>(`${this.API_URL}/users`, request);
  }

  updateUser(userId: string, request: UpdateUserRequest): Observable<UserCommandResult> {
    return this.http.put<UserCommandResult>(`${this.API_URL}/users/${userId}`, request);
  }

  deleteUser(userId: string, request: DeleteUserDto): Observable<DeleteUserCommandResult> {
    return this.http.delete<DeleteUserCommandResult>(`${this.API_URL}/users/${userId}`, {
      body: request
    });
  }

  activateUser(userId: string, request: ActivateUserDto): Observable<UserCommandResult> {
    return this.http.post<UserCommandResult>(`${this.API_URL}/users/${userId}/activate`, request);
  }

  deactivateUser(userId: string, request: DeactivateUserDto): Observable<UserCommandResult> {
    return this.http.post<UserCommandResult>(`${this.API_URL}/users/${userId}/deactivate`, request);
  }

  lockUser(userId: string, request: LockUserDto): Observable<UserCommandResult> {
    return this.http.post<UserCommandResult>(`${this.API_URL}/users/${userId}/lock`, request);
  }

  unlockUser(userId: string): Observable<UserCommandResult> {
    return this.http.post<UserCommandResult>(`${this.API_URL}/users/${userId}/unlock`, {});
  }

  restoreUser(userId: string): Observable<UserCommandResult> {
    return this.http.post<UserCommandResult>(`${this.API_URL}/users/${userId}/restore`, {});
  }

  getRoles(): Observable<RoleDto[]> {
    return this.http.get<RoleDto[]>(`${this.API_URL}/roles`);
  }
}
