// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject } from 'rxjs';
import {
  InvitationTokenService,
  InvitationToken,
  CreateInvitationTokenRequest,
  UpdateInvitationTokenRequest
} from '../../core/services/invitation-token.service';
import { InvitationTokenList } from './components/invitation-token-list/invitation-token-list';
import { InvitationTokenEdit } from './components/invitation-token-edit/invitation-token-edit';

@Component({
  selector: 'app-invitation-tokens',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    InvitationTokenList,
    InvitationTokenEdit
  ],
  templateUrl: './invitation-tokens.html',
  styleUrls: ['./invitation-tokens.scss']
})
export class InvitationTokens implements OnInit {
  invitationTokens$ = new BehaviorSubject<InvitationToken[]>([]);
  selectedToken$ = new BehaviorSubject<InvitationToken | null>(null);
  isLoading$ = new BehaviorSubject<boolean>(false);
  isSaving$ = new BehaviorSubject<boolean>(false);
  isCreating$ = new BehaviorSubject<boolean>(false);
  errorMessage$ = new BehaviorSubject<string | null>(null);

  constructor(
    private invitationTokenService: InvitationTokenService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadInvitationTokens();

    this.route.params.subscribe(params => {
      const invitationTokenId = params['invitationTokenId'];
      if (invitationTokenId) {
        this.loadInvitationToken(invitationTokenId);
      } else {
        this.selectedToken$.next(null);
        this.isCreating$.next(false);
      }
    });
  }

  loadInvitationTokens(): void {
    this.isLoading$.next(true);
    this.invitationTokenService.getInvitationTokens().subscribe({
      next: (response) => {
        this.invitationTokens$.next(response.invitationTokens);
        this.isLoading$.next(false);
      },
      error: (error) => {
        this.errorMessage$.next(error.error?.message || 'Failed to load invitation tokens');
        this.isLoading$.next(false);
      }
    });
  }

  loadInvitationToken(invitationTokenId: string): void {
    this.isLoading$.next(true);
    this.invitationTokenService.getInvitationTokenById(invitationTokenId).subscribe({
      next: (token) => {
        this.selectedToken$.next(token);
        this.isLoading$.next(false);
      },
      error: () => {
        this.router.navigate(['/invitation-tokens']);
        this.isLoading$.next(false);
      }
    });
  }

  onSelectToken(token: InvitationToken): void {
    this.router.navigate(['/invitation-tokens', token.invitationTokenId]);
  }

  onCreate(): void {
    this.isCreating$.next(true);
    this.selectedToken$.next(null);
  }

  onSave(request: CreateInvitationTokenRequest | UpdateInvitationTokenRequest): void {
    this.isSaving$.next(true);
    this.errorMessage$.next(null);

    if (this.isCreating$.value) {
      this.invitationTokenService.createInvitationToken(request as CreateInvitationTokenRequest).subscribe({
        next: (token) => {
          this.loadInvitationTokens();
          this.router.navigate(['/invitation-tokens', token.invitationTokenId]);
          this.isSaving$.next(false);
          this.isCreating$.next(false);
        },
        error: (error) => {
          this.errorMessage$.next(error.error?.message || 'Failed to create invitation token');
          this.isSaving$.next(false);
        }
      });
    } else if (this.selectedToken$.value) {
      this.invitationTokenService.updateInvitationToken(
        this.selectedToken$.value!.invitationTokenId,
        request as UpdateInvitationTokenRequest
      ).subscribe({
        next: (token) => {
          this.loadInvitationTokens();
          this.selectedToken$.next(token);
          this.isSaving$.next(false);
        },
        error: (error) => {
          this.errorMessage$.next(error.error?.message || 'Failed to update invitation token');
          this.isSaving$.next(false);
        }
      });
    }
  }

  onDelete(token: InvitationToken): void {
    if (confirm(`Are you sure you want to delete this invitation token?`)) {
      this.invitationTokenService.deleteInvitationToken(token.invitationTokenId).subscribe({
        next: () => {
          this.loadInvitationTokens();
          this.router.navigate(['/invitation-tokens']);
        },
        error: (error) => {
          this.errorMessage$.next(error.error?.message || 'Failed to delete invitation token');
        }
      });
    }
  }

  onCancel(): void {
    this.isCreating$.next(false);
    this.selectedToken$.next(null);
    this.errorMessage$.next(null);
    this.router.navigate(['/invitation-tokens']);
  }
}
