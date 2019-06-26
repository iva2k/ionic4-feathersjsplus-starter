
// Hooks for service `users`. (Can be re-generated.)
import * as commonHooks from 'feathers-hooks-common';
import { HooksObject } from '@feathersjs/feathers';
import { hooks as authHooks } from '@feathersjs/authentication';
const { authenticate } = authHooks;
// tslint:disable-next-line:no-unused-variable
import { hooks as localAuthHooks } from '@feathersjs/authentication-local';
const { hashPassword, protect } = localAuthHooks;
// tslint:disable-next-line:no-unused-variable
import gravatar from './hooks/gravatar';
// !code: imports
// How to add email verification
// Recipe from https://blog.feathersjs.com/how-to-setup-email-verification-in-feathersjs-72ce9882e744
import { hooks as verifyHooks } from 'feathers-authentication-management';

// TODO: const globalHooks = require ... (new file: hooks/send-verification-email.js)
/*
import accountService from '../services/authManagement/notifier'
exports.sendVerificationEmail = options => hook => {
  if (!hook.params.provider) { return hook; }
  const user = hook.result
  if (process.env.GMAIL && hook.data && hook.data.email && user) {
    accountService(hook.app).notifier('resendVerifySignup', user)
    return hook
  }
  return hook
}
*/

// !end

// !<DEFAULT> code: used
// tslint:disable-next-line:no-unused-variable
const { iff } = commonHooks;
import validate from './users.validate';
// tslint:disable-next-line:no-unused-variable
const { create, update, patch, validateCreate, validateUpdate, validatePatch } = validate;
// !end

// !code: init
// !end

let moduleExports: HooksObject = {
  before: {
    // Your hooks should include:
    //   find  : authenticate('jwt')
    //   get   : authenticate('jwt')
    //   create: hashPassword()
    //   update: hashPassword(), authenticate('jwt')
    //   patch : hashPassword(), authenticate('jwt')
    //   remove: authenticate('jwt')
    // !code: before
    all: [],
    find: [ authenticate('jwt') ],
    get: [ authenticate('jwt') ],
    create: [
      verifyHooks.addVerification(), // Initialize email verification
      // TODO: customizeOauthProfile(),
      hashPassword(),
      gravatar()
    ],
    update: [
      commonHooks.disallow('external') // disallow any external modifications
      // TODO: customizeOauthProfile(),
      // removed: hashPassword(), authenticate('jwt')
    ],
    patch: [
      commonHooks.iff(
        // feathers-authentication-management does its own hash, add only for external,
        // see https://github.com/feathers-plus/feathers-authentication-management/issues/96
        // https://hackernoon.com/setting-up-email-verification-in-feathersjs-ce764907e4f2
        commonHooks.isProvider('external'),
        commonHooks.preventChanges(
          true, // to throw if fields are modified (use false to delete changed fields)
          'email',
          'isVerified',
          'verifyToken',
          'verifyShortToken',
          'verifyExpires',
          'verifyChanges',
          'resetToken',
          'resetShortToken',
          'resetExpires'
        ),
        hashPassword(),
        authenticate('jwt')
      )
    ],
    remove: [ authenticate('jwt') ]
    // !end
  },

  after: {
    // Your hooks should include:
    //   all   : protect('password') /* Must always be the last hook */
    // !code: after
    all: [ protect('password') /* Must always be the last hook */ ],
    find: [],
    get: [],
    create: [
      // TODO: globalHooks.sendVerificationEmail(),

      verifyHooks.removeVerification(), // removes verification/reset fields other than .isVerified
    ],
    update: [],
    patch: [],
    remove: []
    // !end
  },

  error: {
    // !<DEFAULT> code: error
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
    // !end
  },
  // !code: moduleExports // !end
};

// !code: exports // !end
export default moduleExports;

// !code: funcs // !end
// !code: end // !end
