import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { AuthPage } from './pages/User/auth-page/auth-page';
import { AuthGuard } from './guards/Auth/auth-guard';
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
];
