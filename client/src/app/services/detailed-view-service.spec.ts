import { TestBed } from '@angular/core/testing';

import { DetailedViewService } from './detailed-view-service';

describe('DetailedViewService', () => {
  let service: DetailedViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailedViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
