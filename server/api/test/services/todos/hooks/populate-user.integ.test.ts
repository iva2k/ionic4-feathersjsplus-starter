
/// <reference types="mocha"/>
import feathers, { Params, Service, Application } from '@feathersjs/feathers';
import assert from 'assert';
// import { join } from 'path';
// import { readJsonFileSync } from '@feathers-plus/test-utils';
import memory from 'feathers-memory';
import hooks from '../../../../src/services/todos/todos.hooks';
// import populateUser from '../../../../src/services/todos/hooks/populate-user';
// ?import todosPopulate from '../../../../src/services/todos/todos.populate';

import fullApp from '../../../../src/app';

// Get generated fake data
// tslint:disable-next-line:no-unused-variable
// const fakeData = readJsonFileSync(join(__dirname, '../../../../seeds/fake-data.json')) || {};

describe('Test todos/hooks/populate-user.integ.test.ts', () => {
  let app: Application, params: Params;
  // tslint:disable-next-line:no-unused-variable
  let service: Service<any>;
  let user: any;

//  const user = { _id: 'test' }; // A user stub with just an `_id`

  beforeEach(async () => {
    // Database adapter pagination options
    const options = {
      id: '_id', // Enforce _id usage for consistency, must be used for all services, so they are interchangeable.
      paginate: {
        default: 10,
        max: 25
      }
    };

    if (false) {
      app = feathers();

      // Register `users` and `todos` service in-memory
      app.use('/users', memory(options));
      app.use('/todos', memory(options));

      service = app.service('todos');

      // Add the hook to the service
      // service.hooks({
      //   after: populateUser()
      // });
      service.hooks(hooks);
    } else {
      // Use complete app
      app = fullApp;
      service = app.service('todos');
    }
    // Create a new user we can use to test with
    user = await app.service('users').create({
      email: 'test-populate-user@example.com'
    });

    // params = {
    //   user: (fakeData['users'] || [])[0] || {
    //     email: 'test-populate-user@example.com'
    //   }
    // };
  });

  it('populates a new todo with the user', async function() {
    const todo = await app.service('todos').create({
      title: 'A test todo',
      // Set `userId` manually (usually done by `process-todo` hook)
      userId: user._id
    });

    // Make sure that user got added to the returned todo
    assert.notDeepStrictEqual(todo.user[0], user);
  });

});
