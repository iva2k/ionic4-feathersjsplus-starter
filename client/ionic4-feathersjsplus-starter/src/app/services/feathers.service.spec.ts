import { async, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { FeathersService } from './feathers.service';
import { HttpClientModule } from '@angular/common/http';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

describe('FeathersService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
      ],
      providers: [
        GooglePlus,
      ],
    });
  }));

  it('should be created', () => {
    const service: FeathersService = TestBed.get(FeathersService);
    expect(service).toBeTruthy();
  });

  // TODO: (later) add more tests!

});
