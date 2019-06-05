
/// <reference types="mocha"/>
import feathers, { Params, Service, Application } from '@feathersjs/feathers';
import assert from 'assert';
import { join } from 'path';
import { readJsonFileSync } from '@feathers-plus/test-utils';
import hooks from '../../../../src/services/todos/todos.hooks';
// import processTodo from '../../../../src/services/todos/hooks/process-todo';

// Get generated fake data
// tslint:disable-next-line:no-unused-variable
const fakeData = readJsonFileSync(join(__dirname, '../../../../seeds/fake-data.json')) || {};

describe('Test todos/hooks/process-todo.integ.test.ts', () => {
  let app: Application, params: Params;
  // tslint:disable-next-line:no-unused-variable
  let service: Service<any>;

  const user = { _id: 'test' }; // A user stub with just an `_id`

  beforeEach((done) => {
    app = feathers();

    // Register a dummy custom service that just return the message data back
    app.use('/todos', {
      async create(data: any) {
        return data;
      }
    });

    app.service('/todos').hooks(hooks);
    // app.service('/todos').hooks({
    //  before: {
    //    create: processTodo()
    //  }
    // });

    service = app.service('todos');
    params = {
      user, // Provide the user for service method calls
    };
    done();
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
    // Create a new message
    return service.create({
      title: 'Test task',
      additional: 'should be removed',
      notes: 'should be passed'
    }, params)
      .then(todo => {
        assert.equal(todo.title, 'Test task');
        // TODO:    assert.equal(todo.userId, 'test'); // `userId` was set
        assert.ok(!todo.additional); // `additional` property has been removed
        assert.equal(todo.notes, 'should be passed');
      });
  });

  it('rejects the todo without title as expected', () => {
    // Try to create a new message without title
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
    // Create a new message without notes
    return service.create({
      title: 'Test task 2',
      additional: 'should be removed'
      // no notes
    }, params)
      .then(todo => {
        assert.equal(todo.title, 'Test task 2');
        // TODO:    assert.equal(todo.userId, 'test'); // `userId` was set
        assert.ok(!todo.additional); // `additional` property has been removed
        assert.equal(todo.notes, ''); // empty `notes` property has been created
      });
  });

});
