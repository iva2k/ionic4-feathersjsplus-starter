import { TestBed } from '@angular/core/testing';

import { NonauthGuardService } from './nonauth-guard.service';

describe('NonauthGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NonauthGuardService = TestBed.get(NonauthGuardService);
    expect(service).toBeTruthy();
  });
});
