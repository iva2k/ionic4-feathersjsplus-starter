import { CUSTOM_ELEMENTS_SCHEMA, Injectable } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { Events, NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';

import { FeathersService } from './services/feathers.service';

@Injectable({
  providedIn: 'root'
})
class MockFeathersService {
  urlLoginDestination: string;
  urlLogoutDestination: string;
  retUrl: string;
  public setGuards(urlLoginDestination: string, urlLogoutDestination: string) {
    this.urlLoginDestination = urlLoginDestination;
    this.urlLogoutDestination = urlLogoutDestination;
  }

  public setRetUrl(retUrl: string) {
    this.retUrl = retUrl;
  }
  public getRetUrl(clear: boolean = true): string {
    const ret = this.retUrl;
    if (clear) { this.retUrl = null; }
    return ret;
  }

}

describe('AppComponent', () => {

  let statusBarSpy, splashScreenSpy, platformReadySpy, platformIsSpy, platformSpy;

  beforeEach(async(() => {
    statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
    splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    platformReadySpy = Promise.resolve();
    platformIsSpy = (query: string) => query === 'cordova';
    platformSpy = jasmine.createSpyObj('Platform', { ready: platformReadySpy, is: platformIsSpy });

    TestBed.configureTestingModule({
      declarations: [ AppComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterTestingModule,
        // HttpClientModule,
      ],
      providers: [
        Events,
        { provide: NavController, useValue: null }, // NavController,
        { provide: StatusBar, useValue: statusBarSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },
        { provide: Platform, useValue: platformSpy },
        { provide: FeathersService, useClass: MockFeathersService },
      ],
    })
    .compileComponents();
  }));

  // afterEach(() => {
  // });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
    fixture.destroy();
  });

  it('should initialize the app', async () => {
    TestBed.createComponent(AppComponent);
    expect(platformSpy.ready).toHaveBeenCalled();
    await platformReadySpy;
    expect(statusBarSpy.styleDefault).toHaveBeenCalled();
    expect(splashScreenSpy.hide).toHaveBeenCalled();
  });

  // TODO: (later) add more tests!

});
