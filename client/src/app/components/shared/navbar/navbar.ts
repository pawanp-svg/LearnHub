import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar {
  constructor(private auth: AuthService, private router: Router) {}

  // Reactive computed value (from AuthService signal)
  get isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  get userRole() {
    return this.auth.userRole();
  }

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
