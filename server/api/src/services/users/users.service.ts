
// Initializes the `users` service on path `/users`. (Can be re-generated.)
import { App } from '../../app.interface';

import createService from 'feathers-nedb';
import createModel from '../../models/users.model';
import hooks from './users.hooks';
// !code: imports // !end
// !code: init // !end

let moduleExports = function (app: App) {
  let Model = createModel(app);
  let paginate = app.get('paginate');
  // !code: func_init // !end

  let options = {
    Model,
    paginate,
    // !code: options_more // !end
  };
  // !code: options_change // !end

  // Initialize our service with any options it requires
  // !<DEFAULT> code: extend
  app.use('/users', createService(options));
  // !end

  // Get our initialized service so that we can register hooks
  const service = app.service('users');

  service.hooks(hooks);
  // !code: func_return // !end
};

// !code: exports // !end
export default moduleExports;

// !code: funcs // !end
// !code: end // !end
