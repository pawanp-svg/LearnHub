import { effect, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth';
import { firstValueFrom, tap } from 'rxjs';

export interface Course {
  id: number;
  course_name: string;
  description?: string;
  price?: number;
  thumbnailUrl?: string;
  status?: string;
  isEnrolled?: boolean;
  totalEnrollments?: number;
}

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private API = 'http://localhost:5000/api';

  private _courses = signal<Course[]>([]);
  public courses = this._courses.asReadonly();

  constructor(private http: HttpClient, private auth: AuthService) {
    // 🔥 React to global login/logout changes
    effect(() => {
      const _trigger = this.auth.authStateChanged(); // ensures detection
      this.handleAuthStateChange();
    });
  }

  // ==========================================================================
  // 🔥 MAIN ENTRY: Handle login / logout globally
  // ==========================================================================
  private async handleAuthStateChange() {
    const loggedIn = this.auth.isLoggedIn();
    const role = this.auth.getUserRole();

    // Clear old data always
    this._courses.set([]);

    if (!loggedIn) {
      // Guest / logged-out → load public course list
      await this.loadPublicCourses();
    } else {
      // Logged in → load correct course list by role
      await this.loadCourses();
    }
  }

  // ==========================================================================
  // 🔥 Load correct courses based on role
  // ==========================================================================
  async loadCourses() {
    const isLoggedIn = this.auth.isLoggedIn();
    const role = this.auth.getUserRole();

    let endpoint = '';

    if (!isLoggedIn) {
      // Guest → public courses
      endpoint = `${this.API}/user/`;
    } else if (role === 'Student') {
      // Student dashboard
      endpoint = `${this.API}/user/dashboard`;
    } else if (role === 'Admin') {
      // Admin course list
      endpoint = `${this.API}/admin/courses`;
    }

    // Safety fallback
    if (!endpoint) {
      console.warn('⚠ No endpoint matched! Falling back to /user/');
      endpoint = `${this.API}/user/`;
    }

    console.log('📡 Fetching from:', endpoint);

    const courses = await firstValueFrom(this.http.get<Course[]>(endpoint));
    this._courses.set(courses);

    return courses;
  }

  // ==========================================================================
  // 🔹 Load public (guest) course list
  // ==========================================================================
  async loadPublicCourses() {
    const list = await firstValueFrom(this.http.get<Course[]>(`${this.API}/user/`));
    this._courses.set(list);
    return list;
  }

  // ==========================================================================
  // 🔹 Refresh (used by HomePage or forced reloads)
  // ==========================================================================
  refresh() {
    return this.loadCourses();
  }

  // ==========================================================================
  // CRUD Operations (Admin)
  // ==========================================================================
  getCourse(id: number) {
    return this.http.get<Course>(`${this.API}/courses/${id}`);
  }

  enroll(courseId: number) {
    return this.http.post(`${this.API}/user/enroll`, { courseId });
  }

  reset() {
    this._courses.set([]);
    return this.loadPublicCourses();
  }

  createCourse(courseData: any) {
    return this.http.post(`${this.API}/admin/courses`, courseData);
  }

  createMultipleContents(payload: any) {
    return this.http.post(`${this.API}/admin/courses/content`, payload);
  }

  updateStatus(id: number, status: string) {
    return this.http.put(`${this.API}/admin/courses/status/${id}`, { status });
  }

  updateCourse(id: number, data: any) {
    return this.http.put(`${this.API}/admin/courses/${id}`, data);
  }

  deleteCourse(id: number) {
    return this.http.delete(`${this.API}/admin/courses/${id}`);
  }

  getCourseById(id: number) {
    return this.http.get<any>(`${this.API}/admin/courses/${id}`);
  }

  getContentByCourse(courseId: number) {
    return this.http.get<any[]>(`${this.API}/admin/courses/content/course/${courseId}`);
  }

  updateContent(id: number, body: any) {
    return this.http.put(`${this.API}/admin/courses/content/${id}`, body);
  }

  createContent(body: any) {
    return this.http.post(`${this.API}/admin/courses/content`, body);
  }

  deleteContent(id: number) {
    return this.http.delete(`${this.API}/admin/courses/content/${id}`);
  }

  getEnrollments(courseId: number) {
    return this.http.get(`${this.API}/user/enrollmentlist/${courseId}`);
  }
}
