import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError } from 'rxjs/operators'; // ✅ ADD THIS
import { throwError } from 'rxjs';
import { ErrorDialogComponent } from '../components/shared/error-dialog-component/error-dialog-component';

export const globalErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const dialog = inject(MatDialog);

  return next(req).pipe(
    catchError((error) => {
      dialog.open(ErrorDialogComponent, {
        data: {
          status: error.status,
          message: getFriendlyMessage(error.status),
        },
        disableClose: true,
        width: '400px',
      });

      return throwError(() => error); // IMPORTANT
    })
  );
};

function getFriendlyMessage(status: number): string {
  switch (status) {
    case 500:
      return 'Oops! We hit a snag. Please try again later.';
    case 404:
      return 'The resource you are looking for does not exist.';
    case 401:
      return 'You must log in again.';
    case 400:
      return 'The request seems incorrect. Please verify and try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
