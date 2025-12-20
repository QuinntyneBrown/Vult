// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { HttpInterceptorFn } from '@angular/common/http';

const API_BASE_URL = 'https://localhost:7266';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('http://') && !req.url.startsWith('https://')) {
    req = req.clone({
      url: `${API_BASE_URL}${req.url}`
    });
  }

  return next(req);
};
