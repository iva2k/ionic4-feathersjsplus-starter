/// <reference types="mocha"/>
import assert from 'assert';
import app from '../../src/app';

describe('\'todos\' service', () => {
  it('registered the service', () => {
    const service = app.service('todos');

    assert.ok(service, 'Registered the service');
  });

  it('creates and processes todo, adds user information', async () => {
    // Create a new user we can use for testing
    // TODO: const user = await app.service('users').create({
    //  email: 'messagetest@example.com',
    //  password: 'supersecret'
    // });
    const user = { _id: 'test' }; // A user stub with just an `_id`

    // The messages service call params (with the user we just created)
    const params = { user };
    const todo = await app.service('todos').create({
      title: 'a test',
      additional: 'should be removed'
    }, params);

    assert.strictEqual(todo.title, 'a test', 'does not contain expected title');
    // TODO: assert.strictEqual(todo.userId, user._id, 'does not contain expected userId');
    assert.ok(!todo.additional, 'additional property has not been removed');
    // TODO: assert.deepEqual(todo.user, user, 'user object has not been populated');
  });
});
