import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Course } from '../../../services/course-service';
import { AuthService } from '../../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatMenuModule, RouterLink],
  template: `
    <mat-card class="course-card">
      @if (course.isEnrolled && userRole === 'Student') {
      <div class="enrolled-badge" title="Enrolled">
        <mat-icon>check_circle</mat-icon>
      </div>
      } @if(userRole==='Admin') {
      <button mat-icon-button [matMenuTriggerFor]="menu" class="menu-btn">
        <mat-icon>more_vert</mat-icon>
      </button>

      <mat-menu #menu="matMenu">
        <button mat-menu-item>Publish</button>
        <button mat-menu-item>Edit</button>
        <button mat-menu-item>Delete</button>
      </mat-menu>
      }

      <div class="card-image-container">
        <mat-icon class="image-icon">school</mat-icon>
      </div>

      <div class="card-content-area">
        <h3 class="course-title">{{ course.course_name }}</h3>
        <p class="course-description">{{ course.description }}</p>

        <div class="card-footer">
          <span class="course-price">{{ course.price | currency : 'USD' }}</span>
          <button mat-flat-button class="details-button" *ngIf="userRole === 'Admin'">
            Enrollments
          </button>

          <!-- STUDENT: NOT LOGGED IN -->
          <button mat-flat-button class="details-button" *ngIf="!isLoggedIn" routerLink="/auth">
            Start Learning
          </button>

          <!-- STUDENT: LOGGED IN + NOT ENROLLED -->
          <button
            mat-flat-button
            class="details-button"
            *ngIf="isLoggedIn && userRole === 'Student' && !course.isEnrolled"
            (click)="goToCourse()"
          >
            Start Learning
          </button>

          <!-- STUDENT: LOGGED IN + ENROLLED -->
          <button
            mat-flat-button
            class="details-button enrolled-btn"
            *ngIf="isLoggedIn && userRole === 'Student' && course.isEnrolled"
            (click)="goToCourse()"
          >
            Continue Learning
          </button>
        </div>
      </div>
    </mat-card>
  `,
  styles: [
    `
      .course-card {
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease;
        display: flex;
        flex-direction: column;
        padding: 0;
        position: relative;
        overflow: hidden;
        height: auto;
      }
      .menu-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 10;
      }
      .course-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 10px 30px rgba(0, 52, 89, 0.2); /* Dark Blue Shadow on Hover */
      }

      /* Enrollment Badge */
      .enrolled-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        color: #ffffffff; /* Accent */
        z-index: 10;
      }
      .enrolled-badge mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      /* Image Section */
      .card-image-container {
        height: 140px;
        background-color: #005980; /* Primary Light BG */
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
        position: relative;
      }
      .image-icon {
        font-size: 60px;
        width: 60px;
        height: 60px;
        color: #ffc300; /* Soft Gold/Yellow Highlight */
      }

      /* Content Area */
      .card-content-area {
        padding: 0 16px 16px;
        display: flex;
        flex-direction: column;
        flex: 1;
      }
      .course-title {
        font-size: 1.25rem;
        font-weight: 800;
        color: #003459;
        line-height: 1.3;
        margin: 0 0 5px 0;

        display: -webkit-box;
        -webkit-line-clamp: 1; /* 🔥 force the title to 1 line */
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .course-instructor {
        font-size: 0.9rem;
        color: #007ea7;
        margin-bottom: 10px;

        display: -webkit-box;
        -webkit-line-clamp: 1; /* 🔥 1 line only */
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .course-description {
        font-size: 0.95rem;
        color: #555;
        margin-bottom: 15px;
        flex: 1;

        display: -webkit-box;
        -webkit-line-clamp: 2; /* 🔥 keep 2 lines */
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 15px;
        border-top: 1px solid #efefef; /* Soft Gray separator */
      }
      .course-price {
        font-size: 1.3rem;
        font-weight: 900;
        color: #003459;
      }
      .details-button {
        background-color: #007ea7; /* Accent */
        color: #ffffff;
        font-weight: 500;
        border-radius: 4px;
      }
      .details-button:hover {
        background-color: #005980;
      }
    `,
  ],
})
export class CourseCardComponent {
  isLoggedIn = false;
  userRole: string | null = null;
  @Input({ required: true }) course!: Course;
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.isLoggedIn = this.auth.isLoggedIn();
    this.userRole = this.auth.getUserRole();
  }

  learningHandler() {
    this;
  }

  goToCourse() {}

  isStudent() {
    return this.auth.loadUser() === 'Student';
  }

  isEnrolled() {
    return !!this.course.isEnrolled;
  }
}
