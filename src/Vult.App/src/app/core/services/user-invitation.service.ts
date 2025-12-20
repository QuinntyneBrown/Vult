// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  UserInvitationDto,
  SendUserInvitationDto,
  AcceptUserInvitationDto,
  GetUserInvitationsQueryResult
} from '../models';
import { UserDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserInvitationService {
  private readonly API_URL = '/api/invitations';

  constructor(private http: HttpClient) {}

  getInvitations(
    pageNumber: number = 1,
    pageSize: number = 10,
    filters?: {
      pendingOnly?: boolean;
      searchTerm?: string;
    }
  ): Observable<GetUserInvitationsQueryResult> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (filters) {
      if (filters.pendingOnly !== undefined) {
        params = params.set('pendingOnly', filters.pendingOnly.toString());
      }
      if (filters.searchTerm) params = params.set('searchTerm', filters.searchTerm);
    }

    return this.http.get<GetUserInvitationsQueryResult>(this.API_URL, { params });
  }

  sendInvitation(dto: SendUserInvitationDto): Observable<{ invitation: UserInvitationDto; success: boolean; errors: string[] }> {
    return this.http.post<{ invitation: UserInvitationDto; success: boolean; errors: string[] }>(
      this.API_URL,
      dto
    );
  }

  acceptInvitation(dto: AcceptUserInvitationDto): Observable<{ user: UserDto; success: boolean; errors: string[] }> {
    return this.http.post<{ user: UserDto; success: boolean; errors: string[] }>(
      `${this.API_URL}/accept`,
      dto
    );
  }

  cancelInvitation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
