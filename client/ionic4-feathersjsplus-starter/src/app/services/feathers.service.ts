import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // For fetching server.json file in dev mode.
import 'rxjs/add/operator/toPromise';

// ?import * as feathersRx from 'feathers-reactive';
import * as io from 'socket.io-client';

// import feathers from '@feathersjs/rest-client';
// import feathers from '@feathersjs/primus-client';
// import socketio from '@feathersjs/socketio-client';
// ?import feathersAuthClient from '@feathersjs/authentication-client';
import feathers from '@feathersjs/client';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';

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
        console.error('Error in FeathersService find: %o query: %o', err, query);
      })
    ;
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

  private reauth; // Stored login credentials for reauth if session fails.
  private errorHandler = (error) => {
    if (this.reauth) {
      console.log('Feathers reauthentication-error, re-authenticating...');
      this.authenticate(this.reauth);
    // } else {
    //   this.reauth = null;
    //   this._feathers.removeListener('reauthentication-error', this.errorHandler);
    //   console.log('DEBUG: Feathers reauthentication-error, but no credentials saved.');
    }
  }

  constructor(
    public http: HttpClient,
  ) {
    this.feathersInit = this.initFeathers();
  }

  private initFeathers(): Promise<void> {
    // Featch server.json
    const url = 'assets/server.json';
    return this.getJsonData(url).then(data => {
      console.log('Loaded "%s", data: %o', url, data);
      if (!data.port || !(data.ip4 || data.ip6)) {
        throw new Error('Invalid data in "' + url + '"');
      }
      return 'http://' + (data.ip4 || data.ip6) + ':' + data.port;
    }).catch((error) => {
      // Ignore fetch error, use default
      console.log('Failed reading "%s": %o', url, error);
      console.log('Using default API URL %s', defaultApiUrl);
      return defaultApiUrl;
    }).then((apiUrl) => {
      return new Promise<void>((resolve) => {

        // Add socket.io plugin
        this.socket = io(apiUrl, {
          // transports: ['websocket'],
          // forceNew: true
        });
        this.apiUrl = apiUrl;

        // this._feathers.configure(feathersSocketIOClient(this._socket));
        this.fc.configure(feathers.socketio(this.socket));

        // Add authentication plugin
        // ?this._feathers.configure(feathersAuthClient({
        this.fc.configure(feathers.authentication({
          storage: window.localStorage
        }));

        // Add feathers-reactive plugin
        // ?this._feathers.configure(feathersRx({ idField: '_id' }));

        console.log('Done initializing feathers client at %s.', apiUrl);
        resolve();
      });
    });
  }

  private getJsonData(url: string): Promise<any> {
    return this.http.get(url).toPromise()
      // .then((data: any) => {
      //   // console.log('getJsonData(%s) success data:', url, data);
      //   return data;
      // })
      // .catch(err => {
      //   // console.log('Failed reading "%s", error: %o', url, err);
      //   throw err;
      // })
    ;
  }

  // Expose services
  public service(name: string) {
    return this.fc.service(name);
  }

  // Expose authentication
  public authenticate(credentials?): Promise<any> {
    // ? if (this.feathersInit === undefined) {
    //     return this._authenticate(credentials);
    //   }
    // .then is called even if this.feathersInit has already been resolved.
    return this.feathersInit.then(() => {
      return this._authenticate(credentials);
    });
  }
  private _authenticate(credentials?): Promise<any> {
    this.reauth = null; // Remove stored credentials
    this.fc.removeListener('reauthentication-error', this.errorHandler);
    if (credentials && credentials.email) {
      credentials.strategy = credentials.strategy || 'local';
    }
    let reauth;
    return this.fc.authenticate(credentials)
      .then(response => {
        console.log('Authenticated: ', response);
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
        console.log('JWT Payload: ', payload);
        if (reauth) {
          this.reauth = reauth;
          this.fc.on('reauthentication-error', this.errorHandler);
        }
        return this.fc.service('users').get(payload.userId);
      })
      .then(user => {
        this.fc.set('user', user);
        console.log('User: ', this.fc.get('user'));
      })
    ;
  }

  // Expose registration
  public register(credentials): Promise<any> {
    if (!credentials || !credentials.email || !credentials.password) {
      return Promise.reject(new Error('No credentials'));
    }
    this.reauth = null;
    this.fc.removeListener('reauthentication-error', this.errorHandler);
    return this.fc.service('users').create(credentials)
      .then(() => this.authenticate(credentials))
    ;
  }

  public getUserInfo() {
    return this.fc.get('user');
  }

  // Expose logout
  public logout(nav: any): Promise<any> {
    this.reauth = null;
    this.fc.removeListener('reauthentication-error', this.errorHandler);
    return this.fc.logout()
      .then((result) => {
        return result;
      })
      .catch((error) => {
        console.log(error);
        // return error; // Nobody cares about logout error.
      })
    ;
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
  //          console.error('Error in subscribe to feathersService.subscribe(): ', err);
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
    if (!record._id) { return Promise.reject('_id must be set'); }
    return this.service(service)
      .update(record._id, record)
    ;
  }

  public remove<T extends Record>(service: string, record: T): Promise<T> {
    if (!record._id) { return Promise.reject('_id must be set'); }
    return this.service(service)
      .remove(record._id)
    ;
  }

}
