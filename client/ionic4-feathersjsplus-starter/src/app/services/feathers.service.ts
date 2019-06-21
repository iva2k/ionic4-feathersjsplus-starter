import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // For fetching server.json file in dev mode.
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Events } from '@ionic/angular';

import * as io from 'socket.io-client';

// import feathers from '@feathersjs/rest-client';
// import feathers from '@feathersjs/primus-client';
// import socketio from '@feathersjs/socketio-client';
// ?import feathersAuthClient from '@feathersjs/authentication-client';
import feathers from '@feathersjs/client';
import AuthManagement from 'feathers-authentication-management/lib/client';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';

import hello from 'hellojs';

import { User } from '../models/user';

const defaultApiUrl = 'http://localhost:3030'; // TODO: (soon) move to config/env files.

// Base type for all record data types, used by DataSubscriber.
export interface Record {
    _id: string;
}

export class DataSubscriber<T extends Record> {
  private dataStore: {
    records: T[];
  };
  private records$: Observable<T[]>;
  private observer: Observer<T[]>;
  private feathersService: any;
  private subscription: Subscription;
  // protected query: {};

  constructor(
    feathersService: any,
    cbData: (records: any) => void,
    cbErr: (err: any) => void
  ) {
    this.feathersService = feathersService;
    this.feathersService.on('created', record => this.onCreated(record));
    this.feathersService.on('updated', record => this.onUpdated(record));
    this.feathersService.on('removed', record => this.onRemoved(record));

    this.records$ = new Observable(observer => (this.observer = observer));
    this.dataStore = { records: [] };
    this.subscription = this.records$.subscribe(cbData, cbErr);
  }

  public find(query) {
    // this.query = query;
    return this.feathersService.find({ query })
      .then( (records: any) => { // records.data: T[]
        this.dataStore.records = records.data;
        this.observer.next(this.dataStore.records);
      })
      .catch( (err) => {
        console.error('[FeathersService] Error in find: %o query: %o', err, query);
      });
  }

  public unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  private getIndex(id: string): number {
    let foundIndex = -1;

    for (let i = 0; i < this.dataStore.records.length; i++) {
      if (this.dataStore.records[i]._id === id) {
        foundIndex = i;
      }
    }

    return foundIndex;
  }

  private onCreated(record: T) {
    this.dataStore.records.push(record);
    this.observer.next(this.dataStore.records);
  }

  private onUpdated(record: T) {
    const index = this.getIndex(record._id);
    if (index >= 0) {
      this.dataStore.records[index] = record;
      this.observer.next(this.dataStore.records);
    }
  }

  private onRemoved(record: T) {
    const index = this.getIndex(record._id);
    if (index >= 0) {
      this.dataStore.records.splice(index, 1);
      this.observer.next(this.dataStore.records);
    }
  }

}

@Injectable({
  providedIn: 'root'
})
export class FeathersService {

  private fc = feathers(); // feathers client
  private socket: SocketIOClient.Socket; // opened socket
  private feathersInit: Promise<void>; // Promise that resolves after this.fc is fully initialized and configured.
  public apiUrl = ''; // endpoint url in use
  private authManagement;

  // TODO: (soon) Provide socialLogins from server (single point of authority), including client_id.
  private socialLogins = [
    // tslint:disable-next-line: max-line-length
    {title: 'Google Hello', name: 'google'     , icon: 'logo-google'  , url: ''              , client_id: '411586170471-ijmn4j0hoaote48id4pami5tr3u24t8d.apps.googleusercontent.com' }, // Use local Hello.js method (client_id)
  ];

  private loginState: boolean; // undefined=initial, true=loggedin, false=loggedout
  private reauth; // Stored login credentials for reauth if session fails.
  private errorHandler = (error) => {
    if (this.reauth) {
      console.log('[FeathersService] authentication error, re-authenticating...');
      this._authenticate(this.reauth)
        // .then( (user) => {})
        ;
    } else {
      // this.reauth = null;
      // this.fc.removeListener('reauthentication-error', this.errorHandler);
      console.log('[FeathersService] authentication error, but no credentials saved.');
    }
  }

  constructor(
    public events: Events,
    public http: HttpClient,
    private router: Router,
  ) {
    this.feathersInit = this.initFeathers();
  }

  private initFeathers(): Promise<void> {
    // Featch server.json
    const url = 'assets/server.json';
    return this.getJsonData(url).then(data => {
      console.log('[FeathersService] Loaded "%s", data: %o', url, data);
      if (!data.port || !(data.ip4 || data.ip6)) {
        throw new Error('Invalid data in "' + url + '"');
      }
      return 'http://' + (data.ip4 || data.ip6) + ':' + data.port;
    }).catch((error) => {
      // Ignore fetch error, use default
      console.log('[FeathersService] Failed reading "%s": %o', url, error);
      console.log('[FeathersService] Using default API URL %s', defaultApiUrl);
      return defaultApiUrl;
    }).then((apiUrl) => {
      // Note: we explicitly set <void> type on promis to avoid issue <https://github.com/Microsoft/TypeScript/issues/8516>.
      return new Promise<void>((resolve) => {

        // Add socket.io plugin
        this.socket = io(apiUrl, {
          // transports: ['websocket'],
          // forceNew: true
        });
        this.apiUrl = apiUrl;

        // this.fc.configure(feathersSocketIOClient(this.socket));
        this.fc.configure(feathers.socketio(this.socket));

        // Add authentication plugin
        // ?this.fc.configure(feathersAuthClient({
        this.fc.configure(feathers.authentication({
          storage: window.localStorage
        }));

        // Add feathers-reactive plugin
        // ?this.fc.configure(feathersRx({ idField: '_id' }));

        this.authManagement = new AuthManagement(this.fc);

        this.initHello();

        this.loginState = false;

        console.log('[FeathersService] Done initializing feathers client at %s.', apiUrl);
        resolve();
      });
    });
  }

  private getJsonData(url: string): Promise<any> {
    return this.http.get(url).toPromise()
      // .then((data: any) => {
      //   // console.log('[FeathersService] getJsonData(%s) success data:', url, data);
      //   return data;
      // })
      // .catch(err => {
      //   // console.log('[FeathersService] Failed reading "%s", error: %o', url, err);
      //   throw err;
      // })
    ;
  }

  // Expose services
  public service(name: string) {
    return this.fc.service(name);
  }

  // Expose authentication management - check if credentials.email is not registered
  public checkUnique(credentials): Promise<any> {
    return this.authManagement.checkUnique(credentials);
  }

  // Expose authentication management - request password reset for credentials.email
  public resetPasswordRequest(credentials): Promise<any> {
    const options = { preferredComm: 'email' }; // passed to options.notifier, e.g. {preferredComm: 'email'}
    return this.authManagement.sendResetPwd(credentials, options);
  }

  // Expose authentication management - reset password to credentials.password using resetToken, received following resetPasswordRequest()
  public resetPassword(resetToken, credentials): Promise<any> {
    return this.authManagement.resetPwdLong(resetToken, credentials.password);
  }

  // Expose authentication management
  // Reset password to credentials.password using short resetToken, received following TODO: resetPasswordRequest()??
  public resetPasswordShort(resetToken, credentials): Promise<any> {
    return this.authManagement.resetPwdShort(resetToken, { email: credentials.email}, credentials.password);
  }

  // Internal authentication implementation. Does not track this.loginState, caller must do it.
  private _authenticate(credentials?): Promise<any|User> {
    this.reauth = null; // Remove stored credentials
    this.fc.removeListener('reauthentication-error', this.errorHandler);
    if (credentials && credentials.email) {
      credentials.strategy = credentials.strategy || 'local';
    }
    let reauth;
    return this.fc.authenticate(credentials)
      .then(response => {
        console.log('[FeathersService] _authenticate() - authenticate response: ', response);
        // TODO:
        // Can response.accessToken live across server restarts? Its the purpose of JWT. How can we verify that?
        // What about accessToken limited lifetime? Does feathers client keep the tabs on storing login and
        // renewing accessToken?? How can we verify that?
        // If we can't use this.reauth = response; then save user credentials with email/password. Implement
        // encrypted persistent store.
        reauth = response; // save until JWT is verified.
        return this.fc.passport.verifyJWT(response.accessToken);
      })
      .then(payload => {
        console.log('[FeathersService] _authenticate() - JWT payload: ', payload);
        if (reauth) {
          this.reauth = reauth;
          this.fc.on('reauthentication-error', this.errorHandler);
        }
        return this.fc.service('users').get(payload.userId);
      })
      .then(user => {
        this.fc.set('user', user);
        console.log('[FeathersService] _authenticate() - User: ', this.fc.get('user'));
        return Promise.resolve(user);
      })
    ;
  }

  // Expose authentication
  public authenticate(credentials?): Promise<any|User> {
    if (this.loginState) {
      return Promise.resolve(this.fc.get('user'));
    }
    return this.feathersInit.then(() => {
      return this._authenticate(credentials)
        .then( (user) => {
          // if (!this.loginState) {
          this.events.publish('user:login', user);
          this.loginState = true;
          // }
          return Promise.resolve(user);
        });
    });
  }
  private authenticateNoEvents(credentials?): Promise<any|User> {
    if (this.loginState) {
      return Promise.resolve(this.fc.get('user'));
    }
    return this.feathersInit.then(() => {
      return this._authenticate(credentials)
        .then( (user) => {
          // if (!this.loginState) {
          // this.events.publish('user:login', user);
          this.loginState = true;
          // }
          return Promise.resolve(user);
        });
    });
  }

  // Expose registration
  public register(credentials): Promise<any|User> {
    if (this.loginState) {
      return Promise.reject(new Error('Already logged in'));
    }
    if (!credentials || !credentials.email || !credentials.password) {
      return Promise.reject(new Error('No credentials'));
    }
    this.reauth = null;
    this.fc.removeListener('reauthentication-error', this.errorHandler);
    return this.fc.service('users').create(credentials)
      .then(() => {
        return this._authenticate(credentials)
          .then((user) => {
            this.events.publish('user:login', user);
            this.loginState = true;
            return Promise.resolve(user);
          });
      })
    ;
  }

  // UNUSED
  // public hasValidIdToken(): Promise<any> {
  //   console.log('[FeathersService] hasValidIdToken(): checking saved auth token...');
  //   return this._authenticate()
  //     .then((user) => {
  //       console.log('[FeathersService] hasValidIdToken(): has valid saved auth token.');
  //       // this.events.publish('user:login', user); // caller is responsible to post proper events
  //       return true;
  //     })
  //     .catch((err) => {
  //       console.log('[FeathersService] hasValidIdToken(): no valid saved auth token.');
  //       return Promise.reject(err);
  //     })
  //   ;
  //   // Use as:
  //   // feathersService.hasValidIdToken().then(() => {
  //   //   // show application page
  //   //   ...
  //   // }).catch(() => {
  //   //   // show login page
  //   //   ...
  //   // })
  // }

  public getSocialLogins(): any[] {
    return this.socialLogins;
  }

  // Hello.js Integration
  private initHello() {
    // let loc = window.location.href.split('#')[0];
    const socials = this.getSocialLogins();
    const clientIds = {};
    for (const social of socials) {
      if (social.client_id) {
        clientIds[social.name] = social.client_id;
      }
    }
    hello.init(clientIds, {
      // redirect_uri: loc, // 'http://localhost:8000',
      // TODO: (later) real URL for the client (or the server??), lightweight auth entry page
    });
    hello.on('auth.login', (auth) => { this.onHelloLogin.call(this, auth); } );
    hello.on('auth.logout', (data) => { this.onHelloLogout.call(this, data); } );
  }
  private onHelloLogin(auth) {
    console.log('[FeathersService] onHelloLogin() auth: ', auth);
    // get social token, user's social id and user's email
    const socialToken = auth.authResponse.access_token;
    // TODO: (later) For OAuth1 (twitter,dropbox,yahoo), it could be:
    // socialToken = auth.authResponse.oauth_token; let secret = auth.authResponse.oauth_token_secret;

    // To get some info (synchronous):
    // let session = hello(auth.network).getAuthResponse(); let { access_token, expires } = session;
    return hello(auth.network).api('me').then(userInfo => {
      console.log('[FeathersService] onHelloLogin() userInfo: ', userInfo);

      // Avoid repeating login
      if (this.loginState) {
        console.log('[FeathersService] onHelloLogin() already logged in, skipping re-authentication');
        return; // TODO: (now) what shall we return from onHelloLogin()? return Promise.resolve();
      }

      // Send the info to the backend for authentication
      const userId = userInfo.id;
      const userEmail = userInfo.email;
      return this._authenticate({
        strategy    : 'social_token',
        network     : auth.network,
        email       : userEmail,
        socialId    : userId,
        socialToken
      }).then( (user) => {
        // This completes the login - server got validation and issued us JWT.
        console.log('[FeathersService] onHelloLogin() auth user=%o', user);
        if (!this.loginState) {
          this.events.publish('user:login', user);
          this.loginState = true;
        }
        this.loginHelloDispose( { name: auth.network } ).catch(() => {});
      }).catch(error => {
        console.log('[FeathersService] onHelloLogin() auth error=%o', error);
        this.events.publish('user:failed', error,
          /* activity: */ 'Signing in with ' + auth.network
          /* TODO: (later) find social(.name == auth.network), use social.title */,
          /* command: */ 'validate');
        this.loginState = false;
      });
    }, error => {
      console.log('[FeathersService] onHelloLogin() api error=%o', error);
      this.events.publish('user:failed', error,
        /* activity: */ 'Signing in with ' + auth.network
        /* TODO: (later) find social(.name == auth.network), use social.title */,
        /* command: */ 'authenticate');
      this.loginState = false;
  });
  }
  private onHelloLogout(data) {
    console.log('[FeathersService] onHelloLogout() data: ', data);
  }

  private loginHello(social, display: hello.HelloJSDisplayType = 'page'): Promise<any> {
    return new Promise((resolve, reject) => {
      hello(social.name).login({
        scope: 'email',
        display, // 'popup' (default), 'page' or 'none' ('none' to refresh access_token in background, useful for reauth)
        // redirect_uri: 'http://localhost:8000',
        // Can customize app integration here. Hello.js adds its state to the query and will retrieve its data
        // from query part from the redirect_uri upon reentry.
        // - it is fixed (set in oauth2 provider), and only variable part can be passed via state param.
        // TODO: (now) Google gets redirect_uri that it barks on:
        // https://accounts.google.com/o/oauth2/v2/auth
        //  ?client_id=<YOUR_CLIENT_ID>
        //  &response_type=token
        // BAD: &redirect_uri=http%3A%2F%2Flocalhost%3A8100%2Flogin%3Ferror%3D%255Bobject%2520Object%255D%26activity%3DSigning%2520in%2520with%2520Google%2520Hello%26command%3Dauthenticate
        //  &state=%7B%22client_id%22%3A%22 <YOUR_CLIENT_ID>
        //    %22%2C%22network%22%3A%22google%22%2C%22display%22%3A%22popup%22%2C%22callback%22%3A%22_hellojs_3e2aqrxw%22%2C%22state%22%3A%22%22%2C%22redirect_uri%22%3A%22http%3A%2F%2Flocalhost%3A8100%2Flogin%3Ferror%3D%255Bobject%2520Object%255D%26activity%3DSigning%2520in%2520with%2520Google%2520Hello%26command%3Dauthenticate%22%2C%22scope%22%3A%22basic%2Cemail%22%7D
        //  &scope=openid%20profile%20email
        // Sends to oauth2 provider, e.g.:
        // https://accounts.google.com/o/oauth2/auth
        //  ?client_id=<YOUR_CLIENT_ID>
        //  &response_type=token
        //  &redirect_uri=http%3A%2F%2Flocalhost%3A8000%2F
        //  &amp; state=%7B%22client_id%22%3A%22 <YOUR_CLIENT_ID>
        //    %22%2C%22network%22%3A%22google%22%2C%22display%22%3A%22popup%22%2C%22callback%22%3A%22_hellojs_2bgwc1py%22%2C%22state%22%3A%22%22%2C%22redirect_uri%22%3A%22http%3A%2F%2Flocalhost%3A8000%2F%22%2C%22scope%22%3A%22basic%2Cemail%22%7D
        //  &scope=https://www.googleapis.com/auth/plus.me%20profile%20email
    }).then(() => {
        console.log('[FeathersService] loginHello() callback');
        // We are not done yet, this.onHelloLogin() will be called from Hello.js upon receipt of server confirmation (possible app reload)
        // this.events.publish('user:login', user); // (if successful) will be called from this.onHelloLogin().
        resolve();
      }, (details) => {
        console.log('[FeathersService] loginHello() error, details: %o', details);
        this.events.publish('user:failed', details.error, 'Signing in with ' + social.title, 'authenticate');
        this.loginState = false;
        reject(details.error);
      });
    });
  }
  private loginHelloDispose(social): Promise<any> {
    // Remove session (but keep logged in with provider).
    return new Promise((resolve, reject) => {
      hello(social.name).logout().then(() => {
        console.log('[FeathersService] loginHelloDispose() callback');
        resolve();
      }, (details) => {
        console.log('[FeathersService] loginHelloDispose() error, details: %o', details);
        reject(details.error);
      });
    });
  }

  public loginWith(social): Promise<any> {
    console.log('[FeathersService] loginWith() social: %o', social);
    if (social.client_id) {
      return this.loginHello(social);
    }
    if (social.login) {
      return social.login.call(this, social);
    }
    if (social.url) {
      // TODO: (soon) return this.openWebpage(social.url);
    }
    return Promise.reject(new Error('Bad argument'));
  }

  // Guard method for views that must be logged in (e.g. user and data)
  public authGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> { // enforceValidIdToken
    const pageUrl = state.url;
    console.log('[FeathersService] authGuard(%s): checking saved auth token...', pageUrl);
    // const redirectUrl = '/login'; // TODO: (soon) this should not be defined in the service. Refactor it out of here.

    return this.authenticateNoEvents()
      .then((user) => {
        // Ok
        console.log('[FeathersService] authGuard(%s): has valid saved auth token, ok.', pageUrl);
        return true;
      })
      .catch((err) => {
        // Force auth guard
        // const urlTree = this.router.createUrlTree([redirectUrl], { queryParams: { retUrl: pageUrl } });
        // console.log('[FeathersService] authGuard(%s): no valid saved auth token, redirecting to %s.', pageUrl, urlTree.toString());
        // return urlTree; // Angular >= 7.1 router
        console.log('[FeathersService] authGuard(%s): no valid saved auth token, calling guard:login.', pageUrl);
        this.events.publish('guard:login', pageUrl); // must login, then can go to page
        return Promise.reject(err);
      })
    ;
  }

  // Guard method for views that must be logged out (e.g. login/register)
  public nonauthGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> { // enforceInvalidIdToken
    const pageUrl = state.url;
    console.log('[FeathersService] nonauthGuard(%s): checking saved auth token...', pageUrl);
    // const redirectUrl = '/menu/app/tabs/todos'; // TODO: (soon) this should not be defined in the service. Refactor it out of here.

    let guard = false; // Track if guard was triggered for last .catch
    return this.authenticateNoEvents()
      .then((user) => {
        // Force login guard
        // console.log('[FeathersService] nonauthGuard(%s): has valid saved auth token, redirecting to %s.', pageUrl, redirectUrl);
        // return this.router.parseUrl(redirectUrl); // Angular >= 7.1 router
        guard = true;
        console.log('[FeathersService] nonauthGuard(%s): has valid saved auth token, calling guard:logout.', pageUrl);
        this.events.publish('guard:logout', pageUrl); // must logout, then can go to page
        return Promise.reject(new Error('Already logged in'));
      })
      .catch((err) => {
        // Only Reject/Error in this._authenticate() should return true.
        // Make sure errors in .then() will not return true.
        if (guard) {
          return err;
        }
        // Ok
        console.log('[FeathersService] nonauthGuard(%s): no valid saved auth token, ok.', pageUrl);
        return true;
      })
    ;
  }

  public getUserInfo() {
    return this.fc.get('user');
  }

  // Internal logout worker
  private _logout(): Promise<any> {
    console.log('[FeathersService] _logout()');
    // this.reauth = null;
    // this.fc.removeListener('reauthentication-error', this.errorHandler);
    return this.fc.logout()
      .then((result) => {
        this.events.publish('user:logout');
        this.loginState = false;
        return result;
      })
      .catch((error) => {
        console.log('[FeathersService] _logout() error: %o', error);
        this.events.publish('user:logout');
        // We report logout to the app. Most likely server did not respond, but we wiped out our tokens.
        this.loginState = false;
        // return error; // Nobody cares about logout error. Consider being logged out.
      });
  }

  // Expose logout
  public logout(): Promise<any> {
    console.log('[FeathersService] logout()');
    this.reauth = null;
    this.fc.removeListener('reauthentication-error', this.errorHandler);
    return this._logout();
  }

  // Observable Service API
  // Usage:
  //  import { FeathersService, DataSubscriber } from "../../providers/feathers/feathers";
  //  ...
  //  class ... {
  //    private subscription: DataSubscriber;
  //    constructor(feathersService: FeathersService) {} ...
  //    ngOninit() {
  //      this.subscription = this.feathersService.subscribe<Todo>('todos', query,
  //        (records: Todo[]) => {
  //          this.records = records;
  //          this.ref.markForCheck();
  //        },
  //        err => {
  //          console.error('[FeathersService] Error in subscribe(): ', err);
  //        });
  //    }
  //    ngOnDestroy() {
  //      if (this.subscription) this.subscription.unsubscribe();
  //    }
  //  }

  // ?private subscribers[]: DataSubscriber<any>[];
  public subscribe<T extends Record>(service: string, query: any, cbData: (records: any) => void, cbErr: (err: any) => void): any {
    const subscriber = new DataSubscriber<T>(this.service(service), cbData, cbErr);
    subscriber.find(query)
      .catch(err => { cbErr(err); })
    ;
    // ?this.subscribers.push(subscriber);
    return subscriber;
  }

  public create<T extends Record>(service: string, record: T): Promise<T> {
    record._id = null; // Create should not try to set _id.
    return this.service(service)
      .create(record)
    ;
  }

  public update<T extends Record>(service: string, record: T): Promise<T> {
    if (!record._id) { return Promise.reject(new Error('_id must be set')); }
    return this.service(service)
      .update(record._id, record)
    ;
  }

  public remove<T extends Record>(service: string, record: T): Promise<T> {
    if (!record._id) { return Promise.reject(new Error('_id must be set')); }
    return this.service(service)
      .remove(record._id)
    ;
  }

}
