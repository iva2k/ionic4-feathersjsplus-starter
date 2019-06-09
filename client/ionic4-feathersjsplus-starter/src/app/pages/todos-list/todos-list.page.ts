import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';

import { FeathersService } from '../../services/feathers.service';

@Component({
  selector: 'app-todos-list',
  templateUrl: './todos-list.page.html',
  styleUrls: ['./todos-list.page.scss'],
})
export class TodosListPage {

  constructor(
    private feathersService: FeathersService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
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
    this.toaster(`Task "${event.item.title}" ${event.action}.`);
  }

  private toaster(text: string, time: number = 3000) {
    this.toastCtrl.create({
      message: text,
      duration: time,
    }).then( toast => {
      toast.present();
      // setTimeout(() => toast.dismiss(), time);
    });
  }

}
