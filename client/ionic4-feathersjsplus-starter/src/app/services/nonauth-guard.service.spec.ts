import { Injectable } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';

import { NonauthGuardService } from './nonauth-guard.service';

import { FeathersService } from '../services/feathers.service';

@Injectable({
  providedIn: 'root'
})
class MockFeathersService {
}

describe('NonauthGuardService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: FeathersService, useClass: MockFeathersService },
      ],
    });
  }));

  it('should be created', () => {
    const service: NonauthGuardService = TestBed.get(NonauthGuardService);
    expect(service).toBeTruthy();
  });

  // TODO: (later) add more tests!

});
