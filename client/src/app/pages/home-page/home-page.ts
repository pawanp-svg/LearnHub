import { Component, effect, signal } from '@angular/core';
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

  filteredCourses = signal<Course[]>([]);
  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    public auth: AuthService,
    private courseService: CourseService
  ) {
    // 🔥 Only react AFTER login/logout changes (not page load)
    effect(() => {
      const trigger = this.auth.authStateChanged();
      this.reloadCourses();
    });

    // 🔥 Handle route change (home → my-courses)
    this.route.data.subscribe((data) => {
      this.pageType = data['pageType'] ?? 'home';
      this.applyFilter();
    });
  }

  // 🔥 One unified course reload logic
  private async reloadCourses() {
    this.loading.set(true);

    await this.courseService.loadCourses();
    this.applyFilter();

    this.loading.set(false);
  }

  // 🔥 Load on first page load
  async ngOnInit() {
    await this.reloadCourses();
  }

  get userRole() {
    return this.auth.getUserRole();
  }
  get courses() {
    return this.courseService.courses;
  }

  // ------------------------------------------------
  // FILTER COURSES BASED ON ROUTE MODE
  // ------------------------------------------------
  private applyFilter() {
    const all = this.courses();

    if (this.pageType === 'my-courses') {
      if (this.auth.getUserRole() === 'Student') {
        this.filteredCourses.set(all.filter((c) => c.isEnrolled));
      } else {
        this.filteredCourses.set([]); // admin has no "my courses"
      }
    } else {
      this.filteredCourses.set(all); // home page
    }
  }

  isLoggedIn() {
    return this.auth.isLoggedIn();
  }
}
