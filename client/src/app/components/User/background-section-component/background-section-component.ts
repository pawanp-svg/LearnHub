import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-background-section',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterLink],
  template: `
    <div class="hero-container">
      <div class="hero-content">
        <h1 class="hero-title">Advance Your Future with Proven Learning.</h1>
        <p class="hero-subtitle">
          Learn from expert instructors, develop practical competencies, and take the next step
          toward lasting professional success.
        </p>
        <div class="cta-group">
          <button mat-flat-button class="cta-button primary-cta" routerLink="/auth">
            Get Started
          </button>
        </div>
      </div>

      <!-- Placeholder for inspired visual -->
      <div class="hero-visual">
        <mat-icon class="visual-icon blue-icon">verified_user</mat-icon>
        <mat-icon class="visual-icon accent-icon">lightbulb</mat-icon>
      </div>
    </div>
  `,
  styles: [
    `
      .hero-container {
        background-color: #003459; /* Primary Dark */
        height: 400px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #ffffff;
        padding: 0 80px;
        overflow: hidden;
        position: relative;
      }
      .hero-content {
        max-width: 50%;
        z-index: 10;
        text-align: left;
      }
      .hero-title {
        font-size: 3.2rem;
        margin-bottom: 15px;
        font-weight: 800;
        line-height: 1.2;
      }
      .hero-subtitle {
        font-size: 1.1rem;
        margin-bottom: 30px;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 300;
      }
      .cta-button {
        margin-right: 15px;
        padding: 10px 15px;
        font-size: 1rem;
        font-weight: 450;
        border-radius: 4px;
      }
      .primary-cta {
        background-color: #007ea7; /* Accent */
        color: #ffffff;
        box-shadow: 0 4px 6px rgba(0, 126, 167, 0.4);
      }
      .primary-cta:hover {
        background-color: #005980;
      }
      .secondary-cta {
        background-color: transparent;
        color: #ffffff;
        border: 2px solid #ffffff;
      }

      /* Inspired Visuals */
      .hero-visual {
        position: absolute;
        right: 50px;
        top: 0;
        bottom: 0;
        width: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .visual-icon {
        font-size: 150px;
        opacity: 0.15;
        position: absolute;
      }
      .blue-icon {
        color: #007ea7;
        transform: rotate(-10deg) translate(-50px, -20px);
      }
      .accent-icon {
        color: #005980;
        transform: rotate(15deg) translate(50px, 30px);
      }

      @media (max-width: 992px) {
        .hero-container {
          height: 350px;
          padding: 40px 20px;
          flex-direction: column;
          text-align: center;
        }
        .hero-content {
          max-width: 100%;
          text-align: center;
        }
        .hero-title {
          font-size: 2.5rem;
        }
        .hero-visual {
          display: none;
        }
      }
    `,
  ],
})
export class BackgroundSectionComponent {}
