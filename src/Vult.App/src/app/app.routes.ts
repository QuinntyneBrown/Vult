import { Routes } from '@angular/router';
import { authGuard } from './core/guards';
import { Login } from './pages/login/login';
import { CatalogList } from './pages/catalog-list/catalog-list';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: Login
      }
    ]
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'catalog',
        component: CatalogList
      },
      {
        path: '',
        redirectTo: 'catalog',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
