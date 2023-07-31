import { TestBed } from '@angular/core/testing';

import { PolycodeService } from './polycode.service';

describe('PolycodeService', () => {
  let service: PolycodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolycodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
