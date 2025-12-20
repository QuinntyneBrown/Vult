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
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
