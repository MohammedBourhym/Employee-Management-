import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth/auth.service'; // Adjust the path as necessary
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); 
  const accessToken = authService.getAccessToken(); 
  let authReq = req;

  if (accessToken) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` }
    });
  }

  return next(authReq).pipe(
    catchError(err => {
      if (err.status === 403 && accessToken) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            authReq = req.clone({
              setHeaders: { Authorization: `Bearer ${authService.getAccessToken()}` }
            });
            return next(authReq);
          })
        );
      }
      return throwError(() => err);
    })
  );
};
