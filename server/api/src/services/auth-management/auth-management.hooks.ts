
// Hooks for service `authManagement`. (Can be re-generated.)
import * as commonHooks from 'feathers-hooks-common';
import { HooksObject } from '@feathersjs/feathers';
import { hooks as authHooks } from '@feathersjs/authentication';
const { authenticate } = authHooks;
// !code: imports
// TODO: (when needed) const isEnabled = require('../../hooks/is-enabled');
// !end

// !<DEFAULT> code: used
// tslint:disable-next-line:no-unused-variable
const { iff } = commonHooks;
import validate from './auth-management.validate';
// tslint:disable-next-line:no-unused-variable
const { create, update, patch, validateCreate, validateUpdate, validatePatch } = validate;
// !end

// !code: init
const isAction = (...actions: string[]) => {
  let args = Array.from(actions);
  return (hook: any) => args.includes(hook.data.action);
};
// !end

let moduleExports: HooksObject = {
  before: {
    // Your hooks should include:
    //   all   : authenticate('jwt')
    // !code: before
    all: [],
    find: [],
    get: [],
    create: [
      iff(
        isAction('passwordChange', 'identityChange'),
        // TODO: (when needed) per https://blog.feathersjs.com/how-to-setup-email-verification-in-feathersjs-72ce9882e744
        // ? authHooks.verifyToken(),
        // ? authHooks.populateUser(),
        // ? authHooks.restrictToAuthenticated(),

        authenticate('jwt'),
        // TODO: (when needed) implement: isEnabled()
      ),
    ],
    update: [],
    patch: [],
    remove: []
    // !end
  },

  after: {
    // !<DEFAULT> code: after
    all: [],
    find: [],
    get: [],
    create: [],
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
