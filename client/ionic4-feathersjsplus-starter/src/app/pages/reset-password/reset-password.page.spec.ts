import { CUSTOM_ELEMENTS_SCHEMA, Injectable } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ResetPasswordPage } from './reset-password.page';

import { FeathersService } from '../../services/feathers.service';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
class MockFeathersService {
  private user = {};
  public authenticate(credentials?): Promise<any|User> { return Promise.resolve(this.user); }
  public resetPassword(resetToken, credentials): Promise<any> { return Promise.resolve(this.user); }
}

describe('ResetPasswordPage', () => {
  let component: ResetPasswordPage;
  let fixture: ComponentFixture<ResetPasswordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ResetPasswordPage,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: FeathersService, useClass: MockFeathersService },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit()
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TODO: (later) add more tests!

});
