import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-enrollment-list-dialog',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule],
  templateUrl: './enrollment-list-dialog-component.html',
  styleUrls: ['./enrollment-list-dialog-component.scss'],
})
export class EnrollmentListDialogComponent {
  displayedColumns: string[] = ['first_name', 'last_name', 'email'];
  dataSource: any[] = []; // <-- initialize empty first

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<EnrollmentListDialogComponent>
  ) {
    if (data && data.students) {
      this.dataSource = data.students.map((entry: any) => ({
        first_name: entry.user?.first_name,
        last_name: entry.user?.last_name,
        email: entry.user?.email,
      }));
    }
  }

  close() {
    this.ref.close();
  }
}
