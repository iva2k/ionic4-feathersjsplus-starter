import { CUSTOM_ELEMENTS_SCHEMA, Injectable } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosListComponent } from './todos-list.component';

import { Record, DataSubscriber, FeathersService } from '../../services/feathers.service';

// Mock data for the tests, presented through MockService.find()
const mockData = [
  {},
  {},
  {},
];

class MockService {
  constructor(private name: string, private data: {}[]) {}
  public on(event: string, cb: (record: any) => void) {}
  public find(query: string) {
    return Promise.resolve(this.data);
  }
}

@Injectable({
  providedIn: 'root'
})
class FeathersMockService {
  public service(name: string, data: {}[]) {
    return new MockService(name, data);
  }
  public subscribe<T extends Record>(service: string, query: any, cbData: (records: any) => void, cbErr: (err: any) => void): any {
    const subscriber = new DataSubscriber<T>(this.service(service, mockData), cbData, cbErr);
    subscriber.find(query)
      .catch(err => { cbErr(err); })
    ;
    return subscriber;
  }
}

describe('TodosListComponent', () => {
  let component: TodosListComponent;
  let fixture: ComponentFixture<TodosListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodosListComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: FeathersService, useClass: FeathersMockService},
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosListComponent);
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
