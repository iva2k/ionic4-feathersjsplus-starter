import { Component, OnInit, ViewChild } from '@angular/core';
// import { NgZone } from '@angular/core';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { IonSlides, LoadingController, NavController, ToastController } from '@ionic/angular';

import { User } from '../../models/user';
import { FeathersService } from '../../services/feathers.service';

const animFormDuration = 400;  // Form input fields transition animation time
const animButtonsDurationMs = 1600; // Buttons transition animation time (in ms), longer than form to give visual sequence cue.

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  animations: [
    trigger('revealY', [ // Animation for form input fields upon change of mode
      state('*', style({ 'overflow-y': 'hidden' })),
      state('void', style({ 'overflow-y': 'hidden' })),
      transition(':enter', [
        style({height: '0'}),
        animate(animFormDuration,
          style({height: '*'}))
      ]),
      transition(':leave', [
        style({height: '*'}),
        animate(animFormDuration + 'ms ' + (2 * animFormDuration) + 'ms', // Delay leave so fields disappear sequentially
          style({height: '0'}))
      ])
    ]),
    trigger('revealY1', [ // Animation for form input fields upon change of mode
      state('*', style({ 'overflow-y': 'hidden' })),
      state('void', style({ 'overflow-y': 'hidden' })),
      transition(':enter', [
        style({height: '0'}),
        animate(animFormDuration + 'ms ' + (1 * animFormDuration) + 'ms', // Delay enter so fields appear sequentially
          style({height: '*'}))
      ]),
      transition(':leave', [
        style({height: '*'}),
        animate(animFormDuration + 'ms ' + (1 * animFormDuration) + 'ms', // Delay leave so fields disappear sequentially
          style({height: '0'}))
      ])
    ]),
    trigger('revealY2', [ // Animation for form input fields upon change of mode
      state('*', style({ 'overflow-y': 'hidden' })),
      state('void', style({ 'overflow-y': 'hidden' })),
      transition(':enter', [
        style({height: '0'}),
        animate(animFormDuration + 'ms ' + (2 * animFormDuration) + 'ms', // Delay enter so fields appear sequentially
          style({height: '*'}))
      ]),
      transition(':leave', [
        style({height: '*'}),
        animate(animFormDuration,
          style({height: '0'}))
      ])
    ]),
  ]
})
export class LoginPage implements OnInit {
  @ViewChild('entryFocus') entryFocus;
  @ViewChild(IonSlides) buttons: IonSlides;
  protected mode = 'login';
  public loginForm: FormGroup;

  private loading: Promise<HTMLIonLoadingElement> | null;
  private credentials: User = { email: '', password: '' } as User;
  protected error: string;
  retUrl: string;

  protected slideOpts = {
    allowTouchMove: false, // Slides moved programmatically only
  };

  protected logins = [];

  constructor(
    private feathersService: FeathersService,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    // private ngZone: NgZone,
    private toastCtrl: ToastController
  ) {
    this.logins = this.feathersService.getSocialLogins();

    const required    = Validators.required;
    const passSymbols = Validators.pattern('[0-9a-zA-Z*_\-]*');
    this.loginForm = formBuilder.group({
      email    : [        this.credentials.email                     , Validators.compose([required, Validators.minLength(5) ]) ],
      password : [{value: this.credentials.password , disabled: true}, Validators.compose([required, passSymbols]) ],
      firstName: [{value: this.credentials.firstName, disabled: true}, Validators.compose([required ]) ],
      lastName : [{value: this.credentials.lastName , disabled: true}, Validators.compose([required ]) ],
    });
  }

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.retUrl  = params.get('retUrl') || '/menu/app/tabs/todos'; // TODO: Let the router sort out which page to go to based on authentication.
      if (this.retUrl) {
// TODO: (now) let app know of this.retUrl so it can navigate properly
      }
      const error    = params.get('error'); // If past login attempt failed, we will get an error.
      const activity = params.get('activity') || '';
      const command  = params.get('command')  || '';
      if (error) {
        this.presentServerError(error, activity, command);
      }

      console.log('LoginPage/ngOnInit retUrl: %s, error: %s, activity: %s, command: %s', this.retUrl, error, activity, command);
    });
    this.onModeChanged({});
  }

  onModeChanged($event: any) {
    if (this.mode === 'register') {
      this.loginForm.get('password' ).enable();
      this.loginForm.get('firstName').enable();
      this.loginForm.get('lastName' ).enable();
      this.buttons.slideTo(2, animButtonsDurationMs);
    } else if (this.mode === 'login') {
      this.loginForm.get('password' ).enable();
      this.loginForm.get('firstName').disable();
      this.loginForm.get('lastName' ).disable();
      this.buttons.slideTo(1, animButtonsDurationMs);
    } else if (this.mode === 'reset') {
      this.loginForm.get('password' ).disable();
      this.loginForm.get('firstName').disable();
      this.loginForm.get('lastName' ).disable();
      this.buttons.slideTo(0, animButtonsDurationMs);
    }
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

  private onLoginSuccess(user) {
    const message = 'Successfully signed in as ' + user.email;
    this.toaster(message);
    console.log('User %s loggeed in.', user.email);
    this.hideLoading();
    // The app will switch pages via Events from service.
    // e.g. this.navCtrl.setRoot('MenuPage', {}, {animate: false});
    // this.navCtrl.navigateRoot(this.retUrl, {animated: false});
  }

  private showLoading(activity: string) {
    // Wrapper to manage LoadingController async nature
    this.error = '';
    const message = 'Please wait,<br/>' + activity + '...';
    if (this.loading) {
      this.loading.then(l => {
        // this.ngZone.run(() => { // Update message in the existing box
        l.message = message;
        // });
      }).catch(e => { // Discard past errors
        this.loading = null;
        this.showLoading(activity); // Open new box in case of error
      });
      return;
    } // else ... // Create new
    this.loading = this.loadingController.create({
      message,
      // ?dismissOnPageChange: true,
      // spinner: 'lines' | 'lines-small' | 'bubbles' | 'circles' | 'crescent' | 'dots' | null,
      cssClass: 'loading',
    });
    this.loading.then(l => {
      l.present();
    });
  }

  private hideLoading() {
    if (!this.loading) { return; }
    this.loading.then(l => {
      setTimeout(() => {
        l.dismiss();
        this.loading = null;
      }, 0);
    }).catch(e => { // Discard past errors
      this.loading = null;
    });
  }

  onLogin() {
    if (!this.checkForm()) { return; }
    this.showLoading('Signing in');
    this.feathersService.authenticate(this.credentials).then((user) => {
      this.onLoginSuccess(user);
    }).catch((error) => {
      this.presentServerError(error, 'Signing in', 'authenticate');
    });
  }

  onRegister() {
    if (!this.checkForm()) { return; }
    this.showLoading('Registering');
    this.feathersService.checkUnique({ email: this.credentials.email }).then(() => { // Email is unique
      this.feathersService.register(this.credentials).then((user) => {
        console.log('User created.');
        this.onLoginSuccess(user);
      }).catch(error => {
        this.presentServerError(error, 'Registering', 'register');
      });
    }).catch((err) => { // Email is already registered, or all other errors
      this.presentServerError(err, 'Registering', 'checkEmailUnique');
    });
  }

  onReset() {
    if (!this.checkForm()) { return; }
    this.showLoading('Resetting Password');
    this.feathersService.resetPasswordRequest({ email: this.credentials.email }).then((user) => {
      // sanitized user {_id, email, avatar}
      this.hideLoading();
      console.log('Password reset request sent to %s', user.email);
      this.toaster('Password reset request sent to ' + user.email);
    }).catch((err) => {
      this.presentServerError(err, 'Resetting Password', 'reset');
    });
  }

  onFormEnterKey() {
    if (this.mode === 'register') {
      return this.onRegister();
    } else if (this.mode === 'login') {
      return this.onLogin();
    } else if (this.mode === 'reset') {
      return this.onReset();
    }
  }

  onLoginWith(social) {
    this.showLoading('Signing in with ' + social.title);
    console.log('log in with ' + social.title);
    this.feathersService.loginWith(social).then((user) => {
      if (user) {
        this.onLoginSuccess(user);
      } else {
        this.showLoading('Registering app with ' + social.title);
        // Login will complete in a callback, possibly even with app reload. Event will be delivered to the app, which will switch pages or open us with an error info.
      }
    }).catch((error) => {
      this.presentServerError(error, 'Signing in with ' + social.title, 'authenticate');
    });
  }

  /**
   * Post error message on UI
   * @param error Error object: { message, name? }
   * @param activity 'Signing in ...' and similar text, suitable for showing in UI.
   * @param command 'authenticate', 'validate', 'register', 'reset', 'checkEmailUnique'
   */
  private presentServerError(error, activity: string, command: string) {
    this.hideLoading();

    // By default pass through unknown errors
    let message = error.message || 'Error: ' + error;

    // Translate cryptic/technical messages like 'socket timeout' to messages understandable by users, e.g. 'cannot reach server'.

    if (command === 'checkEmailUnique' && error.message === 'Values already taken.') {
      message = 'Email "' + this.credentials.email + '" is already registered.'
        + ' Please enter your password and click "Login", or click "Forgot" to recover your password.';
    }

    if (error.name === 'Timeout' || error.message === 'Socket connection timed out') {
      message = 'Cannot reach the server. Check your connection and try again.';
    }

    console.log('presentServerError() result: "%s", activity: \'%s\', command: \'%s\', error: %o', message, activity, command, error);
    this.error = message;
  }

  private toaster(text: string, time: number = 3000) {
    this.toastCtrl.create({
      message: text,
      duration: time,
    }).then(toast => {
      toast.present();
      // setTimeout(() => toast.dismiss(), time);
    });
  }

}
