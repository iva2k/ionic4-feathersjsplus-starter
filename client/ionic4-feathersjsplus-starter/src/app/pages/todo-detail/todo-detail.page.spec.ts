import { CUSTOM_ELEMENTS_SCHEMA, Injectable } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';
import { convertToParamMap, ParamMap, Params } from '@angular/router';
import { ReplaySubject } from 'rxjs';

import { TodoDetailPage } from './todo-detail.page';

import { FeathersService } from '../../services/feathers.service';

@Injectable({
  providedIn: 'root'
})
class MockFeathersService {
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
  readonly queryParamMap = this.subject.asObservable();

  // Set the paramMap observables's next value
  setParamMap(params?: Params) {
    this.subject.next(convertToParamMap(params));
  }
}

describe('TodoDetailPage', () => {
  let component: TodoDetailPage;
  let fixture: ComponentFixture<TodoDetailPage>;
  const activatedRoute = new ActivatedRouteStub();

  beforeEach(async(() => {
    activatedRoute.setParamMap({ id: 0 });

    TestBed.configureTestingModule({
      declarations: [
        TodoDetailPage
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: NavController, useValue: null }, // NavController,
        { provide: FeathersService, useClass: MockFeathersService },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoDetailPage);
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
