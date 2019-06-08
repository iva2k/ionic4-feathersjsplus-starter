import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';

import { FeathersService } from '../../services/feathers.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('email') email: any;

  loading: HTMLIonLoadingElement;
  credentials = { email: '', password: '' };
  protected error: string;
  retUrl: string;

  constructor(
    public feathersService: FeathersService,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.activatedRoute.queryParamMap
      .subscribe(params => {
        this.retUrl = params.get('retUrl') || '/menu/app/tabs/todos'; // TODO: Let the router sort out which page to go to based on authentication.
        console.log('LoginPage/ngOnInit ' + this.retUrl);
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    // Good UX: Move cursor to the first form field.
    setTimeout(() => {
      this.email.setFocus();
    }, 500);
  }

  ionViewWillLeave() {
    this.hideLoading();
  }

  showLoading(): Promise<any> {
    this.error = '';
    return this.loadingController.create({
      message: 'Please wait...',
      // ?dismissOnPageChange: true,
      // spinner: 'lines' | 'lines-small' | 'bubbles' | 'circles' | 'crescent' | 'dots' | null,
      cssClass: 'loading',
    }).then(l => {
      this.loading = l;
      this.loading.present();
    });
  }

  hideLoading() {
    if (this.loading) {
      this.loading.dismiss();
    }
    // or? this.loadingController.dismiss();
  }

  login() {
    this.showLoading().then(() => {
      return this.feathersService.authenticate(this.credentials);
    }).then(() => {
      // this.hideLoading();
      this.navCtrl.navigateRoot(this.retUrl, {animated: false});
    }).catch((error) => {
      this.hideLoading();
      console.error('User login error: ', error);
      this.error = error.message;
    });
  }

  register() {
    this.showLoading().then(() => {
      return this.feathersService.register(this.credentials);
    }).then(() => {
      // this.hideLoading();
      console.log('User created.');
      this.navCtrl.navigateRoot(this.retUrl, {animated: false});
    }).catch(error => {
      this.hideLoading();
      console.error('User registration error: ', error);
      this.error = error.message;
    });
  }
}
