
/// <reference types="mocha"/>
import feathers, { Params, Service, Application } from '@feathersjs/feathers';
import assert from 'assert';
import { join } from 'path';
import { readJsonFileSync } from '@feathers-plus/test-utils';
import memory from 'feathers-memory';
import appHooks from '../../../../src/app.hooks';
import hooks from '../../../../src/services/todos/todos.hooks';
// import processTodo from '../../../../src/services/todos/hooks/process-todo';

import fullApp from '../../../../src/app';

// Get generated fake data
// tslint:disable-next-line:no-unused-variable
const fakeData = readJsonFileSync(join(__dirname, '../../../../seeds/fake-data.json')) || {};

describe('Test todos/hooks/process-todo.integ.test.ts', () => {
  let app: Application, params: Params;
  // tslint:disable-next-line:no-unused-variable
  let service: Service<any>;
  let user: any;
  let instance = 1;

  beforeEach(async () => {
    // Database adapter options
    const options = {
      id: '_id', // Enforce _id usage for consistency, must be used for all services, so they are interchangeable.
      paginate: {
        default: 10,
        max: 25
      }
    };

    if (false) {
      app = feathers();

      // Register 'users' service in-memory
      app.use('/users', memory(options));

      // Register a dummy custom service that just return the message data back
      app.use('/todos', {
        async create(data: any) {
          return data;
        }
      });

      service = app.service('todos');

      //// Register the `processTodo` hook on that service - bad, can hide broken inter-dependencies.
      // app.service('todos').hooks({
      //  before: {
      //    create: processTodo()
      //  }
      // });

      // Load all appHooks, to increase test coverage (e.g. for log.js)
      app.hooks(appHooks);

      // Load actual hooks file to increase test coverage - good, verifies actual inter-dependencies.
      service.hooks(hooks);
    } else {
      // Use complete app
      app = fullApp;
      service = app.service('todos');
    }
    // Create a new user we can use to test with
    user = await app.service('users').create({
      email: 'test-process-todo' + instance + '@example.com'
    });
    instance += 1;

    params = {
      user, // Provide the user for service method calls
    };
  });


  // it('Hook exists', (done) => {
  //  assert(typeof processTodo === 'function', 'Hook is not a function.');
  //  done();
  // });
  //
  // it('???', async (done) => {
  //  params.provider = undefined;
  //  assert(true);
  //
  //  /*
  //  const result = await service.create({
  //
  //  }, params);
  //
  //  assert.deepEqual(user, {
  //
  //  }, result);
  //  */
  //  done();
  // });

  it('processes the todo as expected', () => {
    // Create a new todo
    return service.create({
      title: 'Test task',
      additional: 'should be removed',
      notes: 'should be passed'
    }, params)
      .then(todo => {
        assert.equal(todo.title, 'Test task');
        assert.equal(todo.userId, user._id); // `userId` was set
        assert.ok(!todo.additional); // `additional` property has been removed
        assert.equal(todo.notes, 'should be passed');
      });
  });

  it('rejects the todo without title as expected', () => {
    // Try to create a new todo without title
    return service.create({
      // no title
      notes: 'does not matter'
    }, params)
      .catch(err => {
        // Test for specific error
        assert.equal(err, 'Error: A todo must have a title' );
      });
  });

  it('processes the todo without notes as expected', () => {
    // Create a new todo without notes
    return service.create({
      title: 'Test task 2',
      additional: 'should be removed'
      // no notes
    }, params)
      .then(todo => {
        assert.equal(todo.title, 'Test task 2');
        assert.equal(todo.userId, user._id); // `userId` was set
        assert.ok(!todo.additional); // `additional` property has been removed
        assert.equal(todo.notes, ''); // empty `notes` property has been created
      });
  });

});
