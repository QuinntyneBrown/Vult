// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Routes } from '@angular/router';
import { authGuard } from './core/guards';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'catalog-items',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/catalog-items/catalog-items').then(m => m.CatalogItems)
  },
  {
    path: 'catalog-items/:catalogItemId',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/catalog-items/catalog-items').then(m => m.CatalogItems)
  },
  {
    path: 'users',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/users/users').then(m => m.Users)
  },
  {
    path: 'users/:userId',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/users/users').then(m => m.Users)
  },
  {
    path: 'roles',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/roles/roles').then(m => m.Roles)
  },
  {
    path: 'roles/:roleId',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/roles/roles').then(m => m.Roles)
  },
  {
    path: 'invitation-tokens',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/invitation-tokens/invitation-tokens').then(m => m.InvitationTokens)
  },
  {
    path: 'invitation-tokens/:invitationTokenId',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/invitation-tokens/invitation-tokens').then(m => m.InvitationTokens)
  },
  {
    path: 'change-password',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/change-password/change-password').then(m => m.ChangePassword)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
