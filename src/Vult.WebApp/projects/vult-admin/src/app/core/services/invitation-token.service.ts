// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InvitationToken {
  invitationTokenId: string;
  value: string;
  expiry?: string;
  type: InvitationTokenType;
}

export enum InvitationTokenType {
  Standard = 1
}

export interface CreateInvitationTokenRequest {
  value: string;
  expiry?: string;
  type: InvitationTokenType;
}

export interface UpdateInvitationTokenRequest {
  value?: string;
  expiry?: string;
}

export interface GetInvitationTokensResponse {
  invitationTokens: InvitationToken[];
}

@Injectable({
  providedIn: 'root'
})
export class InvitationTokenService {
  private readonly API_URL = '/api/invitation-token';

  constructor(private http: HttpClient) {}

  getInvitationTokens(): Observable<GetInvitationTokensResponse> {
    return this.http.get<GetInvitationTokensResponse>(this.API_URL);
  }

  getInvitationTokenById(invitationTokenId: string): Observable<InvitationToken> {
    return this.http.get<InvitationToken>(`${this.API_URL}/${invitationTokenId}`);
  }

  createInvitationToken(request: CreateInvitationTokenRequest): Observable<InvitationToken> {
    return this.http.post<InvitationToken>(this.API_URL, request);
  }

  updateInvitationToken(invitationTokenId: string, request: UpdateInvitationTokenRequest): Observable<InvitationToken> {
    return this.http.put<InvitationToken>(`${this.API_URL}/${invitationTokenId}`, request);
  }

  deleteInvitationToken(invitationTokenId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${invitationTokenId}`);
  }
}
