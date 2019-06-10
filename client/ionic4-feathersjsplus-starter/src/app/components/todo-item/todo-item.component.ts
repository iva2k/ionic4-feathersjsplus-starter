import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
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
  @Output() done = new EventEmitter<{action: string, item: Todo}>();

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
        (todos: Todo[]) => {
          // This callback will be called every time data is changed on the server.
          if (todos.length === 1 && todos[0]) { // exact query returned
            this.todo = todos[0];
            this.oldTodo = cloneDeep(this.todo);
          } else if (todos.length === 0) { // 'remove' happened
            this.todo = new Todo(); // remove record
            this.oldTodo = null;
          } else if (todos.length > 1) { // 'create' happened
          //  console.error('Error, did not find todo item id "%s"', this.todoId); // DEBUG
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
    this.feathersService.create<Todo>('todos', this.todo)
      .then(res => {
        console.log('FeathersService.create result: %o', res); // DEBUG
        this.done.emit({action: 'added', item: res});
      })
      .catch(err => {
        console.error('Error in FeathersService.create: %o', err);
      });
  }

  // Update button click
  public onUpdate() {
    console.log('TodoItemComponent Update button. todo: ', this.todo);
    const changes = diff(this.oldTodo, this.todo);
    // Don't save if no changes were made
    if (!!Object.keys(changes).length) {
      // Actual changes were made
      console.log('Changes: %o', changes); // DEBUG
      this.feathersService.update<Todo>('todos', this.todo)
        .then(res => {
          console.log('FeathersService.update result: %o', res); // DEBUG
          this.done.emit({action: 'updated', item: res});
        })
        .catch(err => {
          console.error('Error in FeathersService.update: %o', err);
        });
    } else {
      // No changes made, emit "not updated", so page can return to master
      this.done.emit({action: 'updated (no changes made)', item: this.todo});
    }
  }

  // Delete button click
  public onRemove() {
    console.log('TodoItemComponent Delete button. todo: ', this.todo);
    this.feathersService.remove<Todo>('todos', this.todo)
      .then(res => {
        console.log('FeathersService.remove result: %o', res); // DEBUG
        this.done.emit({action: 'removed', item: res});
      })
      .catch(err => {
        console.error('Error in FeathersService.remove: %o', err);
      });
  }
}
