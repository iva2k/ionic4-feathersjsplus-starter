/// <reference types="mocha"/>
import assert from 'assert';
import app from '../../src/app';

describe('\'todos\' service', () => {
  it('registered the service', (done) => {
    const service = app.service('todos');

    assert.ok(service, 'Registered the service');
    done();
  });

  it('creates and processes todo, adds user information', () => {
    // Create a new user we can use for testing
    // ?Promise.resolve({ _id: 'test' }) // A user stub with just an `_id`
    return app.service('users').create({
      email: 'test-todos@example.com',
      password: 'supersecret'
    })
      .then(user => {

        // The todos service call params (with the user we just created)
        const params = { user };

        return app.service('todos').create({
          title: 'a test',
          additional: 'should be removed'
        }, params)
          .then(todo => {
            assert.strictEqual(todo.title, 'a test', 'does not contain expected title');
            assert.strictEqual(todo.userId, user._id, 'does not contain expected userId');
            assert.ok(!todo.additional, 'additional property has not been removed');
            assert.notDeepStrictEqual(todo.user[0], user, 'user object has not been populated');
          });
      });
  });
});
