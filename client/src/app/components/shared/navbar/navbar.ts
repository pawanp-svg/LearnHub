import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { CourseService } from '../../../services/course-service';
import { CreateCourseDialogComponent } from '../../Admin/create-course-dialog/create-course-dialog';

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
    MatDialogModule,
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar {
  constructor(
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private courseService: CourseService
  ) {}

  get isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  get userRole() {
    return this.auth.getUserRole();
  }

  onLogout() {
    this.courseService.reset();
    this.auth.logout();
    this.router.navigate(['/']);
  }

  openCreateCourse() {
    this.dialog
      .open(CreateCourseDialogComponent, {
        width: '700px',
        data: { mode: 'create' },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) this.courseService.loadCourses();
      });
  }
}
