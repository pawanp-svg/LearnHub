import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API_URL = 'http://localhost:5000/api/auth';

  private _isLoggedIn = signal<boolean>(this.hasToken());
  isLoggedIn = this._isLoggedIn.asReadonly();

  private _user = signal<any>(this.loadUser());
  user = this._user.asReadonly();

  constructor(private http: HttpClient, private router: Router) {}

  // ---- Helpers ----------------------------------------------------

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private loadUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

    userRole(): string | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user)?.role : null;
  }
  // ---- Register ---------------------------------------------------

  register(data: { email: string; password: string; first_name: string; last_name: string }) {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data);
  }

  // ---- Login ------------------------------------------------------

  login(data: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, data);
  }

  // ---- Handle Login Success ---------------------------------------

  handleAuthSuccess(res: AuthResponse) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));

    this._isLoggedIn.set(true);
    this._user.set(res.user);

    this.router.navigate(['/']);
  }

  // ---- Logout -----------------------------------------------------

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this._isLoggedIn.set(false);
    this._user.set(null);

    this.router.navigate(['/']);
  }
}
