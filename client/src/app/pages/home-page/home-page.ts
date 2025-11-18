import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseCardComponent } from '../../components/shared/course-card-component/course-card-component';
import { FooterComponent } from '../../components/shared/footer-component/footer-component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Navbar } from '../../components/shared/navbar/navbar';
import { BackgroundSectionComponent } from '../../components/User/background-section-component/background-section-component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CourseService, Course } from '../../services/course-service';

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
    RouterLink,
  ],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.scss'],
})
export class HomePage {
  pageType: 'home' | 'my-courses' = 'home';

  // Backend-driven data (signal)
  get courses() {
    return this.courseService.courses;
  }

  // Filtered list for template
  filteredCourses = signal<Course[]>([]);

  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    public auth: AuthService,
    private courseService: CourseService
  ) {
    // When route changes (home → my-courses)
    this.route.data.subscribe((data) => {
      this.pageType = data['pageType'] ?? 'home';
      this.applyFilter();
    });
  }

  async ngOnInit() {
    this.loading.set(true);

    await this.courseService.loadCourses(); // auto-selects endpoint based on role
    this.applyFilter();

    this.loading.set(false);
  }

  // ------------------------------------------------
  // FILTER COURSES BASED ON ROUTE MODE
  // ------------------------------------------------
  private applyFilter() {
    const all = this.courses();

    if (this.pageType === 'my-courses') {
      // Only Student role can have enrolled list
      if (this.auth.getUserRole() === 'Student') {
        this.filteredCourses.set(all.filter((c) => c.isEnrolled));
      } else {
        // Admin → empty list (no enrolled concept)
        this.filteredCourses.set([]);
      }
    } else {
      // Home → show all courses
      this.filteredCourses.set(all);
    }
  }

  isLoggedIn() {
    return this.auth.isLoggedIn();
  }
}
