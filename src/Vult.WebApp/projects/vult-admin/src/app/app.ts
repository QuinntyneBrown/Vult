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
  Product: 'Product',
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
  // Privilege check observables for conditional UI rendering
  canAccessProducts$: Observable<boolean>;
  canAccessUsers$: Observable<boolean>;

  constructor(public authService: AuthService) {
    // Set up privilege-based observables for navigation items
    this.canAccessProducts$ = this.authService.hasReadWritePrivileges$(Aggregates.Product);
    this.canAccessUsers$ = this.authService.hasReadWritePrivileges$(Aggregates.User);
  }

  logout(): void {
    this.authService.logout();
  }
}
