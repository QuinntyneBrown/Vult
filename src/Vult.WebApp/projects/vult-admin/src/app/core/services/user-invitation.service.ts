// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  UserInvitationDto,
  SendUserInvitationDto,
  AcceptUserInvitationDto,
  GetUserInvitationsQueryResult,
  SendUserInvitationCommandResult,
  AcceptUserInvitationCommandResult,
  CancelUserInvitationCommandResult
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserInvitationService {
  private readonly API_URL = '/api';

  constructor(private http: HttpClient) {}

  getInvitations(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<GetUserInvitationsQueryResult> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<GetUserInvitationsQueryResult>(`${this.API_URL}/invitations`, { params });
  }

  getInvitationById(invitationId: string): Observable<UserInvitationDto> {
    return this.http.get<UserInvitationDto>(`${this.API_URL}/invitations/${invitationId}`);
  }

  sendInvitation(request: SendUserInvitationDto): Observable<SendUserInvitationCommandResult> {
    return this.http.post<SendUserInvitationCommandResult>(`${this.API_URL}/invitations`, request);
  }

  acceptInvitation(request: AcceptUserInvitationDto): Observable<AcceptUserInvitationCommandResult> {
    return this.http.post<AcceptUserInvitationCommandResult>(`${this.API_URL}/invitations/accept`, request);
  }

  cancelInvitation(invitationId: string): Observable<CancelUserInvitationCommandResult> {
    return this.http.post<CancelUserInvitationCommandResult>(
      `${this.API_URL}/invitations/${invitationId}/cancel`,
      {}
    );
  }

  resendInvitation(invitationId: string): Observable<SendUserInvitationCommandResult> {
    return this.http.post<SendUserInvitationCommandResult>(
      `${this.API_URL}/invitations/${invitationId}/resend`,
      {}
    );
  }
}
