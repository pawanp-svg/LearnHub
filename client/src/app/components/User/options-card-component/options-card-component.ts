import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Course } from '../../../static/course-data'; // Ensure this path is correct

// Defined user states for clarity
type UserState = 'NOT_LOGGED_IN' | 'LOGGED_IN_NOT_ENROLLED' | 'ENROLLED';

@Component({
  selector: 'app-options-card-component',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <mat-card class="options-card">
      <div class="card-image-wrapper">
        <img
          [src]="course.thumbnailUrl"
          alt="{{ course.name }} Thumbnail"
          class="course-thumbnail"
        />
      </div>

      <div class="price-group">
        <span class="price-tag">{{ course.price | currency : 'USD' }}</span>
      </div>

      <div class="cta-buttons">
        <!-- Scenario 3: Logged In and Enrolled -->
        @if (userStatus === 'ENROLLED') {
        <button mat-flat-button class="cta-button enrolled-button" disabled>
          <mat-icon>check</mat-icon> Enrolled
        </button>
        } @else {
        <!-- Scenario 1 & 2: Not Enrolled -->
        <button mat-flat-button class="cta-button primary-cta">Buy now</button>
        <button mat-stroked-button class="cta-button secondary-cta">Add to cart</button>
        }
      </div>

      <!-- Money Back Guarantee -->
    </mat-card>
  `,
  styles: [
    `
      .options-card {
        padding: 0;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 80px; /* Offset below the sticky navbar */
      }
      .card-image-wrapper {
        position: relative;
        cursor: pointer;
        overflow: hidden;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }
      .course-thumbnail {
        width: 100%;
        height: auto;
        display: block;
      }
      .video-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.4);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-weight: 600;
        transition: background-color 0.3s;
      }
      .video-overlay:hover {
        background-color: rgba(0, 0, 0, 0.6);
      }
      .play-icon {
        font-size: 60px;
        width: 60px;
        height: 60px;
        margin-bottom: 5px;
      }
      .preview-text {
        font-size: 1.1rem;
      }

      /* Price and CTA Group */
      .price-group {
        padding: 15px 20px;
        text-align: center;
        border-bottom: 1px solid #eee;
      }
      .price-tag {
        font-size: 2.5rem;
        font-weight: 600;
        color: #003459;
        display: block;
        margin-bottom: 5px;
      }
      .subscription-text {
        color: #555;
        font-size: 0.9rem;
      }
      .cta-buttons {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .cta-button {
        width: 100%;
        height: 48px;
        font-weight: 700;
        border-radius: 4px;
      }
      .primary-cta {
        background-color: #007ea7; /* Accent Blue */
        color: #ffffff;
      }
      .primary-cta:hover {
        background-color: #005980;
      }
      .secondary-cta,
      .enrolled-button {
        border: 1px solid #005980;
        color: #005980;
        background-color: #ffffff;
      }
      .enrolled-button {
        background-color: #efefef;
        color: #555;
      }
      .guarantee-text {
        text-align: center;
        font-size: 0.85rem;
        color: #555;
        padding-bottom: 20px;
      }
    `,
  ],
})
export class OptionsCardComponent {
  // Added 'export' here
  @Input({ required: true }) course!: Course;
  @Input() userStatus: UserState = 'NOT_LOGGED_IN';
}
