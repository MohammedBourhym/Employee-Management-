import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { error } from 'console';

@Injectable({
  providedIn: 'root',
})
export class LogGuard implements CanActivate {
  isLoggedIn?:boolean
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      switchMap((isLoggedIn: boolean) => {
        if (isLoggedIn) {
          return of(true); // User is logged in, allow access
        } else {
          // Token expired or not present, try to refresh token
          return this.authService.refreshToken().pipe(
            switchMap(() => {
              return this.authService.isLoggedIn(); // Check again if refresh worked
            }),
            map((refreshed) => {
              if (refreshed) {
                return true; // Successfully refreshed and logged in
              } else {
                this.router.navigate(['/login']);
                return false; // Failed to refresh or logged out
              }
            }),
            catchError(() => {
              this.router.navigate(['/login']);
              return of(false); // If there's an error, go to login
            })
          );
        }
      })
    );
  }
}


// pipe(
//   tap((logedIn: any) => {
//     console.log(logedIn +'hey')
//     if (!logedIn) {
//       this.router.navigate(['/login'], { replaceUrl: true });
//     }
//   })
// );