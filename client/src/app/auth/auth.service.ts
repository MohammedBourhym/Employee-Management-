import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  baseUrl = 'http://localhost:3000';
  private accessToken: string | null = null;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.accessToken = this.cookieService.get('jwt');
  }

  ngOnInit(): void {
    this.accessToken = this.cookieService.get('jwt');
    this.isLoggedIn();
  }

  getAccessToken(): string | null {
    return this.accessToken || this.cookieService.get('jwt');
  }

  setAccessToken(token: string) {
    this.accessToken = token;
     console.log(token ,"hey")



    const jwtCookie = this.cookieService.get('jwt');
    console.log('JWT Cookie Value:', jwtCookie,'hey');
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post<any>(`${this.baseUrl}/auth`, credentials, {
      withCredentials: true,
    }).pipe(
      tap((response) => {
        console.log(response.accessToken ," Hey1")
        this.setAccessToken(response.accessToken);
      }),
      catchError((error) => {
        throw new Error('Login failed');
      })
    );
  }

  logout() {
    
    return this.http.get(`${this.baseUrl}/logout`, { withCredentials: true });
  }




  isLoggedIn(): Observable<boolean> {
    const token = this.getAccessToken();
    if (token) {
      return this.http
        .get<boolean>(`${this.baseUrl}/auth/status`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        })
        .pipe(
          catchError(() => {
            return of(false); // If the status check fails, return false
          })
        );
    } else {
      return of(false); // No token, not logged in
    }
  }

  refreshToken() {
    return this.http
      .get<any>(`${this.baseUrl}/refresh`, { withCredentials: true })
      .pipe(
        tap((response) => {
          this.setAccessToken(response.accessToken); // Update token in memory and cookie
        })
      );
  }

  ensureValidToken() {
    if (!this.accessToken) {
      return this.refreshToken(); // If there's no token, refresh the token
    }
    return of(true); // The token is valid if we have one
  }
}
