import { Component, OnInit, ViewChild } from '@angular/core';
// import { NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';

import { User } from '../../models/user';
import { FeathersService } from '../../services/feathers.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  @ViewChild('entryFocus') entryFocus;
  @ViewChild('entryFocus2') entryFocus2;

  private loading: Promise<HTMLIonLoadingElement> | null;
  private credentials: User = { email: '', password: '' } as User;
  protected verificationToken: string = null;
  protected error: string;
  // protected showLogin = false; // TODO: Implement link to a login page
  protected showReset = false; // TODO: Implement link to a reset page, login page

  constructor(
    private feathersService: FeathersService,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    // private ngZone: NgZone,
    private toastCtrl: ToastController
  ) {
  }

  ngOnInit() {
   this.verificationToken = this.activatedRoute.snapshot.paramMap.get('token');
  }

  ionViewDidEnter() { // IONIC4
    console.log('ionViewDidEnter LoginPage');
    // Good UX: Move cursor to the first form field (marked by #entryFocus property in template).
    // Note: IONIC4 <ion-input autofocus ...> does not seem to be working (tested in Cromium browser).
    // If token is provided (from email URL), move straight to the 2nd field.
    if (!this.verificationToken) {
      this.entryFocus.setFocus();
    } else {
      this.entryFocus2.setFocus();
    }
  }

  ionViewWillLeave() {
    this.hideLoading();
  }

  public checkForm() {
      return true;
  }

  showLoading(activity: string) {
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
    })
  }

  hideLoading() {
    if (!this.loading) return;
    this.loading.then(l => {
      setTimeout(() => {
        l.dismiss();
        this.loading = null;
      }, 0);
    }).catch(e => { // Discard past errors
      this.loading = null;
    });
  }

  login(credentials, changedPass: boolean) {
    this.showLoading('Signing in');
    return this.feathersService.authenticate(credentials).then(() => {
      // this.hideLoading();
      let message = changedPass
        ? 'Successfully changed password and signed in as ' + credentials.email
        : 'Successfully signed in as ' + credentials.email;
      this.toaster(message);
      this.navCtrl.navigateRoot('/menu/app/tabs/todos', {animated: false});
    }).catch((error) => {
      this.presentServerError(error, 'Signing in', 'authenticate', changedPass);
    });
  }

  onResetPassword() {
    if (!this.checkForm()) { return; }
    this.showLoading('Changing Password');
    this.feathersService.resetPassword(this.verificationToken, this.credentials).then((user) => {
      // this.hideLoading();
      console.log('Successfully changed password, result: %o', user);
      // postpone till later: this.toaster('Successfully changed password for ' + user.email);

      // Automatically login after successful password change. That's what user is here for.
      user.password = this.credentials.password;
      this.login(user, true);
    }).catch((error) => {
      this.presentServerError(error, 'Changing password', 'resetPassword', false);
    });
  }

  private presentServerError(error, activity: string, command: string, changedPass: boolean) {
    this.hideLoading();

    // By default pass through unknown errors
    let message = error.message;

    // Translate cryptic/technical messages like 'socket timeout' to messages understandable by users, e.g. 'cannot reach server'.

    // if (command == 'resetPassword') {
    //   message = '';
    // }
    if ( error.message === 'Password reset token has expired.'
      || error.message === 'Invalid token. Get for a new one. (authManagement)'
    ) {
      message = 'Verification Code has expired. Please request a new one.';
      this.showReset = true;
    }

    if (error.name === 'Timeout' || error.message === 'Socket connection timed out') {
      message = 'Cannot reach the server. Check your connection and try again.';
    }

    if (changedPass) {
      message = 'Successfully changed password, but cannot login, error: ' + message;
      // ?this.showLogin = true;
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
