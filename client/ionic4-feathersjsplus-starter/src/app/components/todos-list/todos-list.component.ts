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
      (todos: any) => {
        this.todos = todos.data;
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
    console.log('TodosListComponent edit button, itemId: %s', itemId);
    this.edit.emit(itemId);
  }
}
