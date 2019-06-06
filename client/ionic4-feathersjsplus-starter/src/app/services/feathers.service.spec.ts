import { TestBed } from '@angular/core/testing';

import { FeathersService } from './feathers.service';

describe('FeathersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FeathersService = TestBed.get(FeathersService);
    expect(service).toBeTruthy();
  });
});
