import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginOutGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    return true
  }
}
