
// Hooks for service `todos`. (Can be re-generated.)
import * as commonHooks from 'feathers-hooks-common';
import { HooksObject } from '@feathersjs/feathers';
// tslint:disable-next-line:no-unused-variable
import processTodo from './hooks/process-todo';
// tslint:disable-next-line:no-unused-variable
import todosPopulate from './todos.populate';
// !code: imports
import { hooks } from '@feathersjs/authentication';
// !end

// !<DEFAULT> code: used
// tslint:disable-next-line:no-unused-variable
const { iff } = commonHooks;
import validate from './todos.validate';
// tslint:disable-next-line:no-unused-variable
const { create, update, patch, validateCreate, validateUpdate, validatePatch } = validate;
// !end

// !code: init // !end

let moduleExports: HooksObject = {
  before: {
    // !code: before
    all: [ hooks.authenticate('jwt') ],
    find: [],
    get: [],
    create: [ processTodo() ],
    update: [],
    patch: [],
    remove: []
    // !end
  },

  after: {
    // !code: after
    all: [ todosPopulate ],
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
