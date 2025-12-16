import { HttpInterceptorFn } from '@angular/common/http';

const API_BASE_URL = 'https://localhost:7266';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  // Only prepend the base URL for relative requests (non-absolute URLs)
  if (!req.url.startsWith('http://') && !req.url.startsWith('https://')) {
    req = req.clone({
      url: `${API_BASE_URL}${req.url}`
    });
  }

  return next(req);
};
