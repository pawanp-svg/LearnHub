import { Component, signal, OnInit } from '@angular/core';
import {
  CommonModule,
  NgIf,
  NgFor,
  CurrencyPipe,
  DecimalPipe,
  DatePipe,
  PercentPipe,
  TitleCasePipe,
  LowerCasePipe,
  UpperCasePipe,
  I18nPluralPipe,
  I18nSelectPipe,
  KeyValuePipe,
  AsyncPipe,
  SlicePipe,
  JsonPipe,
} from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { OptionsCardComponent } from '../../../components/User/options-card-component/options-card-component';
import { ModulesComponent } from '../../../components/User/modules-component/modules-component';
import {
  SAMPLE_COURSES,
  COURSE_CONTENT_DATA,
  Course,
  CourseContent,
} from '../../../static/course-data';
import { Navbar } from '../../../components/shared/navbar/navbar';

// Define user states for demonstration
type UserState = 'NOT_LOGGED_IN' | 'LOGGED_IN_NOT_ENROLLED' | 'ENROLLED';

@Component({
  selector: 'app-course-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    OptionsCardComponent,
    ModulesComponent,
    NgIf,
    NgFor,
    CurrencyPipe,
    DecimalPipe,
    DatePipe,
    PercentPipe,
    TitleCasePipe,
    LowerCasePipe,
    UpperCasePipe,
    I18nPluralPipe,
    I18nSelectPipe,
    KeyValuePipe,
    AsyncPipe,
    SlicePipe,
    JsonPipe,
    Navbar,
  ],
  template: `
    <app-navbar></app-navbar>
    <div class="detail-page-container">
      <div class="content-wrapper">
        <div class="main-content">
          <div class="course-header-block">
            <h1 class="course-title">{{ course.name }}</h1>
            <p class="course-description">{{ course.description }}</p>

            <div class="course-meta">
              <span class="learners">{{ learners | number }} learners</span>
            </div>
          </div>

          <app-modules-component
            [content]="courseContent"
            [isEnrolled]="userStatus() === 'ENROLLED'"
          >
          </app-modules-component>
        </div>

        <div class="sidebar">
          <app-options-card-component [course]="course" [userStatus]="userStatus()">
          </app-options-card-component>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .detail-page-container {
        background-color: #f8f8f8;
        min-height: 100vh;
        padding-top: 20px; /* Space below the assumed fixed navbar */
      }
      .content-wrapper {
        display: grid;
        grid-template-columns: 2.5fr 1fr; /* Main Content (left) vs Sidebar (right) */
        gap: 30px;
        max-width: 1300px;
        margin: 0 auto;
        padding: 0 40px 60px;
      }
      .main-content {
        /* Left Column */
      }
      .sidebar {
        /* Right Column */
      }

      /* Course Header Block */
      .breadcrumb {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        color: #007ea7;
        font-size: 0.9rem;
      }
      .path-item {
        margin: 0 5px;
        font-weight: 500;
      }
      .course-header-block {
        background-color: #ffffff;
        padding: 30px;
        border-radius: 8px;
        margin-bottom: 20px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      }
      .course-title {
        font-size: 2.5rem;
        font-weight: 800;
        color: #003459;
        margin-bottom: 10px;
      }
      .course-description {
        font-size: 1.1rem;
        color: #555;
        margin-bottom: 15px;
      }
      .course-meta {
        display: flex;
        align-items: center;
        gap: 15px;
        font-size: 0.95rem;
      }
      .bestseller-badge {
        background-color: #ffc300; /* Complementary Gold */
        color: #00171f;
        padding: 4px 8px;
        border-radius: 3px;
        font-weight: 600;
      }
      .rating {
        color: #005980;
        font-weight: 600;
      }

      /* What You'll Learn */
      .section-header {
        font-size: 1.5rem;
        font-weight: 700;
        color: #003459;
        margin-bottom: 15px;
      }
      .what-you-learn-section {
        background-color: #ffffff;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      }
      .learning-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
      }
      .learning-item {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        font-size: 1rem;
        color: #333;
      }
      .learning-item mat-icon {
        color: #007ea7;
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      @media (max-width: 992px) {
        .content-wrapper {
          grid-template-columns: 1fr;
          padding: 0 20px 40px;
        }
        .sidebar {
          order: -1; /* Move card to the top on mobile */
        }
      }
    `,
  ],
})
export class CourseDetailPage implements OnInit {
  // --- SCENARIO MANAGEMENT ---

  // Define scenarios for easy testing
  SCENARIO_MAP: { status: UserState }[] = [
    { status: 'NOT_LOGGED_IN' },
    { status: 'LOGGED_IN_NOT_ENROLLED' },
    { status: 'ENROLLED' },
  ];

  // Use this index to switch scenarios (0, 1, or 2)
  scenarioIndex = 2; // <<--- CHANGE THIS VALUE TO TEST DIFFERENT SCENARIOS

  // --- DATA ---
  course: Course = SAMPLE_COURSES[0];
  courseContent: CourseContent[] = COURSE_CONTENT_DATA;
  learners: number = 235925;

  // Reactive state based on scenarioIndex
  userStatus = signal<UserState>('NOT_LOGGED_IN');

  ngOnInit() {
    this.updateScenario(this.scenarioIndex);
  }

  updateScenario(index: number) {
    const scenario = this.SCENARIO_MAP[index];
    if (scenario) {
      this.userStatus.set(scenario.status);
      this.updateContentLocking(scenario.status);
    }
  }

  updateContentLocking(status: UserState) {
    // If enrolled, all are unlocked (isLocked is false). If not enrolled, only the first is unlocked (preview).
    const isEnrolled = status === 'ENROLLED';

    this.courseContent = this.courseContent.map((item, index) => ({
      ...item,
      // Unlock all if enrolled. If not enrolled, unlock only the first item (index 0) for preview.
      isLocked: isEnrolled ? false : index !== 0,
    }));
  }
  isLoggedIn = signal(false);
  allCourses = SAMPLE_COURSES;
  filteredCourses = signal<Course[]>([]);

  constructor() {
    this.updateFilteredCourses(this.isLoggedIn());
  }

  toggleLogin(status: boolean) {
    this.isLoggedIn.set(status);
    this.updateFilteredCourses(status);
  }

  private updateFilteredCourses(isLoggedIn: boolean): void {
    // FIX: Always show all courses (SAMPLE_COURSES) on the main dashboard.
    // The filtering logic for 'My Courses' will happen on a separate route/page.
    this.filteredCourses.set(this.allCourses);
  }
}
