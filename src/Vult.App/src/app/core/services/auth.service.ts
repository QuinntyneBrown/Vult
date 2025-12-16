// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { LoginRequest, LoginResponse, User } from '../models';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'vult_access_token';
  private readonly REFRESH_TOKEN_KEY = 'vult_refresh_token';
  private readonly API_URL = '/api';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  public isAuthenticated = computed(() => !!this.getAccessToken());

  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorage: LocalStorageService
  ) {
    this.loadCurrentUser();
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, request)
      .pipe(
        tap(response => {
          this.setTokens(response.accessToken, response.refreshToken);
          this.loadCurrentUser();
        })
      );
  }

  logout(): void {
    this.clearTokens();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getAccessToken(): string | null {
    return this.localStorage.get<string>(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return this.localStorage.get<string>(this.REFRESH_TOKEN_KEY);
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          this.setTokens(response.accessToken, response.refreshToken);
        })
      );
  }

  private setTokens(accessToken: string, refreshToken?: string): void {
    this.localStorage.set(this.ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      this.localStorage.set(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  private clearTokens(): void {
    this.localStorage.remove(this.ACCESS_TOKEN_KEY);
    this.localStorage.remove(this.REFRESH_TOKEN_KEY);
  }

  private loadCurrentUser(): void {
    const token = this.getAccessToken();
    if (token) {
      const user = this.parseJwt(token);
      this.currentUserSubject.next(user);
    }
  }

  private parseJwt(token: string): User | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      return {
        id: payload.sub || payload.id,
        username: payload.username || payload.name,
        email: payload.email
      };
    } catch (error) {
      return null;
    }
  }
}
