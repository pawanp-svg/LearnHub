import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundSectionComponent } from './background-section-component';

describe('BackgroundSectionComponent', () => {
  let component: BackgroundSectionComponent;
  let fixture: ComponentFixture<BackgroundSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackgroundSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
