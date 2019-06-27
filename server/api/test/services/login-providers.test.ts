/// <reference types="mocha"/>
import assert from 'assert';
import app from '../../src/app';

describe('\'loginProviders\' service', () => {
  it('registered the service', () => {
    const service = app.service('login-providers');

    assert.ok(service, 'Registered the service');
  });
});
