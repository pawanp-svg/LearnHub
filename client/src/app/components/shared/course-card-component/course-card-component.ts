import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Course } from '../../../services/course-service';
import { AuthService } from '../../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { CourseService } from '../../../services/course-service';
import { MatDialog } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { DeleteConfirmDialogComponent } from '../../Admin/delete-confirm-dialog/delete-confirm-dialog';
import { CreateCourseDialogComponent } from '../../Admin/create-course-dialog/create-course-dialog';
import { DetailedViewService } from '../../../services/detailed-view-service';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterLink,
    MatListModule,
  ],
  template: `
    <mat-card class="course-card">
      <!-- STUDENT: ENROLLED BADGE -->
      @if (course.isEnrolled && userRole === 'Student') {
      <div class="enrolled-badge" title="Enrolled">
        <mat-icon>check_circle</mat-icon>
      </div>
      }

      <!-- ADMIN MENU -->
      @if(userRole==='Admin') {
      <button mat-icon-button [matMenuTriggerFor]="menu" class="menu-btn">
        <mat-icon>more_vert</mat-icon>
      </button>

      <mat-menu #menu="matMenu">
        <button mat-menu-item (click)="toggleStatus(course)">
          {{ course.status === 'Draft' ? 'Publish' : 'Unpublish' }}
        </button>

        <button mat-menu-item (click)="editCourse(course.id)">Edit</button>

        <button mat-menu-item (click)="deleteCourse(course.id)">Delete</button>
      </mat-menu>
      }

      <!-- THUMBNAIL / FALLBACK ICON -->
      <div class="card-image-container">
        @if (course.thumbnailUrl) {
        <img [src]="course.thumbnailUrl" alt="{{ course.course_name }}" class="course-thumbnail" />
        } @else {
        <mat-icon class="image-icon">school</mat-icon>
        }
      </div>

      <!-- CONTENT -->
      <div class="card-content-area">
        <h3 class="course-title">{{ course.course_name }}</h3>
        <p class="course-description">{{ course.description }}</p>

        <div class="card-footer">
          <span class="course-price">{{ course.price | currency : 'INR' }}</span>

          <!-- ADMIN BUTTON -->
          @if (userRole === 'Admin') {
          <button mat-flat-button class="details-button">
            {{ course.totalEnrollments }} | Enrollments
          </button>
          }

          <!-- STUDENT: NOT LOGGED IN -->
          @if (!isLoggedIn) {
          <button mat-flat-button class="details-button" routerLink="/auth">Start Learning</button>
          }

          <!-- STUDENT: LOGGED IN & NOT ENROLLED -->
          @if (isLoggedIn && userRole==='Student' && !course.isEnrolled) {
          <button mat-flat-button class="details-button" (click)="goToCourse()">
            Start Learning
          </button>
          }

          <!-- STUDENT: LOGGED IN & ENROLLED -->
          @if (isLoggedIn && userRole==='Student' && course.isEnrolled) {
          <button mat-flat-button class="details-button enrolled-btn" (click)="goToCourse()">
            Continue Learning
          </button>
          }
        </div>
      </div>
    </mat-card>
  `,
  styles: [
    `
      .course-card {
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        display: flex;
        flex-direction: column;
        padding: 0;
        position: relative;
        overflow: hidden;
      }

      .course-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 10px 30px rgba(0, 52, 89, 0.25);
      }

      .menu-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 15;
        color: white;
      }

      /* ENROLLED BADGE */
      .enrolled-badge {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 15;
        color: #fff;
      }

      /* IMAGE / THUMBNAIL */
      .card-image-container {
        width: 100%;
        height: 140px;
        background-color: #005980;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        position: relative;
      }

      .course-thumbnail {
        width: 100%;
        height: 100%;
        object-fit: cover; /* 🔥 PERFECT FIT */
        object-position: center;
      }

      .image-icon {
        font-size: 60px;
        color: #ffc300;
      }

      /* CONTENT AREA */
      .card-content-area {
        padding: 0 16px 16px;
        display: flex;
        flex-direction: column;
      }

      .course-title {
        font-size: 1.25rem;
        font-weight: 800;
        color: #003459;
        margin: 8px 0;
        -webkit-line-clamp: 1;
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
      }

      .course-description {
        font-size: 0.95rem;
        color: #555;
        margin-bottom: 10px;
        -webkit-line-clamp: 2;
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
      }

      .card-footer {
        margin-top: auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 12px;
        border-top: 1px solid #eee;
      }

      .course-price {
        font-size: 1.3rem;
        font-weight: 900;
        color: #003459;
      }

      .details-button {
        background-color: #007ea7;
        color: white;
        font-weight: 500;
        border-radius: 4px;
      }

      .details-button:hover {
        background-color: #005980;
      }

      .enrolled-btn {
        background-color: #4caf50 !important;
      }
    `,
  ],
})
export class CourseCardComponent {
  menuOpen: boolean = false;
  isLoggedIn = false;
  userRole: string | null = null;

  @Input({ required: true }) course!: Course;

  constructor(
    private auth: AuthService,
    private router: Router,
    private courseService: CourseService,
    private dialog: MatDialog,
    private detailedView: DetailedViewService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.auth.isLoggedIn();
    this.userRole = this.auth.getUserRole();
  }

  goToCourse() {
    this.detailedView.setSelectedCourse(this.course);
    this.router.navigate(['/course', this.course.id]);
  }

  toggleStatus(course: Course) {
    const newStatus = course.status === 'Draft' ? 'Published' : 'Draft';
    this.courseService.updateStatus(course.id, newStatus).subscribe(() => {
      course.status = newStatus;
    });
  }

  deleteCourse(id: number) {
    const ref = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '350px',
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      this.courseService.deleteCourse(id).subscribe(() => {
        this.courseService.loadCourses();
      });
    });
  }

  editCourse(id: number) {
    this.router.navigate(['/admin/edit-course', id]);
  }
}
