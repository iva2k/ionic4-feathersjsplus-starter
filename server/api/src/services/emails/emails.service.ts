
// Initializes the `emails` service on path `/emails`. (Can be re-generated.)
import { App } from '../../app.interface';

import createService from './emails.class';
import hooks from './emails.hooks';
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
  app.use('/emails', createService(options));
  // !end

  // Get our initialized service so that we can register hooks
  const service = app.service('emails');

  service.hooks(hooks);
  // !code: func_return // !end
};

// !code: exports // !end
export default moduleExports;

// !code: funcs // !end
// !code: end // !end
