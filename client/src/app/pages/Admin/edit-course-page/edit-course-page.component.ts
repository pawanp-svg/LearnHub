import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';
import { CourseService } from '../../../services/course-service';
import { Navbar } from '../../../components/shared/navbar/navbar';

@Component({
  selector: 'app-edit-course',
  standalone: true,
  templateUrl: './edit-course-page.component.html',
  styleUrls: ['./edit-course-page.component.scss'],

  /**  All Required Imports for Standalone Component */
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIcon,
    // Material
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDividerModule,
    MatSnackBarModule,
    Navbar,
  ],
})
export class EditCourseComponent implements OnInit {
  courseId!: number;
  loading = false;

  courseForm: any; // declare only

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private courseService: CourseService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  /** Getter for contents array */
  get contents(): FormArray {
    return this.courseForm.get('contents') as FormArray;
  }

  ngOnInit() {
    this.courseForm = this.fb.group({
      course_name: ['', Validators.required],
      description: [''],
      price: [''],
      thumbnailUrl: [''],
      contents: this.fb.array([]),
    });

    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCourse();
    this.loadContents();
  }

  /** Load course basic info */
  loadCourse() {
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (course) => {
        this.courseForm.patchValue({
          course_name: course.course_name,
          description: course.description,
          price: course.price,
          thumbnailUrl: course.thumbnailUrl,
        });
      },
      error: (err) => console.error(err),
    });
  }

  /** Load all content items */
  loadContents() {
    this.contents.clear();

    this.courseService.getContentByCourse(this.courseId).subscribe({
      next: (items) => {
        items.forEach((c: any) => {
          this.contents.push(
            this.fb.group({
              id: [c.id],
              title: [c.title, Validators.required],
              content: [c.content],
              order_index: [c.order_index],
            })
          );
        });
      },
      error: (err) => console.error(err),
    });
  }

  /** Add new content block */
  addContent() {
    this.contents.push(
      this.fb.group({
        id: [null], // new item
        title: ['', Validators.required],
        content: [''],
        order_index: [this.contents.length + 1],
      })
    );
  }

  /** Remove content */
  removeContent(i: number) {
    const contentId = this.contents.at(i).value.id;

    if (contentId) {
      // Delete in backend also
      this.courseService.deleteContent(contentId).subscribe(() => {
        this.contents.removeAt(i);
      });
    } else {
      this.contents.removeAt(i);
    }
  }

  /** Save course + all contents */
  save() {
    if (this.courseForm.invalid) {
      this.snack.open('Please fill all required fields', 'Close', { duration: 2000 });
      return;
    }

    this.loading = true;

    const data = this.courseForm.value;

    /** Step 1 — Update main course */
    this.courseService
      .updateCourse(this.courseId, {
        course_name: data.course_name,
        description: data.description,
        price: data.price,
        thumbnailUrl: data.thumbnailUrl,
      })
      .subscribe({
        next: () => {
          /** Step 2 — Update or create contents */
          data.contents?.forEach((c: any) => {
            if (c.id) {
              // Update
              this.courseService.updateContent(c.id, c).subscribe();
            } else {
              // Insert new content
              this.courseService
                .createContent({
                  courseId: this.courseId,
                  contents: [
                    {
                      title: c.title,
                      content: c.content,
                      order_index: c.order_index,
                    },
                  ],
                })
                .subscribe();
            }
          });

          this.snack.open('Course updated successfully!', 'Close', { duration: 2000 });
          this.router.navigate(['/']);
        },
        error: (err) => console.error(err),
        complete: () => (this.loading = false),
      });
  }

  cancelHandler() {
    this.router.navigate(['/']);
  }
}
