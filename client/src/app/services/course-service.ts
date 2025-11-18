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
}

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private API = 'http://localhost:5000/api';

  private _courses = signal<Course[]>([]);
  public courses = this._courses.asReadonly();

  constructor(private http: HttpClient, private auth: AuthService) {
    effect(() => {
      const loggedIn = this.auth.isLoggedIn();
      if (!loggedIn) {
        this._courses.set([]); // clear cached data
        this.loadPublicCourses(); // reload public courses
      }
    });
  }

  loadCourses() {
    const isLoggedIn = this.auth.isLoggedIn();
    const role = this.auth.getUserRole(); // <- FIXED

    let endpoint = '';

    if (!isLoggedIn) {
      endpoint = `${this.API}/user/`;
    } else if (role === 'Student') {
      endpoint = `${this.API}/user/dashboard`;
    } else if (role === 'Admin') {
      endpoint = `${this.API}/admin/courses`;
    }

    // SAFETY FALLBACK
    if (!endpoint) {
      console.warn('⚠ No valid endpoint matched. Falling back to public /api/user/ endpoint.');
      endpoint = `${this.API}/user/`;
    }

    console.log('Endpoint Selected:', endpoint);

    return firstValueFrom(
      this.http.get<Course[]>(endpoint).pipe(tap((courses) => this._courses.set(courses)))
    );
  }

  getCourse(id: number) {
    return this.http.get<Course>(`${this.API}/courses/${id}`);
  }

  enroll(courseId: number) {
    return this.http.post(`${this.API}/user/enroll`, { courseId });
  }

  reset() {
    this._courses.set([]); // clear memory
    this.loadPublicCourses(); // reload non-logged course list
  }

  loadPublicCourses() {
    return firstValueFrom(
      this.http.get<Course[]>(`${this.API}/user/`).pipe(tap((list) => this._courses.set(list)))
    );
  }
  refresh() {
    return this.loadCourses();
  }
}
