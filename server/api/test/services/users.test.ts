/// <reference types="mocha"/>
import assert from 'assert';
import app from '../../src/app';

describe('\'users\' service', () => {
  it('registered the service', (done) => {
    const service = app.service('users');

    assert.ok(service, 'Registered the service');
    done();
  });

  it('creates a user, encrypts password and adds gravatar', () => {
    return app.service('users').create({
      email: 'test@example.com',
      password: 'secret'
    })
      .then(user => {
        // Verify Gravatar has been set as we'd expect
        assert.equal(user.avatar, 'https://s.gravatar.com/avatar/55502f40dc8b7c769880b10874abc9d0.jpg?s=60&d=robohash&r=g');
        // Makes sure the password got encrypted
        assert.ok(user.password !== 'secret');
      });
  });

  it('removes password for external requests', () => {
    // Setting `provider` indicates an external request
    const params = { provider: 'rest' };

    return app.service('users').create({
      email: 'test2@example.com',
      password: 'secret'
    }, params)
      .then(user => {
        // Make sure password has been removed
        assert.ok(!user.password);
      });
  });
});
