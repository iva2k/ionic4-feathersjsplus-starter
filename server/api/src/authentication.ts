
// Configure authentication. (Can be re-generated.)
import authentication from '@feathersjs/authentication';
import jwt from '@feathersjs/authentication-jwt';
import local from '@feathersjs/authentication-local';
import oauth2 from '@feathersjs/authentication-oauth2';
import GoogleStrategy from 'passport-google-oauth20';
import FacebookStrategy from 'passport-facebook';

import { App } from './app.interface';
// !code: imports
import { Service } from '@feathersjs/feathers';
import custom from 'feathers-authentication-custom'; // wrapper for 'passport-custom'
import verifySocialToken from './utility/verifySocialToken';
// !end
// !code: init
class CustomVerifier {
  private service: string;
  private app: App;
  private options: any;
  constructor(app: App, options: any) {
    this.app = app;
    this.options = options;
    this.service = app.get('authentication').service;
  }
  public async verify(req: any, callback: any) { // performs custom verification

    // Custom user finding logic here, or set to false based on req object
    try {
      // this is what client sent to server
      const service = this.app.service(this.service) as Service<any>;
      const { network, email, socialId, socialToken } = req.body;

      // verify social id and token
      await verifySocialToken(network, socialId, socialToken);

      // find user
      let users = await service.find({
        query: {
          email
        }
      });
      let user = null;
      if (!users.total) {
        // user does not exist yet, create new user
        user = await service.create({
          email,
          createdFrom: network // Save what network user registered with.
        });
      } else {
        user = users.data[0];
      }

      callback(null, user); // success
    } catch (err) {
      callback(err, false);
    }

  }
}
// !end

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

  // !code: loc_2
  // custom passport strategy for client side social login
  app.configure(custom(Object.assign({
    name: 'social_token',
    // ?Strategy: SocialTokenStrategy,
    Verifier: CustomVerifier
  }, config.social_token)));
  // !end

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  let service: Service<any> = app.service('authentication');
  service.hooks({
    before: {
      create: [
        // !code: before_create
        authentication.hooks.authenticate(config.strategies),
        // This hook adds userId attribute to the JWT payload // TODO: (soon) Move to a proper hook file.
        (hook) => {
          if (!(hook.params.authenticated)) {
            return;
          }

          const user = hook.params.user;
          // make sure params.payload exists
          hook.params.payload = hook.params.payload || {};
          // merge in a `userId` property
          Object.assign(hook.params.payload, { userId: user._id });
        }
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
