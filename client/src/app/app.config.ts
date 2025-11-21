import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { authInterceptor } from './interceptors/Auth/auth';
import { globalErrorInterceptor } from './interceptors/global-error-interceptor-interceptor';

// ⭐ Import dialog defaults
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),

    // ⭐ Register ALL interceptors here
    provideHttpClient(withInterceptors([authInterceptor, globalErrorInterceptor])),

    // ⭐ Default dialog options (fix scroll + width issues)
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        disableClose: false,
        width: 'auto',
        maxHeight: 'none', // ⬅ prevents the dialog from becoming scrollable
        panelClass: 'custom-dialog-container', // optional custom styling hook
      },
    },
  ],
};
