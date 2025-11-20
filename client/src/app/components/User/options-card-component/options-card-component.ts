import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Course } from '../../../services/course-service';
import { UserState } from '../../../services/detailed-view-service';

@Component({
  selector: 'app-options-card-component',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <mat-card class="options-card">
      <div class="card-image-wrapper">
        <img
          [src]="course.thumbnailUrl"
          alt="{{ course.course_name }} Thumbnail"
          class="course-thumbnail"
        />
      </div>

      <div class="price-group">
        <span class="price-tag">{{ course.price | currency : 'INR' }}</span>
      </div>

      <div class="cta-buttons">
        @if (userStatus === 'ENROLLED') {
        <button mat-flat-button class="cta-button enrolled-button" disabled>
          <mat-icon>check</mat-icon> Enrolled
        </button>
        } @else {
        <button mat-flat-button class="cta-button primary-cta" (click)="onPrimaryClick()">
          Start learning
        </button>
        <button mat-stroked-button class="cta-button secondary-cta">Add to cart</button>
        }
      </div>
    </mat-card>
  `,
  styleUrls: [`./options-card-component.scss`],
})
export class OptionsCardComponent {
  @Input({ required: true }) course!: Course;
  @Input() userStatus: UserState = 'NOT_LOGGED_IN';

  @Output() enroll = new EventEmitter<void>();

  onPrimaryClick() {
    // parent (CourseDetailPage) will decide: enroll or redirect to login
    this.enroll.emit();
  }
}
