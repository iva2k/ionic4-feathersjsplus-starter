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
  providers: [TodosService],
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
        console.error(err);
      }
    );
    this.todosService.find();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
