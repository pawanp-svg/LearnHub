import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="learnhub-footer">
      <p>&copy; {{ currentYear }} LearnHub, Inc. All rights reserved.</p>
    </footer>
  `,
  styles: [
    `
      .learnhub-footer {
        background-color: #00171f; /* Darkest BG color */
        color: rgba(255, 255, 255, 0.7);
        padding: 20px;
        text-align: center;
        font-size: 0.9rem;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-top: 5px solid #003459; /* Dark Primary accent line */
      }
    `,
  ],
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
}
