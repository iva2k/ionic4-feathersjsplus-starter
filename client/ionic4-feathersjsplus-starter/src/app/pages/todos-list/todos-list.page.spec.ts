import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosListPage } from './todos-list.page';

describe('TodosListPage', () => {
  let component: TodosListPage;
  let fixture: ComponentFixture<TodosListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodosListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
