import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { FeathersService } from './services/feathers.service';
import { AuthGuardService } from './services/auth-guard.service';
import { NonauthGuardService } from './services/nonauth-guard.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IonicModule.forRoot({
      // menuType: 'overlay',
        // 'push' - slide out pushing the page
        // 'reveal' - slide out pushing the page (iOS)
        // 'overlay' - slide out covering the page (MD and Windows)
        // No more platforms! (see https://github.com/ionic-team/ionic/issues/16272 https://ionicframework.com/docs/utilities/config)
      // (!) platforms: { ios: { menuType: 'reveal', } }
    }),
    IonicStorageModule.forRoot({
      // // See https://github.com/localForage/localForage#configuration
      // name: '__mydb',
      // storeName: '_ionickv',
      // dbKey: '_ionickey',
      // driverOrder: ['sqlite', 'indexeddb', 'websql', 'localstorage']
    }),
    AppRoutingModule
  ],
  providers: [
    GooglePlus,
    SplashScreen,
    StatusBar,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FeathersService,
    AuthGuardService,
    NonauthGuardService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
