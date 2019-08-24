import { CUSTOM_ELEMENTS_SCHEMA, Injectable } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular';

import { TodosListPage } from './todos-list.page';

import { FeathersService } from '../../services/feathers.service';

@Injectable({
  providedIn: 'root'
})
class MockFeathersService {
}

describe('TodosListPage', () => {
  let component: TodosListPage;
  let fixture: ComponentFixture<TodosListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TodosListPage
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: NavController, useValue: null }, // NavController,
        { provide: FeathersService, useClass: MockFeathersService },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosListPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
