import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoDetailPage } from './todo-detail.page';

describe('TodoDetailPage', () => {
  let component: TodoDetailPage;
  let fixture: ComponentFixture<TodoDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
