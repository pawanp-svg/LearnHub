import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CourseContent } from '../../../static/course-data';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-modules-component',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatIconModule, MatButtonModule],
  template: `
    <div class="course-content-container">
      <h2 class="content-header">Course content</h2>

      <mat-accordion multi>
        @for (module of content; track module.orderIndex) {
        <mat-expansion-panel
          class="module-panel"
          [disabled]="module.isLocked && !isEnrolled"
          hideToggle
        >
          <mat-expansion-panel-header>
            <mat-panel-title>
              <div class="module-title-group">
                <div class="icon-wrap">
                  @if (module.isLocked && !isEnrolled) {
                  <mat-icon class="lock-icon">lock</mat-icon>
                  } @else {
                  <mat-icon class="play-icon">play_circle_outline</mat-icon>
                  }
                </div>
                <span class="module-index">Module {{ module.orderIndex }} </span>
                <span class="divider">|</span>
                <span class="module-title">{{ module.title }}</span>
              </div>
            </mat-panel-title>
          </mat-expansion-panel-header>

          <!-- Content Panel (YouTube Video) -->
          <div class="video-player-container">
            <iframe
              [src]="getSafeUrl(module.contentLink)"
              frameborder="0"
              allowfullscreen
              class="youtube-frame"
            >
            </iframe>
          </div>
        </mat-expansion-panel>
        }
      </mat-accordion>
    </div>
  `,
  styles: [
    `
      .course-content-container {
        margin-top: 40px;
        border: 1px solid #ddd;
        border-radius: 10px;
        padding: 22px;
        background-color: #ffffff;
      }

      .content-header {
        font-size: 1.7rem;
        font-weight: 700;
        color: #003459;
        margin-bottom: 18px;
      }

      .module-panel {
        border-bottom: 1px solid #eee !important;
        transition: background 0.15s ease-in-out;
      }

      .module-panel:hover {
        background: #fafcff;
      }

      mat-expansion-panel-header {
        padding: 14px 6px !important;
        min-height: 58px !important;
      }

      .module-title-group {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .module-title {
        font-size: 1rem;
        font-weight: 600;
        color: #00171f;
      }

      .lecture-type {
        color: #666;
        font-size: 0.9rem;
        font-weight: 500;
      }

      .icon-wrap {
        padding-left: 6px; /* space before icon */
        display: flex;
        align-items: center;
      }

      .lock-icon,
      .play-icon {
        font-size: 30px !important; /* bigger icon */
        width: 30px;
        height: 30px;
      }

      .lock-icon {
        color: #005980;
      }

      .play-icon {
        color: #007ea7;
      }

      .video-player-container {
        padding: 12px 0 18px 0;
      }

      .youtube-frame {
        width: 100%;
        height: 320px;
        border-radius: 8px;
      }
    `,
  ],
})
export class ModulesComponent {
  @Input() content: CourseContent[] = [];
  @Input() isEnrolled: boolean = false;

  // Inject DomSanitizer to handle YouTube video URLs safely
  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(url: string): SafeResourceUrl {
    // Only sanitize if a URL exists
    if (url) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return '';
  }
}
