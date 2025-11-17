import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseCardComponent } from '../../components/shared/course-card-component/course-card-component';
import { FooterComponent } from '../../components/shared/footer-component/footer-component';
import { SAMPLE_COURSES, Course } from '../../static/course-data';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Navbar } from '../../components/shared/navbar/navbar';
import { BackgroundSectionComponent } from '../../components/User/background-section-component/background-section-component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth';
import { signal, computed } from '@angular/core';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    Navbar,
    BackgroundSectionComponent,
    CourseCardComponent,
    FooterComponent,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.scss'],
})
export class HomePage {
  // Route-based mode
  pageType: 'home' | 'my-courses' = 'home';

  // Data
  allCourses = SAMPLE_COURSES;
  filteredCourses = signal<Course[]>([]);

  constructor(private route: ActivatedRoute, public auth: AuthService) {
    // react to route data
    this.route.data.subscribe((data) => {
      this.pageType = data['pageType'] ?? 'home';
      this.updateFilteredCourses();
    });
  }

  ngOnInit() {
    this.updateFilteredCourses();
  }

  // ------------------------------------------------
  // FILTER COURSES
  // ------------------------------------------------
  private updateFilteredCourses(): void {
    if (this.pageType === 'my-courses') {
      this.filteredCourses.set(this.allCourses.filter((c) => c.isEnrolled));
    } else {
      this.filteredCourses.set(this.allCourses);
    }
  }

  // Quick reactive getter for template
  isLoggedIn() {
    return this.auth.isLoggedIn();
  }
}
