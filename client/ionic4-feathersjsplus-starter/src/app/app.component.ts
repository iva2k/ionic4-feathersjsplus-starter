import { Component } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

import { Events, NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  urlLoginDestination = '/menu/app/tabs/todos';
  urlLogoutDestination = '/login'; // TODO: (soon) Let the router sort out which page to go to based on authentication.

  constructor(
    public events: Events,
    private navCtrl: NavController,
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // console.log('platform.ready()');
      if (this.platform.is('cordova')) {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      }
    });

    // this.platform.resume.subscribe(() => {
    //   console.log('platform.resume()');
    // });

    this.listenLoginEvents();
  }

  // ngOnInit() {
  //   console.log('AppComponent.ngOnInit()');
  // }

  private gotoPage(url: string, params: any = {}, root: boolean = true ) {
    const urlTree = this.router.createUrlTree([url], { queryParams: params });
    console.log('[AppComponent] gotoPage %s.', urlTree.toString());

    if (root) {
      this.navCtrl.navigateRoot(urlTree, { animated: false } );
    } else {
      this.navCtrl.navigateForward(urlTree, { animated: false } );
    }
  }

  private listenLoginEvents() {
    this.events.subscribe('user:login', (user) => {
      console.log('[AppComponent] got user:login');
      this.gotoPage(this.urlLoginDestination);
    });

    this.events.subscribe('user:logout', () => {
      console.log('[AppComponent] got user:logout');
      this.gotoPage(this.urlLogoutDestination);
    });

    this.events.subscribe('user:failed', (error, activity, command) => {
      console.log('[AppComponent] got user:failed');
      // TODO: (now) error is an object... need to stringify it? Use not queryParams?
      this.gotoPage(this.urlLogoutDestination, { error, activity, command });
    });

    // Guard for login pages
    this.events.subscribe('guard:logout', (pageUrl) => {
      const redirectUrl = this.urlLoginDestination;
      console.log('[AppComponent] got guard:logout(%s): redirecting to %s.', pageUrl, redirectUrl);
      this.gotoPage(redirectUrl);
    });

    // Guard for user & data pages
    this.events.subscribe('guard:login', (pageUrl) => {
      const redirectUrl = this.urlLogoutDestination;
      // const urlTree = this.router.createUrlTree([redirectUrl], { queryParams: { retUrl: pageUrl } });
      // console.log('[AppComponent] got guard:login(%s): redirecting to %s.', pageUrl, urlTree.toString());
      // return urlTree; // Angular >= 7.1 router
      console.log('[AppComponent] got guard:login(%s): redirecting to %s.', pageUrl, redirectUrl);
      this.gotoPage(redirectUrl, { retUrl: pageUrl });
    });

  }

}
