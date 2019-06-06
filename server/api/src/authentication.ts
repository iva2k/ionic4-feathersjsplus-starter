
// Configure authentication. (Can be re-generated.)
import { Service } from '@feathersjs/feathers';
import authentication from '@feathersjs/authentication';
import jwt from '@feathersjs/authentication-jwt';
import local from '@feathersjs/authentication-local';
import oauth2 from '@feathersjs/authentication-oauth2';
import GoogleStrategy from 'passport-google-oauth20';
import FacebookStrategy from 'passport-facebook';

import { App } from './app.interface';
// !code: imports // !end
// !code: init // !end

let moduleExports = function (app: App) {
  const config = app.get('authentication');
  // !code: func_init // !end

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt());
  app.configure(local());
  // !code: loc_1 // !end

  app.configure(oauth2(Object.assign({
    name: 'google',
    Strategy: GoogleStrategy,
    // !code: google_options // !end
  }, config.google)));

  app.configure(oauth2(Object.assign({
    name: 'facebook',
    Strategy: FacebookStrategy,
    // !code: facebook_options // !end
  }, config.facebook)));

  // !code: loc_2 // !end

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  let service: Service<any> = app.service('authentication');
  service.hooks({
    before: {
      create: [
        // !<DEFAULT> code: before_create
        authentication.hooks.authenticate(config.strategies),
        // !end
      ],
      remove: [
        // !<DEFAULT> code: before_remove
        authentication.hooks.authenticate('jwt'),
        // !end
      ],
      // !code: before // !end
    },
    // !code: after // !end
  });
  // !code: func_return // !end
};

// !code: exports // !end
export default moduleExports;

// !code: funcs // !end
// !code: end // !end
