import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormGroup,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

// --- Custom Validator for Password Confirmation ---
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  return password && confirmPassword && password.value !== confirmPassword.value
    ? { mismatch: true }
    : null;
}

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
  ],
  templateUrl: './auth-page.html', // Your template stays the same
  styleUrls: ['./auth-page.scss'], // Your styles stay the same
})
export class AuthPage {
  // --- State ---
  viewMode = signal<'login' | 'register'>('login');
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.registerForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator }
    );
  }

  toggleView() {
    this.errorMessage.set(null);
    this.loading.set(false);
    this.loginForm.reset();
    this.registerForm.reset();

    this.viewMode.update((v) => (v === 'login' ? 'register' : 'login'));
  }

  // -----------------------------------------------------
  // LOGIN LOGIC
  // -----------------------------------------------------
  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.value;

    this.auth.login({ email, password }).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.auth.handleAuthSuccess(res); // Stores token + user + redirect
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Invalid email or password.');
      },
    });
  }

  // -----------------------------------------------------
  // REGISTER LOGIC
  // -----------------------------------------------------
  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { firstName, lastName, email, password } = this.registerForm.value;

    this.auth
      .register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.viewMode.set('login'); // go to login after successful registration
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.error?.message || 'Registration failed.');
        },
      });
  }
}
