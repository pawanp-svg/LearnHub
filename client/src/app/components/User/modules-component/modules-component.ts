import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModuleItem } from '../../../services/detailed-view-service';

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
                <span class="module-index">Module {{ module.orderIndex }}</span>
                <span class="divider">|</span>
                <span class="module-title">{{ module.title }}</span>
              </div>
            </mat-panel-title>
          </mat-expansion-panel-header>

          <div class="video-player-container">
            <iframe
              [src]="getSafeUrl(module.contentLink)"
              frameborder="0"
              allowfullscreen
              class="youtube-frame"
            ></iframe>
          </div>
        </mat-expansion-panel>
        }
      </mat-accordion>
    </div>
  `,
  styleUrls: [`./modules-component.scss`],
})
export class ModulesComponent {
  @Input() content: ModuleItem[] = [];
  @Input() isEnrolled: boolean = false;

  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(url: string): SafeResourceUrl {
    if (url) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return '';
  }
}
