import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs/Subscription';

import { FeathersService } from '../../services/feathers.service';
import { PreferencesService } from '../../services/preferences.service';


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
  control?: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit, OnDestroy {
  @ViewChild('themeToggle') themeToggle;
  public id: number;
  public mode: string;
  private paramMapSubscription: Subscription;
  public darkTheme: boolean;

  menuItems: IMenuItem[] = [
    { title: 'Todos'      , icon: 'home'    , url: '/menu/app/tabs/todos' },
    { title: 'Logout'     , icon: 'log-out' , action(that) { that.onLogout(); } },
    { title: 'Dark Theme' , icon: 'moon'    , action(that) { that.onDarkTheme(); }, control: 'toggle' },
  ];

  constructor(
    public activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    public feathersService: FeathersService,
    public preferencesService: PreferencesService,
  ) { }

  ngOnInit() {
    this.paramMapSubscription = this.activatedRoute.paramMap.subscribe(
      ( paramMap: ParamMap ): void => {
          this.id = +paramMap.get('id');
          this.mode = paramMap.get('mode');
      }
    );
    this.preferencesService.ready().then(() => {
      const saved = this.darkTheme;
      this.darkTheme = (this.preferencesService.get('theme') === 'dark');
      this.onChange(null); // Ensure we trigger change to paint the theme correctly
    });
  }

  ngOnDestroy() {
    if ( this.paramMapSubscription ) { this.paramMapSubscription.unsubscribe(); }
  }

  public onClick(menuItem: IMenuItem) {

    if (typeof menuItem.action === 'function') {
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
    this.feathersService.logout()
      // .then(() => {
      //   // app will get 'user:logout' event and return to '/'
      // })
      // .catch(() => {
      //   // app will get 'user:logout' event and return to '/'
      // })
    ;
  }

  public onDarkTheme() {
    // const isSet = document.body.classList.contains('dark');
    // document.body.classList.toggle('dark', !isSet);
  }

  public onChange(item) {
    document.body.classList.toggle('dark', this.darkTheme);
    this.preferencesService.set('theme', this.darkTheme ? 'dark' : '');
  }
}
