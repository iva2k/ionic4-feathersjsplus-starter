
// Initializes the `todos` service on path `/todos`. (Can be re-generated.)
import { App } from '../../app.interface';

import createService from 'feathers-nedb';
import createModel from '../../models/todos.model';
import hooks from './todos.hooks';
// !code: imports
import logger from '../../logger';
// !end
// !code: init // !end

let moduleExports = function (app: App) {
  let Model = createModel(app);
  let paginate = app.get('paginate');
  // !code: func_init
  const autocompaction = app.get('autocompaction');
  // !end

  let options = {
    Model,
    paginate,
    // !code: options_more // !end
  };
  // !code: options_change // !end

  // Initialize our service with any options it requires
  // !<DEFAULT> code: extend
  app.use('/todos', createService(options));
  // !end

  // Get our initialized service so that we can register hooks
  const service = app.service('todos');

  // NeDB-specific:
  let model = (service as any).getModel();
  if (model.persistence) {
    const startTime = process.hrtime();
    if (model.on) {
      model.on('compaction.done', function () {
        const hrtime = process.hrtime(startTime);
        const elapsedSeconds = (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
        logger.info('Compaction of todos done, elapsed time: ' + elapsedSeconds + 's');
      });
    } else {
      logger.info('Model of todos has no event emitter on(), compaction won\'t be reported.');
    }

    if (autocompaction && model.persistence.setAutocompactionInterval) {
      model.persistence.setAutocompactionInterval(autocompaction);
    } else if (model.persistence.compactDatafile) {
      model.persistence.compactDatafile();
    }
  }

  service.hooks(hooks);
  // !code: func_return // !end
};

// !code: exports // !end
export default moduleExports;

// !code: funcs // !end
// !code: end // !end
