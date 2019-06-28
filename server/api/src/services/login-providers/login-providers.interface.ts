
// Define TypeScript interface for service `loginProviders`. (Can be re-generated.)
// !code: imports // !end
// !code: init // !end

// tslint:disable-next-line:no-empty-interface
export interface LoginProviderBase {
  // !code: interface
  title: string;
  network: string;
  name: string;
  icon: string;
  url: string;
  clientId: string;
  clientSecret: string;
  loginFn: string;
  // !end
}

// tslint:disable-next-line:no-empty-interface
export interface LoginProvider extends LoginProviderBase {
  // !code: more // !end
}

// !code: funcs // !end
// !code: end // !end
