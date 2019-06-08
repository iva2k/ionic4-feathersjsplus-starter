import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { TodosService } from '../../services/todos.service';
import { Todo } from '../../models/todo';

@Component({
  selector: 'app-todos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent implements OnDestroy, OnInit {
  private todos: Todo[] = [];
  private subscription: Subscription;

  constructor(
    private todosService: TodosService,
    private ref: ChangeDetectorRef
  ) {}

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
}
