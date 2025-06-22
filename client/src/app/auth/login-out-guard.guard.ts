import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LogGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      map((isLoggedIn) => {
        if (isLoggedIn) {
          // If logged in, do not activate the login route and stay on the current route
          return false;  // Prevent activation of the login route
        }
        return true;  // Allow access to the login page if not logged in
      }),
      catchError(() => {
        return of(false);  // If error occurs, prevent activation of the route
      })
    );
  }
}
