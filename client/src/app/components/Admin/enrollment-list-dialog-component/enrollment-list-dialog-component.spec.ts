import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentListDialogComponent } from './enrollment-list-dialog-component';

describe('EnrollmentListDialogComponent', () => {
  let component: EnrollmentListDialogComponent;
  let fixture: ComponentFixture<EnrollmentListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentListDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
