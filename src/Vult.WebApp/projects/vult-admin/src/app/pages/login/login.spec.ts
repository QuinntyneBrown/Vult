// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Login } from './login';
import { AuthService } from '../../core/services';
import { of, throwError } from 'rxjs';

describe('Login (Admin)', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceSpy: jest.Mocked<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = {
      login: jest.fn(),
      logout: jest.fn(),
      getAccessToken: jest.fn(),
      getRefreshToken: jest.fn(),
      refreshToken: jest.fn(),
      isAuthenticated: jest.fn().mockReturnValue(false),
      currentUser$: of(null)
    } as unknown as jest.Mocked<AuthService>;

    await TestBed.configureTestingModule({
      imports: [Login, ReactiveFormsModule],
      providers: [
        provideRouter([{ path: 'products', component: Login }]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations(),
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have validation for username minimum length', () => {
    const usernameControl = component.loginForm.get('username');
    usernameControl?.setValue('ab');
    expect(usernameControl?.hasError('minlength')).toBeTruthy();
  });

  it('should have validation for password minimum length', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('12345');
    expect(passwordControl?.hasError('minlength')).toBeTruthy();
  });

  it('should navigate to products on successful login', fakeAsync(() => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    authServiceSpy.login.mockReturnValue(of({ accessToken: 'test-token' }));

    component.loginForm.setValue({ username: 'adminuser', password: 'password123' });
    component.onSubmit();
    tick();

    expect(navigateSpy).toHaveBeenCalledWith(['/products']);
  }));

  it('should display error message on login failure', fakeAsync(() => {
    authServiceSpy.login.mockReturnValue(
      throwError(() => ({ error: { message: 'Access denied' } }))
    );

    component.loginForm.setValue({ username: 'admin', password: 'wrongpass' });
    component.onSubmit();
    tick();

    fixture.detectChanges();
    expect(component.errorMessage()).toBe('Access denied');
  }));
});
