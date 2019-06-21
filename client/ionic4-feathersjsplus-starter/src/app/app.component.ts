import { Component } from '@angular/core';

import { Events, NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  urlLoginDestination = '/menu/app/tabs/todos';
  urlLogoutDestination = '/login';

  constructor(
    public events: Events,
    private navCtrl: NavController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      }
    });
    this.listenLoginEvents();
  }

  private gotoPage(url: string, params: any = {}, root: boolean = true ) {
    if (root) {
      this.navCtrl.navigateRoot([url], {queryParams: params, animated: false});
    } else {
      this.navCtrl.navigateForward([url], { queryParams: params, animated: false } );
    }
  }

  private listenLoginEvents() {
    this.events.subscribe('user:login', (user) => {
      console.log('app got user:login');
      this.gotoPage(this.urlLoginDestination);
    });

    this.events.subscribe('user:logout', () => {
      console.log('app got user:logout');
      this.gotoPage(this.urlLogoutDestination);
    });

    this.events.subscribe('user:failed', (error, activity, command) => {
      console.log('app got user:failed');
      // TODO: (now) error is an object... need to stringify it? Use not queryParams?
      this.gotoPage(this.urlLogoutDestination, { error, activity, command });
    });
  }

}
