// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  UserDto,
  GetUsersQueryResult,
  UpdateUserDto,
  ActivateUserDto,
  DeactivateUserDto,
  LockUserDto,
  DeleteUserDto,
  GetUserRolesQueryResult
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = '/api/users';

  constructor(private http: HttpClient) {}

  getUsers(
    pageNumber: number = 1,
    pageSize: number = 10,
    filters?: {
      status?: string;
      searchTerm?: string;
      sortBy?: string;
    }
  ): Observable<GetUsersQueryResult> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.searchTerm) params = params.set('searchTerm', filters.searchTerm);
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    }

    return this.http.get<GetUsersQueryResult>(this.API_URL, { params });
  }

  getUserById(id: string): Observable<{ user: UserDto; found: boolean }> {
    return this.http.get<{ user: UserDto; found: boolean }>(`${this.API_URL}/${id}`);
  }

  getUserRoles(id: string): Observable<GetUserRolesQueryResult> {
    return this.http.get<GetUserRolesQueryResult>(`${this.API_URL}/${id}/roles`);
  }

  updateUser(id: string, dto: UpdateUserDto): Observable<{ user: UserDto; success: boolean; errors: string[] }> {
    return this.http.put<{ user: UserDto; success: boolean; errors: string[] }>(
      `${this.API_URL}/${id}`,
      dto
    );
  }

  activateUser(id: string, dto: ActivateUserDto): Observable<{ user: UserDto; success: boolean; errors: string[] }> {
    return this.http.post<{ user: UserDto; success: boolean; errors: string[] }>(
      `${this.API_URL}/${id}/activate`,
      dto
    );
  }

  deactivateUser(id: string, dto: DeactivateUserDto): Observable<{ user: UserDto; success: boolean; errors: string[] }> {
    return this.http.post<{ user: UserDto; success: boolean; errors: string[] }>(
      `${this.API_URL}/${id}/deactivate`,
      dto
    );
  }

  lockUser(id: string, dto: LockUserDto): Observable<{ user: UserDto; success: boolean; errors: string[] }> {
    return this.http.post<{ user: UserDto; success: boolean; errors: string[] }>(
      `${this.API_URL}/${id}/lock`,
      dto
    );
  }

  unlockUser(id: string): Observable<{ user: UserDto; success: boolean; errors: string[] }> {
    return this.http.post<{ user: UserDto; success: boolean; errors: string[] }>(
      `${this.API_URL}/${id}/unlock`,
      {}
    );
  }

  deleteUser(id: string, dto: DeleteUserDto): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`, { body: dto });
  }

  restoreUser(id: string): Observable<{ user: UserDto; success: boolean; errors: string[] }> {
    return this.http.post<{ user: UserDto; success: boolean; errors: string[] }>(
      `${this.API_URL}/${id}/restore`,
      {}
    );
  }
}
