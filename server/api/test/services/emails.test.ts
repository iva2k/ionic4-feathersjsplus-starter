/// <reference types="mocha"/>
import assert from 'assert';
import app from '../../src/app';

describe('\'emails\' service', () => {
  it('registered the service', () => {
    const service = app.service('emails');

    assert.ok(service, 'Registered the service');
  });
});
