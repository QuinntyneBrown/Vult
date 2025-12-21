// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_BASE_URL } from '../config/api.config';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const apiBaseUrl = inject(API_BASE_URL);

  if (!req.url.startsWith('http://') && !req.url.startsWith('https://')) {
    req = req.clone({
      url: `${apiBaseUrl}${req.url}`
    });
  }

  return next(req);
};
