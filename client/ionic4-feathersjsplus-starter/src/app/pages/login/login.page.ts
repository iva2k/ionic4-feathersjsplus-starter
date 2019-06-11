import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';

import { User } from '../../models/user';
import { FeathersService } from '../../services/feathers.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('entryFocus') entryFocus;
  public loginForm: FormGroup;

  loading: HTMLIonLoadingElement;
  credentials: User = { email: '', password: '' } as User;
  protected error: string;
  retUrl: string;

  constructor(
    private feathersService: FeathersService,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    formBuilder: FormBuilder,
  ) {
    this.loginForm = formBuilder.group({
      email   : [this.credentials.email, Validators.compose([Validators.required, Validators.minLength(5) ]) ],
      password: [this.credentials.password, Validators.compose([Validators.required, Validators.pattern('[0-9a-zA-Z*_\-]*') ]) ],
    });
  }

  ngOnInit() {
    this.activatedRoute.queryParamMap
      .subscribe(params => {
        this.retUrl = params.get('retUrl') || '/menu/app/tabs/todos'; // TODO: Let the router sort out which page to go to based on authentication.
        console.log('LoginPage/ngOnInit ' + this.retUrl);
      });
  }

  ionViewDidEnter() { // IONIC4
    console.log('ionViewDidEnter LoginPage');
    // Good UX: Move cursor to the first form field (marked by #entryFocus property in template).
    // Note: IONIC4 <ion-input autofocus ...> does not seem to be working (tested in Cromium browser).
    this.entryFocus.setFocus();
  }

  ionViewWillLeave() {
    this.hideLoading();
  }

  public checkForm() {
    if (this.loginForm.valid) {
      this.credentials = this.loginForm.value as User;
      return true;
    } else {
      // Not a valid input! TODO: (later) Implement user interaction?
      this.error = 'Please enter correct information';
      let sep = ' (';
      for (const key in this.loginForm.controls) {
        if (this.loginForm.controls.hasOwnProperty(key)) {
          const control = this.loginForm.controls[key];
          if (!control.valid) {
            this.error += sep + key;
            sep = ', ';
          }
        }
      }
      this.error += ').';
      return false;
    }
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
    if (!this.checkForm()) { return; }
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
    if (!this.checkForm()) { return; }
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
