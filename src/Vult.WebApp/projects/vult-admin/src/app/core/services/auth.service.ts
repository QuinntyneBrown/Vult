// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject, ReplaySubject, map } from 'rxjs';
import { LoginRequest, LoginResponse, User, AccessRight } from '../models';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'vult_admin_access_token';
  private readonly REFRESH_TOKEN_KEY = 'vult_admin_refresh_token';
  private readonly LOGIN_CREDENTIALS_KEY = 'vult_admin_login_credentials';
  private readonly API_URL = '/api';

  private currentUserSubject = new ReplaySubject<User | null>(1);
  public currentUser$ = this.currentUserSubject.asObservable();

  private _isAuthenticated = signal(false);
  public isAuthenticated = computed(() => this._isAuthenticated());

  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorage: LocalStorageService
  ) {
    this.tryToLogin();
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/user/token`, request)
      .pipe(
        tap(response => {
          this.setTokens(response.token, response.refreshToken);
          this._isAuthenticated.set(true);
          this.loadCurrentUser();
        })
      );
  }

  logout(): void {
    this.clearTokens();
    this.currentUserSubject.next(null);
    this._isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  tryToLogin(): void {
    const token = this.getAccessToken();
    if (token) {
      this._isAuthenticated.set(true);
      this.loadCurrentUser();
    } else {
      this.currentUserSubject.next(null);
    }
  }

  getAccessToken(): string | null {
    return this.localStorage.get<string>(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return this.localStorage.get<string>(this.REFRESH_TOKEN_KEY);
  }

  getSavedCredentials(): { username: string; password: string } | null {
    return this.localStorage.get<{ username: string; password: string }>(this.LOGIN_CREDENTIALS_KEY);
  }

  saveCredentials(username: string, password: string): void {
    this.localStorage.set(this.LOGIN_CREDENTIALS_KEY, { username, password });
  }

  clearSavedCredentials(): void {
    this.localStorage.remove(this.LOGIN_CREDENTIALS_KEY);
  }

  hasReadWritePrivileges$(aggregate: string): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => {
        if (!user) return false;
        return this.hasPrivilege(user, aggregate, AccessRight.Read) &&
               this.hasPrivilege(user, aggregate, AccessRight.Write);
      })
    );
  }

  hasPrivilege$(aggregate: string, accessRight: AccessRight): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => user ? this.hasPrivilege(user, aggregate, accessRight) : false)
    );
  }

  private hasPrivilege(user: User, aggregate: string, accessRight: AccessRight): boolean {
    return user.roles.some(role =>
      role.privileges.some(p =>
        p.aggregate === aggregate && p.accessRight === accessRight
      )
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

      // Parse roles from JWT claims
      const roles = this.parseRolesFromPayload(payload);

      return {
        userId: payload.sub || payload[`http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier`],
        username: payload.unique_name || payload[`http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name`] || payload.name,
        roles: roles
      };
    } catch {
      return null;
    }
  }

  private parseRolesFromPayload(payload: any): User['roles'] {
    const roles: User['roles'] = [];
    const roleNames = this.getClaimArray(payload, 'role', 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role');
    const privileges = this.getClaimArray(payload, 'privilege');

    for (const roleName of roleNames) {
      const rolePrivileges = privileges.map(p => this.parsePrivilege(p)).filter(Boolean);
      roles.push({
        roleId: '',
        name: roleName,
        privileges: rolePrivileges as any[]
      });
    }

    return roles;
  }

  private getClaimArray(payload: any, ...keys: string[]): string[] {
    for (const key of keys) {
      const value = payload[key];
      if (value) {
        return Array.isArray(value) ? value : [value];
      }
    }
    return [];
  }

  private parsePrivilege(privilegeString: string): { aggregate: string; accessRight: AccessRight } | null {
    const accessRights = ['Delete', 'Create', 'Write', 'Read', 'None'];
    for (const ar of accessRights) {
      if (privilegeString.startsWith(ar)) {
        return {
          aggregate: privilegeString.substring(ar.length),
          accessRight: AccessRight[ar as keyof typeof AccessRight]
        };
      }
    }
    return null;
  }
}
