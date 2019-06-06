import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { FeathersService } from './feathers.service';

import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  public todos$: Observable<Todo[]>;
  private todosObserver: Observer<Todo[]>;
  private feathersService: any;
  private dataStore: {
    todos: Todo[];
  };

  constructor(
    feathersService: FeathersService
  ) {
    console.log('Hello from TodosService');
    // super();
    this.feathersService = feathersService.service('todos');

    this.feathersService.on('created', todo => this.onCreated(todo));
    this.feathersService.on('updated', todo => this.onUpdated(todo));
    this.feathersService.on('removed', todo => this.onRemoved(todo));

    this.todos$ = new Observable(observer => (this.todosObserver = observer));
    this.dataStore = { todos: [] };
  }


//  getTodos() {
//    return new Promise(resolve => {
//      this.http.get(this.apiUrl+'/todos').subscribe(data => {
//        resolve(data);
//      }, err => {
//        console.log(err);
//      });
//    });
//  }
//
//  addTodo(data) {
//    return new Promise((resolve, reject) => {
//      this.http.post(this.apiUrl+'/todos', JSON.stringify(data))
//        .subscribe(res => {
//          resolve(res);
//        }, (err) => {
//          reject(err);
//        });
//    });
//  }

// ?  public addTodo(data: Todo) {
//    this.feathersService.create(data);
//  }

  public find() {
    this.feathersService.find({
      query: {}
    })
    .then( (todos: any) => {
      this.dataStore.todos = todos.data;
      this.todosObserver.next(this.dataStore.todos);
    })
    .catch( (err) => {
       // DEBUG only:
      this.dataStore.todos = [
        { id: '1qwe', title: 'Task1', notes: 'Oxo numa lupaer hicka' },
        { id: '2wer', title: 'Task2', notes: 'Didal vensi minaf wisa' },
        { id: '3ert', title: 'Task3', notes: 'Plofer dular mendi fiser' },
      ];
      this.todosObserver.next(this.dataStore.todos);
      console.error(err);
    });
  }

  private getIndex(id: string): number {
    let foundIndex = -1;

    for (let i = 0; i < this.dataStore.todos.length; i++) {
      if (this.dataStore.todos[i].id === id) {
        foundIndex = i;
      }
    }

    return foundIndex;
  }

  private onCreated(todo: Todo) {
    this.dataStore.todos.push(todo);
    this.todosObserver.next(this.dataStore.todos);
  }

  private onUpdated(todo: Todo) {
    const index = this.getIndex(todo.id);

    this.dataStore.todos[index] = todo;
    this.todosObserver.next(this.dataStore.todos);
  }

  private onRemoved(todo) {
    const index = this.getIndex(todo.id);

    this.dataStore.todos.splice(index, 1);
    this.todosObserver.next(this.dataStore.todos);
  }

}
