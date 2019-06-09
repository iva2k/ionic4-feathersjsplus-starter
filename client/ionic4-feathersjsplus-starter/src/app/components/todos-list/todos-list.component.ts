import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';

import { Todo } from '../../models/todo';
import { FeathersService } from '../../services/feathers.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'component-todos-list',
  templateUrl: './todos-list.component.html',
  styleUrls: ['./todos-list.component.scss'],
})
export class TodosListComponent implements OnDestroy, OnInit {
  @Output() edit = new EventEmitter<string>();
  @Output() done = new EventEmitter<{action: string, item: Todo}>();

  protected todos: Todo[] = [];
  private subscription: any; //TODO: DataSubscriber<Todo>;

  constructor(
    private feathersService: FeathersService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscription = this.feathersService.subscribe<Todo>('todos', {
        $sort: {createdAt: -1},
        $limit: 25
      },
      (todos: Todo[]) => {
        this.todos = todos;
        this.ref.markForCheck();
      },
      err => {
        console.error('Error in FeathersService.subscribe(): ', err);
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  // Edit button click
  onEdit(itemId: string) {
    console.log('TodosListComponent Edit button, itemId: %s', itemId);
    this.edit.emit(itemId);
  }

  // Delete button click
  onRemove(itemId) {
    console.log('TodoListComponent Remove button, itemId: %s', itemId);
    this.feathersService.remove<Todo>('todos', { _id: itemId } as Todo)
      .then(res => {
        console.log('FeathersService.remove result: %o', res); // DEBUG
        this.done.emit({action: 'removed', item: res});
      })
      .catch(err => {
        console.error('Error in FeathersService.remove: %o', err);
      });
  }
}
