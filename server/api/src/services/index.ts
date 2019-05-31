
// Configure the Feathers services. (Can be re-generated.)
import { App } from '../app.interface';
import todos from './todos/todos.service';

// !code: imports // !end
// !code: init // !end

// tslint:disable-next-line:no-unused-variable
let moduleExports = function (app: App) {
  app.configure(todos);
  // !code: func_return // !end
};

// !code: exports // !end
export default moduleExports;

// !code: funcs // !end
// !code: end // !end
