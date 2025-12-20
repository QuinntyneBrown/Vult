// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Routes } from '@angular/router';
import { authGuard } from './core/guards';
import { Login } from './pages/login/login';
import { CatalogList } from './pages/catalog-list/catalog-list';
import { UserList } from './pages/user-list/user-list';
import { Home } from './pages';

export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: 'home',
    component: Home
  },
  {
    path: 'catalog',
    canActivate: [authGuard],
    component: CatalogList
  },
  {
    path: 'users',
    canActivate: [authGuard],
    component: UserList
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
