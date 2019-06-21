import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChildren,
  QueryList
} from '@angular/core';
import { IonItemSliding } from '@ionic/angular';

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
  @ViewChildren(IonItemSliding) private slidingItems: QueryList<IonItemSliding>;

  protected todos: Todo[] = [];
  private subscription: any; // TODO: (later) Use type : DataSubscriber<Todo>;

  public itemsBusyDeleting: IonItemSliding[] = [];

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

  private closeAllSliders(exceptItem?: IonItemSliding) {
    this.slidingItems.map(item => { if (item !== exceptItem) { item.close(); } });
  }

  // Edit button click
  onEdit(itemId: string, item: IonItemSliding) {
    console.log('TodosListComponent Edit button, itemId: %s', itemId);
    setTimeout(() => {
      // item.close();
      this.closeAllSliders();
     }, 0); // Post until after swipe is done with its animation, otherwise item might reopen.
    this.edit.emit(itemId);
  }

  beginDeleting(item: IonItemSliding) {
    // IONIC3: item.setElementClass('deleting', true);
    // IonItemSliding.setElementClass() method was removed in IONIC4.
    // We will use [class.deleting]="itemsBusyDeleting.indexOf(item) > -1"
    this.itemsBusyDeleting.push(item);
  }

  doneDeleting(item: IonItemSliding) {
    // IONIC3: item.setElementClass('deleting', false);
    const index = this.itemsBusyDeleting.indexOf(item);
    if (index > -1) {
      this.itemsBusyDeleting.splice(index, 1);
    }
  }

  // Delete button click
  onRemove(itemId: string, item: IonItemSliding) {
    this.beginDeleting(item);

    console.log('TodoListComponent Remove button, itemId: %s', itemId);
    this.closeAllSliders(item);
    this.feathersService.remove<Todo>('todos', { _id: itemId } as Todo)
      .then(res => {
        this.doneDeleting(item);
        item.close();
        console.log('FeathersService.remove result: %o', res); // DEBUG
        this.done.emit({action: 'removed', item: res});
      })
      .catch(err => {
        this.doneDeleting(item);
        item.close();
        console.error('Error in FeathersService.remove: %o', err);
      });
  }
}
