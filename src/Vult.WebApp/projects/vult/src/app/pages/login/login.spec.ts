// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Login } from './login';
import { AuthService } from '../../core/services';
import { of, throwError } from 'rxjs';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceSpy: jest.Mocked<AuthService>;

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
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations(),
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with username and password fields', () => {
    expect(component.loginForm.contains('username')).toBeTruthy();
    expect(component.loginForm.contains('password')).toBeTruthy();
  });

  it('should require username', () => {
    const usernameControl = component.loginForm.get('username');
    usernameControl?.setValue('');
    expect(usernameControl?.valid).toBeFalsy();
  });

  it('should require password', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('');
    expect(passwordControl?.valid).toBeFalsy();
  });

  it('should not submit when form is invalid', () => {
    component.loginForm.setValue({ username: '', password: '' });
    component.onSubmit();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should call authService.login when form is valid', fakeAsync(() => {
    authServiceSpy.login.mockReturnValue(of({ accessToken: 'test-token' }));

    component.loginForm.setValue({ username: 'testuser', password: 'password123' });
    component.onSubmit();
    tick();

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123'
    });
  }));

  it('should set error message on login failure', fakeAsync(() => {
    authServiceSpy.login.mockReturnValue(
      throwError(() => ({ error: { message: 'Invalid credentials' } }))
    );

    component.loginForm.setValue({ username: 'testuser', password: 'wrongpass' });
    component.onSubmit();
    tick();

    expect(component.errorMessage()).toBe('Invalid credentials');
  }));

  it('should set isLoading during login', fakeAsync(() => {
    authServiceSpy.login.mockReturnValue(of({ accessToken: 'test-token' }));

    component.loginForm.setValue({ username: 'testuser', password: 'password123' });
    component.onSubmit();

    expect(component.isLoading()).toBe(true);
    tick();
    expect(component.isLoading()).toBe(false);
  }));
});
