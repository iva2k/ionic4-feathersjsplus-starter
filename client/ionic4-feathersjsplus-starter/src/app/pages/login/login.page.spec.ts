import { CUSTOM_ELEMENTS_SCHEMA, Injectable, Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonSlides, NavController, Platform } from '@ionic/angular';

import { LoginPage } from './login.page';

import { FeathersService, Login } from '../../services/feathers.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@Injectable({
  providedIn: 'root'
})
class MockFeathersService {
  private socialLogins: Promise<Login[]> = Promise.resolve([]);
  public getSocialLogins(): Promise<any[]> { return this.socialLogins; }
  public setRetUrl(retUrl: string) {}
  public decodeObject(str: string) { return JSON.parse(str || '""'); }
}

@Component({
  selector: 'ion-slides',
  template: '',
  providers: [
    { provide: IonSlides, useClass: StubIonSlidesComponent },
  ]
})
class StubIonSlidesComponent {
  public slideTo(index: number, speed: number) {}
}

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let platformReadySpy, platformIsSpy, platformSpy;

  beforeEach(async(() => {
    platformReadySpy = Promise.resolve();
    platformIsSpy = (query: string) => query === 'cordova';
    platformSpy = jasmine.createSpyObj('Platform', { ready: platformReadySpy, is: platformIsSpy });

    TestBed.configureTestingModule({
      declarations: [
        LoginPage,
        StubIonSlidesComponent, // IonSlides
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: NavController, useValue: null }, // NavController,
        { provide: Platform, useValue: platformSpy },
        { provide: FeathersService, useClass: MockFeathersService },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
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
