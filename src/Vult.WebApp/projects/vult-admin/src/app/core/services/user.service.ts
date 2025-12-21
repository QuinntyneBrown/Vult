// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, CreateUserRequest, UpdateUserRequest } from '../models';

export interface GetUsersResponse {
  users: User[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = '/api/user';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<GetUsersResponse> {
    return this.http.get<GetUsersResponse>(this.API_URL);
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${userId}`);
  }

  getCurrent(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/current`);
  }

  checkUsernameExists(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.API_URL}/exists/${encodeURIComponent(username)}`);
  }

  createUser(request: CreateUserRequest): Observable<User> {
    return this.http.post<User>(this.API_URL, request);
  }

  updateUser(userId: string, request: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/${userId}`, request);
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${userId}`);
  }

  updatePassword(userId: string, password: string): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/${userId}/password`, { password });
  }

  changePassword(oldPassword: string, newPassword: string, confirmationPassword: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/change-password`, {
      oldPassword,
      newPassword,
      confirmationPassword
    });
  }
}
