import { CUSTOM_ELEMENTS_SCHEMA, Injectable } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';
import { convertToParamMap, ParamMap, Params } from '@angular/router';
import { ReplaySubject } from 'rxjs';

import { MenuPage } from './menu.page';

import { FeathersService, Login } from '../../services/feathers.service';

@Injectable({
  providedIn: 'root'
})
class MockFeathersService {
  public logout() {}
}

export class ActivatedRouteStub {
  // Use a ReplaySubject to share previous values with subscribers
  // and pump new values into the `paramMap` observable
  private subject = new ReplaySubject<ParamMap>();

  constructor(initialParams?: Params) {
    this.setParamMap(initialParams);
  }

  // The mock paramMap observable
  readonly paramMap = this.subject.asObservable();

  // Set the paramMap observables's next value
  setParamMap(params?: Params) {
    this.subject.next(convertToParamMap(params));
  }
}

describe('MenuPage', () => {
  let component: MenuPage;
  let fixture: ComponentFixture<MenuPage>;
  const activatedRoute = new ActivatedRouteStub();

  beforeEach(async(() => {
    activatedRoute.setParamMap({ id: 0 });

    TestBed.configureTestingModule({
      declarations: [
        MenuPage,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: NavController, useValue: null }, // NavController,
        { provide: FeathersService, useClass: MockFeathersService },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
