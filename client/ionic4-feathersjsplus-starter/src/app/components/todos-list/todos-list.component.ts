import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { TodosService } from '../../services/todos.service';
import { Todo } from '../../models/todo';

@Component({
  selector: 'component-todos-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './todos-list.component.html',
  styleUrls: ['./todos-list.component.scss'],
})
export class TodosListComponent implements OnDestroy, OnInit {
  @Output() edit = new EventEmitter<string>();
  protected todos: Todo[] = [];
  private subscription: Subscription;

  constructor(
    private todosService: TodosService,
    private ref: ChangeDetectorRef
  ) {
    // console.log('Hello TodosListComponent Component');
  }

  ngOnInit() {
    this.subscription = this.todosService.todos$.subscribe(
      (todos: Todo[]) => {
        this.todos = todos;
        this.ref.markForCheck();
      },
      err => {
        console.error('Error in subscribe to TodosService: ', err);
      }
    );
    this.todosService.find({
      $sort: {createdAt: -1},
      $limit: 25
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // Edit button click
  onEdit(itemId: string) {
    console.log('TodosListComponent edit button, itemId: %s', itemId);
    this.edit.emit(itemId);
  }
}
