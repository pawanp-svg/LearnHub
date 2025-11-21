import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../../services/course-service';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-course-dialog',
  standalone: true,
  templateUrl: './create-course-dialog.html',
  styleUrls: ['./create-course-dialog.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIcon,
  ],
})
export class CreateCourseDialogComponent {
  courseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateCourseDialogComponent>,
    private courseService: CourseService,
    private snack: MatSnackBar
  ) {
    this.courseForm = this.fb.group({
      course_name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      thumbnailUrl: ['', Validators.required],
      is_published: [false],
      contents: this.fb.array([this.createContentGroup()]),
    });
  }

  // ---- CONTENT FORM ARRAY ----
  get contents() {
    return this.courseForm.get('contents') as FormArray;
  }

  createContentGroup(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      order_index: ['', Validators.required],
    });
  }

  addContent() {
    this.contents.push(this.createContentGroup());
  }

  removeContent(i: number) {
    this.contents.removeAt(i);
  }

  submit() {
    if (this.courseForm.invalid) {
      this.snack.open('Please fill all required fields.', 'Close', { duration: 4000 });
      return;
    }

    const { contents, ...courseData } = this.courseForm.value;

    // 1) Create course
    this.courseService.createCourse(courseData).subscribe({
      next: (res: any) => {
        // 2) Prepare bulk content payload
        const payload = {
          courseId: res.newCourse.id,
          contents: contents, // <-- entire array
        };

        // 3) Send all contents in ONE request
        this.courseService.createMultipleContents(payload).subscribe({
          next: () => this.dialogRef.close(true),
        });
        this.courseService.refresh();
        this.snack.open('Course created successfully!', 'Close', { duration: 4000 });
        this.dialogRef.close(true);
      },
    });
  }
}
