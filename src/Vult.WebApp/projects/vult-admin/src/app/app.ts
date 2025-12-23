// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { Observable } from 'rxjs';
import { AuthService } from './core/services';

// Aggregate names for privilege checks
export const Aggregates = {
  User: 'User',
  Role: 'Role',
  CatalogItem: 'CatalogItem',
  InvitationToken: 'InvitationToken'
} as const;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // Privilege check observables for conditional UI rendering (REQ-FE-AUTHZ-004)
  canAccessCatalogItems$: Observable<boolean>;
  canAccessUsers$: Observable<boolean>;
  canAccessRoles$: Observable<boolean>;
  canAccessInvitationTokens$: Observable<boolean>;

  constructor(public authService: AuthService) {
    // Set up privilege-based observables for navigation items
    this.canAccessCatalogItems$ = this.authService.hasReadWritePrivileges$(Aggregates.CatalogItem);
    this.canAccessUsers$ = this.authService.hasReadWritePrivileges$(Aggregates.User);
    this.canAccessRoles$ = this.authService.hasReadWritePrivileges$(Aggregates.Role);
    this.canAccessInvitationTokens$ = this.authService.hasReadWritePrivileges$(Aggregates.InvitationToken);
  }

  logout(): void {
    this.authService.logout();
  }
}
