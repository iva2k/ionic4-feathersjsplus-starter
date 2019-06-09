import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

import { FeathersService } from '../../services/feathers.service';

@Component({
  selector: 'app-todos-list',
  templateUrl: './todos-list.page.html',
  styleUrls: ['./todos-list.page.scss'],
})
export class TodosListPage {

  constructor(
    public feathersService: FeathersService,
    public navCtrl: NavController
  ) {}

  // Edit button click
  public onEdit(itemId: string) {
    console.log('TodosListPage Edit button, itemId: %s', itemId); // DEBUG
    if (itemId) {
      const params = { todoId: itemId };
      this.navCtrl.navigateForward(['menu/app/tabs/todos/detail'], { queryParams: params } );
    }
  }

  // Add button click
  public onAdd() {
    console.log('TodosListPage Add button');
    const params = {};
    this.navCtrl.navigateForward(['menu/app/tabs/todos/detail'], { queryParams: params } );
  }

  // Command completed
  public onDone(event) {
    console.log('TodosListPage command done. event: %o', event);
    console.log(`Task "${event.item.title}" ${event.action}.`);
    // TODO: Implement Toast e.g. `Item "${event.item.title}" ${event.action}.` => 'Item "Task 1" removed.'
  }

}
