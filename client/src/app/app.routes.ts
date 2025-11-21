import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { AuthPage } from './pages/User/auth-page/auth-page';
import { AuthGuard } from './guards/Auth/auth-guard';
import { CourseDetailPage } from './pages/User/course-detail-page/course-detail-page';
// import your course detail page later

export const appRoutes: Routes = [
  {
    path: '',
    component: HomePage,
    data: { pageType: 'home' },
  },

  {
    path: 'my-courses',
    component: HomePage,
    data: { pageType: 'my-courses' },
    canActivate: [AuthGuard],
  },

  {
    path: 'auth',
    component: AuthPage,
  },
  {
    path: 'course/:id',
    component: CourseDetailPage,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/edit-course/:id',
    loadComponent: () =>
      import('./pages/Admin/edit-course-page/edit-course-page.component').then(
        (m) => m.EditCourseComponent
      ),
    canActivate: [AuthGuard],
  },
];
