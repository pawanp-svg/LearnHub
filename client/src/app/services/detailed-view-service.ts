import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from './auth';
import { Course } from './course-service';

export type UserState = 'NOT_LOGGED_IN' | 'LOGGED_IN_NOT_ENROLLED' | 'ENROLLED';

export interface ApiCourseContent {
  id: number;
  courseId: number;
  title: string;
  content: string;
  order_index: number;
}

export interface ModuleItem {
  id: number;
  title: string;
  orderIndex: number;
  contentLink: string;
  isLocked?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DetailedViewService {
  // ❗ URLs unchanged as requested
  private courseApi = 'http://localhost:5000/api/user';
  private enrollmentApi = 'http://localhost:5000/api/user';
  private contentApi = 'http://localhost:5000/api/admin/courses/content/course';

  // Signals
  course = signal<Course | null>(null);
  rawContent = signal<ApiCourseContent[]>([]);
  modules = signal<ModuleItem[]>([]);
  userStatus = signal<UserState>('NOT_LOGGED_IN');

  loadingCourse = signal(false);
  loadingContent = signal(false);
  enrolling = signal(false);

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  // -------------------------------
  // Preload course before navigation
  // -------------------------------
  setSelectedCourse(course: Course) {
    this.course.set(course);
    this.updateUserStatus();
  }

  // -------------------------------
  // Load full course on refresh
  // -------------------------------
  loadCourseById(id: number): Promise<void> {
    return new Promise((resolve) => {
      this.loadingCourse.set(true);

      this.http.get<Course>(`${this.courseApi}/${id}`).subscribe({
        next: (c) => {
          this.course.set(c);
          this.updateUserStatus(); // ensures isEnrolled sync
          this.loadingCourse.set(false);
          resolve();
        },
        error: () => {
          this.loadingCourse.set(false);
          resolve();
        },
      });
    });
  }

  // -------------------------------
  // Load course content
  // -------------------------------
  loadContentForCourse(courseId: number) {
    this.loadingContent.set(true);

    this.http.get<ApiCourseContent[]>(`${this.contentApi}/${courseId}`).subscribe({
      next: (content) => {
        this.rawContent.set(content);
        this.rebuildModules(); // locking applied here
        this.loadingContent.set(false);
      },
      error: () => {
        this.loadingContent.set(false);
      },
    });
  }

  // -------------------------------
  // Build module list with locking
  // -------------------------------
  rebuildModules() {
    const raw = this.rawContent();
    const enrolled = this.userStatus() === 'ENROLLED';

    const mapped = raw.map((item, index) => ({
      id: item.id,
      title: item.title,
      orderIndex: item.order_index,
      contentLink: item.content,
      isLocked: enrolled ? false : index !== 0,
    }));

    this.modules.set(mapped);
  }

  updateLocksAfterStatusChange() {
    this.rebuildModules();
  }

  // -------------------------------
  // Enroll in course
  // -------------------------------
  enrollInCourse(courseId: number) {
    if (!this.auth.isLoggedIn()) {
      this.snackBar.open('Please log in to enroll in this course.', 'OK', {
        duration: 3000,
      });

      this.router.navigate(['/auth'], {
        queryParams: { returnUrl: `/course/${courseId}` },
      });

      return;
    }

    this.enrolling.set(true);

    this.http.post(`${this.enrollmentApi}/${courseId}/enroll`, {}).subscribe({
      next: () => {
        this.snackBar.open('Successfully enrolled!', 'OK', { duration: 3000 });

        // update local course
        const c = this.course();
        if (c) {
          (c as any).isEnrolled = true;
          this.course.set({ ...c });
        }

        this.updateUserStatus();
        this.enrolling.set(false);
      },
      error: (err) => {
        this.snackBar.open(err?.error?.message || 'Enrollment failed.', 'OK', {
          duration: 3000,
        });
        this.enrolling.set(false);
      },
    });
  }

  // -------------------------------
  // Determine logged-in + enrolled state
  // -------------------------------
  updateUserStatus() {
    const isLogged = this.auth.isLoggedIn();
    const c = this.course();

    if (!isLogged) {
      this.userStatus.set('NOT_LOGGED_IN');
    } else if (c?.isEnrolled) {
      this.userStatus.set('ENROLLED');
    } else {
      this.userStatus.set('LOGGED_IN_NOT_ENROLLED');
    }

    this.updateLocksAfterStatusChange();
  }
}
