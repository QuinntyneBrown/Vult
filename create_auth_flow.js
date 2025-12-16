const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const baseDir = 'c:\\projects\\Vult.worktrees\\worktree-2025-12-16T07-38-34';
const appDir = path.join(baseDir, 'src', 'Vult.App', 'src', 'app');

// Create directory structure
const directories = [
  path.join(appDir, 'core', 'models'),
  path.join(appDir, 'core', 'services'),
  path.join(appDir, 'core', 'guards'),
  path.join(appDir, 'core', 'interceptors'),
  path.join(appDir, 'features', 'auth'),
];

directories.forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
  console.log(`Created: ${dir}`);
});

// File contents
const files = {
  // Models
  [path.join(appDir, 'core', 'models', 'user.ts')]: `export interface User {
  id: string;
  username: string;
  email: string;
}
`,
  
  [path.join(appDir, 'core', 'models', 'login-request.ts')]: `export interface LoginRequest {
  username: string;
  password: string;
}
`,
  
  [path.join(appDir, 'core', 'models', 'login-response.ts')]: `export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
}
`,
  
  [path.join(appDir, 'core', 'models', 'index.ts')]: `export * from './user';
export * from './login-request';
export * from './login-response';
`,
  
  // Services
  [path.join(appDir, 'core', 'services', 'local-storage.service.ts')]: `import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  get<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
`,
  
  [path.join(appDir, 'core', 'services', 'auth.service.ts')]: `import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { LoginRequest, LoginResponse, User } from '../models';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'vult_access_token';
  private readonly REFRESH_TOKEN_KEY = 'vult_refresh_token';
  private readonly API_URL = '/api';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  public isAuthenticated = computed(() => !!this.getAccessToken());

  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorage: LocalStorageService
  ) {
    this.loadCurrentUser();
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(\`\${this.API_URL}/auth/login\`, request)
      .pipe(
        tap(response => {
          this.setTokens(response.accessToken, response.refreshToken);
          this.loadCurrentUser();
        })
      );
  }

  logout(): void {
    this.clearTokens();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getAccessToken(): string | null {
    return this.localStorage.get<string>(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return this.localStorage.get<string>(this.REFRESH_TOKEN_KEY);
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<LoginResponse>(\`\${this.API_URL}/auth/refresh\`, { refreshToken })
      .pipe(
        tap(response => {
          this.setTokens(response.accessToken, response.refreshToken);
        })
      );
  }

  private setTokens(accessToken: string, refreshToken?: string): void {
    this.localStorage.set(this.ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      this.localStorage.set(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  private clearTokens(): void {
    this.localStorage.remove(this.ACCESS_TOKEN_KEY);
    this.localStorage.remove(this.REFRESH_TOKEN_KEY);
  }

  private loadCurrentUser(): void {
    const token = this.getAccessToken();
    if (token) {
      const user = this.parseJwt(token);
      this.currentUserSubject.next(user);
    }
  }

  private parseJwt(token: string): User | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      return {
        id: payload.sub || payload.id,
        username: payload.username || payload.name,
        email: payload.email
      };
    } catch (error) {
      return null;
    }
  }
}
`,
  
  [path.join(appDir, 'core', 'services', 'index.ts')]: `export * from './local-storage.service';
export * from './auth.service';
`,
  
  // Guards
  [path.join(appDir, 'core', 'guards', 'auth.guard.ts')]: `import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};
`,
  
  [path.join(appDir, 'core', 'guards', 'index.ts')]: `export * from './auth.guard';
`,
  
  // Interceptors
  [path.join(appDir, 'core', 'interceptors', 'auth.interceptor.ts')]: `import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  if (token && !req.url.includes('/auth/login')) {
    req = req.clone({
      setHeaders: {
        Authorization: \`Bearer \${token}\`
      }
    });
  }

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401 && !req.url.includes('/auth/refresh')) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            const newToken = authService.getAccessToken();
            const clonedReq = req.clone({
              setHeaders: {
                Authorization: \`Bearer \${newToken}\`
              }
            });
            return next(clonedReq);
          }),
          catchError(refreshError => {
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
`,
  
  [path.join(appDir, 'core', 'interceptors', 'index.ts')]: `export * from './auth.interceptor';
`,
  
  // Auth Feature
  [path.join(appDir, 'features', 'auth', 'login.component.ts')]: `import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.message || 'Login failed. Please try again.');
      }
    });
  }
}
`,
  
  [path.join(appDir, 'features', 'auth', 'login.component.html')]: `<div class="login">
  <div class="login__card">
    <h1 class="login__title">Login</h1>
    
    @if (errorMessage()) {
      <div class="login__error">
        {{ errorMessage() }}
      </div>
    }

    <form class="login__form" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <div class="login__form-group">
        <label for="username" class="login__label">Username</label>
        <input
          id="username"
          type="text"
          formControlName="username"
          class="login__input"
          [class.login__input--invalid]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
        />
      </div>

      <div class="login__form-group">
        <label for="password" class="login__label">Password</label>
        <input
          id="password"
          type="password"
          formControlName="password"
          class="login__input"
          [class.login__input--invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
        />
      </div>

      <button
        type="submit"
        class="login__button"
        [disabled]="loginForm.invalid || isLoading()"
      >
        @if (isLoading()) {
          Logging in...
        } @else {
          Login
        }
      </button>
    </form>
  </div>
</div>
`,
  
  [path.join(appDir, 'features', 'auth', 'login.component.scss')]: `.login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;

  &__card {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }

  &__title {
    margin: 0 0 1.5rem 0;
    color: #333;
    text-align: center;
  }

  &__error {
    background-color: #fee;
    color: #c33;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }

  &__form {
    // Form styles if needed
  }

  &__form-group {
    margin-bottom: 1rem;
  }

  &__label {
    display: block;
    margin-bottom: 0.5rem;
    color: #555;
    font-weight: 500;
  }

  &__input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #4CAF50;
    }

    &--invalid {
      border-color: #c33;
    }
  }

  &__button {
    width: 100%;
    padding: 0.75rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover:not(:disabled) {
      background-color: #45a049;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }
}
`,
  
  [path.join(appDir, 'features', 'auth', 'auth.routes.ts')]: `import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';

export const authRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  }
];
`,
};

// Create files
for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(filepath, content, 'utf-8');
  console.log(`Created: ${filepath}`);
}

console.log('\nAll files created successfully!');
console.log('\nNow updating app.config.ts and app.routes.ts...');

// Update app.config.ts
const appConfigPath = path.join(appDir, 'app.config.ts');
const appConfigContent = `import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
`;
fs.writeFileSync(appConfigPath, appConfigContent, 'utf-8');
console.log(`Updated: ${appConfigPath}`);

// Update app.routes.ts
const appRoutesPath = path.join(appDir, 'app.routes.ts');
const appRoutesContent = `import { Routes } from '@angular/router';
import { authGuard } from './core/guards';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      // Your protected routes go here
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
`;
fs.writeFileSync(appRoutesPath, appRoutesContent, 'utf-8');
console.log(`Updated: ${appRoutesPath}`);

console.log('\n=== All authentication files created! ===');
console.log('\nRunning git commands...\n');

// Git operations
process.chdir(baseDir);

try {
  // Create branch
  execSync('git checkout -b feature/authentication-flow', { stdio: 'inherit' });
  console.log('Created branch: feature/authentication-flow');

  // Add files
  execSync('git add .', { stdio: 'inherit' });
  console.log('Added files to git');

  // Commit
  const commitMessage = 'feat: implement authentication flow\n\n- Add JWT-based authentication service\n- Add auth guard for route protection\n- Add auth interceptor for token injection\n- Add login component with BEM naming\n- Add local storage service\n- Add auth models (User, LoginRequest, LoginResponse)\n- Configure HTTP client with interceptor\n- Add auth routes with lazy loading';
  execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
  console.log('Committed changes');

  // Push
  execSync('git push -u origin feature/authentication-flow', { stdio: 'inherit' });
  console.log('Pushed to remote');

  console.log('\n=== Git operations complete! ===');
  console.log('\nYou can now create a PR using GitHub CLI or web interface.');
} catch (error) {
  console.error('Error during git operations:', error.message);
  console.log('\nFiles have been created. You can run git commands manually.');
}
