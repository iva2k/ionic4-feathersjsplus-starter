import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import cloneDeep from 'clone-deep';
import { diff } from 'deep-object-diff';

import { Todo } from '../../models/todo';
import { FeathersService } from '../../services/feathers.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'component-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
})
export class TodoItemComponent implements OnDestroy, OnInit {
  @Input() todoId: string;
  protected newItem: boolean; // true if opened without navParams, so it is an "Add" command.

  protected todo: Todo = {} as Todo;
  protected oldTodo: Todo; // Saved data for detecting changes
  private subscription: any; // TODO: DataSubscriber<Todo>;
  protected error: string;

  constructor(
    private feathersService: FeathersService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.newItem = !this.todoId;
    console.log('ngOnInit() TodoItemComponent. todoId: %s, newItem: %s', this.todoId, this.newItem);
    if (this.newItem) {
      // Create new item
      this.todo = new Todo();
    } else {
      // Edit existing item
      this.subscription = this.feathersService.subscribe<Todo>('todos', {
          _id: this.todoId,
          $limit: 1
        },
        (todos: any) => {
          if (todos.data && todos.data[0]) {
            this.todo = todos.data[0] as Todo;
            this.oldTodo = cloneDeep(this.todo);
          } else {
            console.error('Error, did not find todo item id "%s"', this.todoId);
          }
          this.ref.markForCheck();
        },
        err => {
          console.error('Error in FeathersService.subscribe(): ', err);
        });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  // Add button click
  public onAdd() {
    console.log('TodoItemComponent Add button. todo: ', this.todo);
  }

  // Update button click
  public onUpdate() {
    console.log('TodoItemComponent Update button. todo: ', this.todo);
    const changes = diff(this.oldTodo, this.todo);
    // Don't save if no changes were made
    if (!!Object.keys(changes).length) {
      // Actual changes were made
      console.log('Changes: %o', changes); // DEBUG
    }
  }

  // Delete button click
  public onDelete() {
    console.log('TodoItemComponent Delete button. todo: ', this.todo);
  }
}
