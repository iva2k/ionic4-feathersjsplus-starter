/// <reference types="mocha"/>
import assert from 'assert';
import app from '../../src/app';

describe('\'todos\' service', () => {
  it('registered the service', () => {
    const service = app.service('todos');

    assert.ok(service, 'Registered the service');
  });
});
