// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let localStorageServiceSpy: jest.Mocked<LocalStorageService>;
  let router: Router;

  beforeEach(() => {
    localStorageServiceSpy = {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn()
    } as jest.Mocked<LocalStorageService>;

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: LocalStorageService, useValue: localStorageServiceSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call login endpoint and store tokens', fakeAsync(() => {
    const mockResponse = {
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token'
    };

    service.login({ username: 'testuser', password: 'password' }).subscribe();

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'testuser', password: 'password' });

    req.flush(mockResponse);
    tick();

    expect(localStorageServiceSpy.set).toHaveBeenCalledWith('vult_access_token', 'test-access-token');
    expect(localStorageServiceSpy.set).toHaveBeenCalledWith('vult_refresh_token', 'test-refresh-token');
  }));

  it('should return access token from localStorage', () => {
    localStorageServiceSpy.get.mockReturnValue('stored-token');
    expect(service.getAccessToken()).toBe('stored-token');
  });

  it('should clear tokens and navigate on logout', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    service.logout();

    expect(localStorageServiceSpy.remove).toHaveBeenCalledWith('vult_access_token');
    expect(localStorageServiceSpy.remove).toHaveBeenCalledWith('vult_refresh_token');
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should call refresh token endpoint', fakeAsync(() => {
    localStorageServiceSpy.get.mockReturnValue('old-refresh-token');
    const mockResponse = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token'
    };

    service.refreshToken().subscribe();

    const req = httpMock.expectOne('/api/auth/refresh');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ refreshToken: 'old-refresh-token' });

    req.flush(mockResponse);
    tick();

    expect(localStorageServiceSpy.set).toHaveBeenCalledWith('vult_access_token', 'new-access-token');
  }));
});
