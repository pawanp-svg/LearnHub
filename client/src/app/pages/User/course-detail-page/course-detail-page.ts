import { ChangeDetectorRef, Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Navbar } from '../../../components/shared/navbar/navbar';
import { OptionsCardComponent } from '../../../components/User/options-card-component/options-card-component';
import { ModulesComponent } from '../../../components/User/modules-component/modules-component';
import { ActivatedRoute } from '@angular/router';
import { DetailedViewService } from '../../../services/detailed-view-service';

@Component({
  selector: 'app-course-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    OptionsCardComponent,
    ModulesComponent,
    Navbar,
  ],
  templateUrl: './course-detail-page.html',
  styleUrls: ['./course-detail-page.scss'],
})
export class CourseDetailPage implements OnInit {
  // ✅ Expose service signals directly — assigned in constructor after injection
  course: any;
  modules: any;
  userStatus: any;

  constructor(
    private route: ActivatedRoute,
    private detailedView: DetailedViewService,
    private cdr: ChangeDetectorRef
  ) {
    // assign service signals to properties after injection
    this.course = this.detailedView.course;
    this.modules = this.detailedView.modules;
    this.userStatus = this.detailedView.userStatus;

    // 🔥 React when course changes
    effect(() => {
      this.course();
      this.cdr.detectChanges();
    });

    // 🔥 React when modules/content changes
    effect(() => {
      this.modules();
      this.cdr.detectChanges();
    });

    // 🔥 React when enrollment status changes
    effect(() => {
      this.userStatus();
      this.cdr.detectChanges();
    });
  }

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    // 🔥 Load course FIRST (fixes refresh issues)
    await this.detailedView.loadCourseById(id);

    // 🔥 Then load content AFTER course is ready
    this.detailedView.loadContentForCourse(id);
  }

  onEnroll() {
    const c = this.course();
    if (!c) return;
    this.detailedView.enrollInCourse(c.id);
  }
}
