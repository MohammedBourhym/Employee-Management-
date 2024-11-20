import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginError: string = '';
  subscription!: Subscription;
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^([a-zA-Z0-9]+)@([a-zA-Z0-9]+).([a-zA-Z]{2,3})$'),
        ],
      ],
      password: ['', Validators.required],
    });
  }

  
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        console.log('Login response:', response);
        this.router.navigate(['/events'], { replaceUrl: true });
      },
      error: (error) => {
        console.error('Login error:', error);
        this.loginError = 'Invalid credentials. Please try again.';
        this.loading = false;
      },
    });
  }
}
