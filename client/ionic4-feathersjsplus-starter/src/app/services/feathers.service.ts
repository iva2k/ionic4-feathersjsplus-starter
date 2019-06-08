import { Injectable } from '@angular/core';

// ?import * as feathersRx from 'feathers-reactive';
import * as io from 'socket.io-client';

// import feathers from '@feathersjs/rest-client';
// import feathers from '@feathersjs/primus-client';
// import socketio from '@feathersjs/socketio-client';
// ?import feathersAuthClient from '@feathersjs/authentication-client';
import feathers from '@feathersjs/client';

@Injectable({
  providedIn: 'root'
})
export class FeathersService {

  apiUrl = 'http://localhost:3030';
//  apiUrl = 'https://jsonplaceholder.example.com';

  private _feathers = feathers();
  private _socket;

  private reauth; // Stored login credentials for reauth if session fails.
  private errorHandler = (error) => {
    if (this.reauth) {
      console.log('Feathers reauthentication-error, re-authenticating...');
      this.authenticate(this.reauth);
    } else {
      this.reauth = null;
      console.log('DEBUG: Feathers reauthentication-error, but no credentials saved.');
    }
  }

  constructor() {
    // Add socket.io plugin
    this._socket = io(this.apiUrl, {
//      transports: ['websocket'],
//      forceNew: true
    });
    // this._feathers.configure(feathersSocketIOClient(this._socket));
    this._feathers.configure(feathers.socketio(this._socket));

    // Add authentication plugin
    // ?this._feathers.configure(feathersAuthClient({
    this._feathers.configure(feathers.authentication({
      storage: window.localStorage
    }));

    // Add feathers-reactive plugin
    // ?this._feathers.configure(feathersRx({ idField: '_id' }));

  }

  // Expose services
  public service(name: string) {
    return this._feathers.service(name);
  }

  // Expose authentication
  public authenticate(credentials?): Promise<any> {
    this.reauth = null; // Remove stored credentials
    if (credentials && credentials.email) {
      credentials.strategy = credentials.strategy || 'local';
    }
    let reauth;
    return this._feathers.authenticate(credentials)
      .then(response => {
        console.log('Authenticated: ', response);
        // TODO:
        // Can response.accessToken live across server restarts? Its the purpose of JWT. How can we verify that?
        // What about accessToken limited lifetime? Does feathers client keep the tabs on storing login and
        // renewing accessToken?? How can we verify that?
        // If we can't use this.reauth = response; then save user credentials with email/password. Implement
        // encrypted persistent store.
        reauth = response; // save until JWT is verified.
        return this._feathers.passport.verifyJWT(response.accessToken);
      })
      .then(payload => {
        console.log('JWT Payload: ', payload);
        if (reauth) {
          this.reauth = reauth;
          this._feathers.on('reauthentication-error', this.errorHandler);
        }
        return this._feathers.service('users').get(payload.userId);
      })
      .then(user => {
        this._feathers.set('user', user);
        console.log('User: ', this._feathers.get('user'));
      })
    ;
  }

  // Expose registration
  public register(credentials): Promise<any> {
    if (!credentials || !credentials.email || !credentials.password) {
      return Promise.reject(new Error('No credentials'));
    }
    this.reauth = null;
    return this._feathers.service('users').create(credentials)
      .then(() => this.authenticate(credentials))
    ;
  }

  public getUserInfo() {
    return this._feathers.get('user');
  }

  // Expose logout
  public logout(nav: any): Promise<any> {
    this.reauth = null;
    return this._feathers.logout()
      .then((result) => {
        return result;
      })
      .catch((error) => {
        console.log(error);
        // return error; // Nobody cares about logout error.
      })
    ;
  }
}
