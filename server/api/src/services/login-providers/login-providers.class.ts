
// Class for the custom service `loginProviders` on path `/login-providers`. (Can be re-generated.)
/* tslint:disable no-unused-variable */

import { App } from '../../app.interface';
import { Id, NullableId, Paginated, Params, ServiceMethods, SetupMethod } from '@feathersjs/feathers';
// !code: imports // !end
// !code: init // !end

// !<DEFAULT> code: interface
// tslint:disable-next-line:no-empty-interface
interface ServiceOptions {}
// !end

export class Service implements Partial<ServiceMethods<any>>, SetupMethod {
  // !code: properties
  public app!: App;
  private socialLogins = [
    // tslint:disable-next-line: max-line-length
    {title: 'Google Hello', network: 'google', name: 'google'     , icon: 'logo-google'  , url: ''              , clientId: '926208454330-vjmhag3a6b72rct9phmr26lj8r3oamtq.apps.googleusercontent.com', clientSecret: 'SECRET!', }, // Use local Hello.js method (client_id)
    {title: 'Google API',   network: 'google', name: 'googleAPI'  , icon: 'logo-google'  , url: ''              , clientId: '926208454330-vjmhag3a6b72rct9phmr26lj8r3oamtq.apps.googleusercontent.com', clientSecret: 'SECRET!', loginFn: 'loginGoogleAPI' /* client's feathers.service.ts:this.loginGoogleAPI */, }, // Use native
  ];
  // !end

  constructor (private options: ServiceOptions = {}) {
    // !code: constructor1 // !end
  }

  // !<DEFAULT> code: setup
  public setup (app: App, path: string): void {
    this.app = app;
  }
  // !end

  // !code: find
  public async find(params?: Params): Promise<any[] | Paginated<any>> {
    return this.socialLogins;
  }
  // !end

  // !<DEFAULT> code: get
  public async get (id: Id, params?: Params): Promise<any> {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }
  // !end

  // !<DEFAULT> code: create
  public async create (data: Partial<any> | Array<Partial<any>>, params?: Params): Promise<any> {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return data;
  }
  // !end

  // !<DEFAULT> code: update
  public async update (id: NullableId, data: any, params?: Params): Promise<any> {
    return data;
  }
  // !end

  // !<DEFAULT> code: patch
  public async patch (id: NullableId, data: Partial<any>, params?: Params): Promise<any> {
    return data;
  }
  // !end

  // !<DEFAULT> code: remove
  public async remove (id: NullableId, params?: Params): Promise<any> {
    return { id };
  }
  // !end
  // !code: more // !end
}

export default function (options: ServiceOptions) {
  return new Service(options);
}

// !code: funcs // !end
// !code: end // !end
