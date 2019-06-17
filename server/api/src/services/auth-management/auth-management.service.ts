
// Initializes the `authManagement` service on path `/auth-management`. (Can be re-generated.)
import { App } from '../../app.interface';

import createService from './auth-management.class';
import hooks from './auth-management.hooks';
// !code: imports // !end
// !code: init // !end

let moduleExports = function (app: App) {

  let paginate = app.get('paginate');
  // !code: func_init // !end

  let options = {
    paginate,
    // !code: options_more // !end
  };
  // !code: options_change // !end

  // Initialize our service with any options it requires
  // !<DEFAULT> code: extend
  app.use('/auth-management', createService(options));
  // !end

  // Get our initialized service so that we can register hooks
  const service = app.service('auth-management');

  service.hooks(hooks);
  // !code: func_return // !end
};

// !code: exports // !end
export default moduleExports;

// !code: funcs // !end
// !code: end // !end
