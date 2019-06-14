import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs/Subscription';

import { FeathersService } from '../../services/feathers.service';

export interface IMenuItem {
  title: string;
  icon: string;
  // Either action or url should be present:
  action?: (that: MenuPage) => void;
  url?: string; // url => page
  back?: boolean;
  exact?: boolean; // if true, match url exactly to determine if the item is active
  // (useful if child roots are also on the menu), see <https://github.com/angular/angular/issues/9885>.
  fix?: boolean; // If true, use hack, see <https://github.com/angular/angular/issues/18469>
  // ? tabPage?: any;
  // ? tabIndex?: number; // Equal to the order of our tabs inside tabs.ts
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit, OnDestroy {
  public id: number;
  public mode: string;
  private paramMapSubscription: Subscription;

  menuItems: IMenuItem[] = [
    { title: 'Todos'      , icon: 'home'    , url: '/menu/app/tabs/todos' },
    { title: 'Logout'     , icon: 'log-out' , action(that) { that.onLogout(); } },
  ];

  constructor(
    public activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    public feathersService: FeathersService,
  ) { }

  ngOnInit() {
    this.paramMapSubscription = this.activatedRoute.paramMap.subscribe(
      ( paramMap: ParamMap ): void => {
          this.id = +paramMap.get('id');
          this.mode = paramMap.get('mode');
      }
    );
  }

  ngOnDestroy() {
    if ( this.paramMapSubscription ) { this.paramMapSubscription.unsubscribe(); }
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
      return;
    } // else ...

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
