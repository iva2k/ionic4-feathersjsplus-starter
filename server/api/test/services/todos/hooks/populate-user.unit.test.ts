
/// <reference types="mocha"/>
import { HookContext } from '@feathersjs/feathers';

import assert from 'assert';
import populateUser from '../../../../src/services/todos/hooks/populate-user';

describe('Test todos/hooks/populate-user.unit.test.ts', () => {
  // tslint:disable-next-line:no-unused-variable
  let contextBefore: HookContext, contextAfterPaginated: HookContext,
    // tslint:disable-next-line:no-unused-variable
    contextAfter: HookContext, contextAfterMultiple: HookContext;

  beforeEach((done) => {
    contextBefore = {
      service: null!,
      type: 'before',
      params: { provider: 'socketio' },
      data: {

      }
    };

    contextAfter = {
      service: null!,
      type: 'after',
      params: { provider: 'socketio' },
      result: {

      }
    };

    contextAfterMultiple = {
      service: null!,
      type: 'after',
      params: { provider: 'socketio' },
      result: [

      ]
    };

    contextAfterPaginated = {
      service: null!,
      type: 'after',
      method: 'find',
      params: { provider: 'socketio' },
      result: {
        data: [

        ]
      }
    };
    contextAfterPaginated.result.total = contextAfterPaginated.result.data.length;
    done();
  });

  it('Hook exists', (done) => {
    assert(typeof populateUser === 'function', 'Hook is not a function.');
    done();
  });

  it('???', (done) => {
    contextBefore.method = 'create';
    assert(true);

    /*
    populateUser()(contextBefore);

    assert.deepEqual(contextBefore.data, {

    });
    */
    done();
  });
});
