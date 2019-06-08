import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { FeathersService } from '../../services/feathers.service';

export interface IMenuItem {
  title: string;
  icon: string;
  // Either action or url should be present:
  action?: (that) => void;
  url?: string; // url => page
  back?: boolean;
  // ? tabPage?: any;
  // ? tabIndex?: number; // Equal to the order of our tabs inside tabs.ts
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  menuItems: IMenuItem[] = [
    { title: 'Home'       , icon: 'home'    , url: '/menu/app/tabs/home', },
    { title: 'Logout'     , icon: 'log-out' , action(that) { that.onLogout(); } },
  ];

  constructor(
    public navCtrl: NavController,
    public feathersService: FeathersService,
  ) { }

  ngOnInit() {
  }

  public onClick(menuItem: IMenuItem) {

    if (menuItem.action /* TODO: (now) type of Function */ ) {
      return menuItem.action(this);
    } // else ...

    // [routerLink]="menuItem.url" [routerDirection]="menuItem.back ? 'forward' : 'root'
    if (menuItem.url) {
      if (menuItem.back) {
        this.navCtrl.navigateForward(menuItem.url);
      } else {
        this.navCtrl.navigateRoot(menuItem.url);
      }
    }

    console.error('Menu Item with no action and no url: %o', menuItem);
  }

  public onLogout() {
    this.feathersService.logout(this.navCtrl)
      .then(() => {
        this.navCtrl.navigateRoot('/login'); // Let the router sort out which page to go to based on authentication.
      })
      .catch(() => {
        this.navCtrl.navigateRoot('/login');  // Let the router sort out which page to go to based on authentication.
      })
    ;
  }

}
