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

  pages: IMenuItem[] = [ // TODO (soon) rename pages -> menuItems
    { title: 'Home', icon: 'home', url: '/menu/app/tabs/home', },
  ];

  constructor(
    public navCtrl: NavController,
    feathersService: FeathersService,
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
        // forward
        this.navCtrl.navigateForward(menuItem.url);
      } else {
        // root
        this.navCtrl.navigateRoot(menuItem.url);
      }
    }

    console.error('Menu Item with no action and no url: %o', menuItem);
  }

}
