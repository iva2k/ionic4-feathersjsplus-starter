import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

// Data Schema.
// Keyed by data schema version.
// When data schema needs to change, copy latest version schema to new incremented version.
const versions = {
  0.1: [
    { key: 'theme', type: 'string', default: '', },
  ],
};

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  private myVersion = ''; // Latest data schema version
  private mySchema = []; // Latest data schema
  private myKeys = []; // Keys from latest Data schema
  private myData = {}; // Current data
  private myReady: Promise<any>;

  constructor(
    public storage: Storage
  ) {
    this.myVersion = Object.keys(versions).reduce((largest, current) => {
      // Find latest (largest) version
      return (current > largest) ? current : largest;
    });
    this.mySchema = versions[this.myVersion];
    this.mySchema.forEach(d => {
      this.myData[d.key] = d.default;
    });
    this.myKeys = this.mySchema.map(d => d.key);
    this.myReady = this.initStorage();
  }

  public ready(): Promise<any> {
    return this.myReady;
  }

  private initStorage(): Promise<any> {
    return this.storage.ready().then(() => {
      return this.storage.get('_version')
      .catch(err => {
        console.log('[PreferencesService] No stored version found (err=%o), initializing.', err);
        // Swallow error and proceed to .then()
        return '';
      })
      .then(storedVer => {
        // Check if stored version is old and data in storage needs update
        if (!storedVer) {
          // No version was stored. Init the storage.
          console.log('[PreferencesService] Initialized version "%s".', this.myVersion);
          this.storage.set('_version', this.myVersion);
        } else if (storedVer !== this.myVersion) {
          console.log('[PreferencesService] Stored version "%s" found. Current version "%s", stored data needs update.',
            storedVer, this.myVersion);
          // TODO: (when needed) Implement update of stored data here

          this.storage.set('_version', this.myVersion);
        } else {
          // Load all values from storage to this._data
          console.log('[PreferencesService] Stored version "%s" found, loading stored preferences...', storedVer);
          const tasks = this.mySchema.map(d => {
            return this.storage.get(d.key).then(value => {
              this.myData[d.key] = value;
              console.log('[PreferencesService] restored "%s": "%s"', d.key, value);
              return value;
            });
          });
          return Promise.all(tasks).then(v => {

            console.log('[PreferencesService] Done loading all.');
            // return Promise.resolve();
          });
        }
      })
      ;
    });
  }

  public version() {
    return this.myVersion;
  }

  public set(key: string, value: any) {
    if (this.myKeys.includes(key)) {
      if (this.myData[key] !== value) {
        this.storage.set(key, value);
        this.myData[key] = value;
        console.log('[PreferencesService] set("%s", "%s") saved', key, value);
      } else {
        console.log('[PreferencesService] set("%s", "%s") same, ignored', key, value);
      }
    } else {
      console.error('[PreferencesService] set() with unknown key "%s", ignoring', key);
    }
  }

  public get(key: string): any {
    let value;
    if (this.myKeys.includes(key)) {
      value = this.myData[key];
      if (!value) {
        //
      }
    } else {
      console.error('[PreferencesService] get() with unknown key "%s", ignoring', key);
    }
    console.log('[PreferencesService] get("%s"): "%s"', key, value);
    return value;
  }
}
