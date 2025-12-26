// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  lastPath: string = '/';
  loginUrl: string = '/login';
  defaultWorkspacePath: string = '/products';

  constructor(private router: Router) {}

  redirectToLogin(): void {
    this.router.navigate([this.loginUrl]);
  }

  redirectPreLogin(): void {
    const path = this.lastPath && this.lastPath !== '/' ? this.lastPath : this.defaultWorkspacePath;
    this.router.navigate([path]);
  }

  redirectToPublicDefault(): void {
    this.router.navigate(['/']);
  }

  setLastPath(path: string): void {
    this.lastPath = path;
  }
}
