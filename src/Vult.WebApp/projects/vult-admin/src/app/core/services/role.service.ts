// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Role, AccessRight } from '../models';

export interface CreateRoleRequest {
  name: string;
  privileges: CreatePrivilegeDto[];
}

export interface CreatePrivilegeDto {
  aggregate: string;
  accessRight: AccessRight;
}

export interface UpdateRoleRequest {
  name: string;
  privileges: UpdatePrivilegeDto[];
}

export interface UpdatePrivilegeDto {
  privilegeId?: string;
  aggregate: string;
  accessRight: AccessRight;
}

export interface GetRolesResponse {
  roles: Role[];
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly API_URL = '/api/role';

  constructor(private http: HttpClient) {}

  getRoles(): Observable<GetRolesResponse> {
    return this.http.get<GetRolesResponse>(this.API_URL);
  }

  getRoleById(roleId: string): Observable<Role> {
    return this.http.get<Role>(`${this.API_URL}/${roleId}`);
  }

  createRole(request: CreateRoleRequest): Observable<Role> {
    return this.http.post<Role>(this.API_URL, request);
  }

  updateRole(roleId: string, request: UpdateRoleRequest): Observable<Role> {
    return this.http.put<Role>(`${this.API_URL}/${roleId}`, request);
  }

  deleteRole(roleId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${roleId}`);
  }
}
