
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

import { Hook } from '@feathersjs/feathers';
import { checkContext, getItems, replaceItems } from 'feathers-hooks-common';
import { Todo } from '../todos.interface';

// function processRecord(record: any, userId: string) {
//   // Our data model:
//   return record;
// }

// tslint:disable-next-line:no-unused-variable
export default function (options: any = {}): Hook {

  // Return the actual hook.
  return async (context) => {
    // Throw if the hook is being called from an unexpected location.
    // ?checkContext(context, null, ['find', 'get', 'create', 'update', 'patch', 'remove']);

    const { app, method, result, params } = context;
    const service = app.service('users');

    if (method !== 'remove') {
      // Make sure that we always have an Array of todos by either:
      // - getting the `result.data` from the `find` method
      // - getting the `context.data` from `create`/`update`/`patch` methods
      // - wrapping `result` with a single todo into an array
      const todos = (method === 'find') ? result.data :
        (context.data ? (Array.isArray(context.data) ? context.data : [context.data]) :
          (Array.isArray(result) ? result : [result])
        );
      // Asynchronously get user object from each todo's `userId`
      // and add it to the todo
      await Promise.all(todos.map(async (todo: Todo) => {
        // Also pass the original `params` to the service call
        // so that it has the same information available (e.g. who is requesting it)
        todo.user = await service.get(todo.userId, params);
      }));
    }

/*
    // Get the authenticated user.
    // tslint:disable-next-line:no-unused-variable
    const { user } = context.params!;
    // Get the record(s) from context.data (before), context.result.data or context.result (after).
    // getItems always returns an array to simplify your processing.
    let records = getItems(context);

    // Inspect and Modify records.
    if (Array.isArray(records)) {
      records.forEach((record, index) => {
        records[index] = processRecord(record, userId);
      });
    } else {
      // throw new Error('getItems() returned non-Array'); // Somehow it is not an Array for single record.
      records = processRecord(records, userId);
    }

    // Place the modified records back in the context.
    replaceItems(context, records);
*/
    // Best practice: hooks should always return the context.
    return context;
  };
}

// Throw on unrecoverable error.
// tslint:disable-next-line:no-unused-variable
function error(msg: string) {
  throw new Error(msg);
}
