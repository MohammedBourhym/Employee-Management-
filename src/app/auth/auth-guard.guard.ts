import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      map((isLoggedIn: boolean) => {
        if (isLoggedIn) {
          return true; // User is logged in, allow access
        } else {
          this.router.navigate(['/login'],{replaceUrl:true}); // Redirect to login if not logged in
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/login'],{replaceUrl:true}); // Redirect to login on error
        return [false];
      })
    );
  }
}
