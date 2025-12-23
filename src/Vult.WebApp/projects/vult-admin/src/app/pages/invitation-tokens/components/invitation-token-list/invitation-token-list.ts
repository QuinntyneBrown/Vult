// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { InvitationToken } from '../../../../core/services/invitation-token.service';

@Component({
  selector: 'app-invitation-token-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './invitation-token-list.html',
  styleUrls: ['./invitation-token-list.scss']
})
export class InvitationTokenList {
  invitationTokens = input<InvitationToken[]>([]);
  selectedTokenId = input<string | null>(null);
  isLoading = input(false);

  selectToken = output<InvitationToken>();
  create = output<void>();
  delete = output<InvitationToken>();

  onSelectToken(token: InvitationToken): void {
    this.selectToken.emit(token);
  }

  onCreate(): void {
    this.create.emit();
  }

  onDelete(event: Event, token: InvitationToken): void {
    event.stopPropagation();
    this.delete.emit(token);
  }

  isExpired(token: InvitationToken): boolean {
    if (!token.expiry) return false;
    return new Date(token.expiry) < new Date();
  }
}
