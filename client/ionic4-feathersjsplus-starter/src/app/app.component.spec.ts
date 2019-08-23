import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { Events, NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';

import { FeathersService } from './services/feathers.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { HttpClientModule } from '@angular/common/http';

describe('AppComponent', () => {

  let statusBarSpy, splashScreenSpy, platformReadySpy, platformIsSpy, platformSpy;

  beforeEach(async(() => {
    statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
    splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    platformReadySpy = Promise.resolve();
    platformIsSpy = (query: string) => query === 'cordova';
    platformSpy = jasmine.createSpyObj('Platform', { ready: platformReadySpy, is: platformIsSpy });

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterTestingModule,
        HttpClientModule,
      ],
      providers: [
        Events,
        {provide: NavController, useValue: null}, // NavController,
        { provide: StatusBar, useValue: statusBarSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },
        { provide: Platform, useValue: platformSpy },
        GooglePlus,
        FeathersService,
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
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
