
/// <reference types="mocha"/>
import { HookContext } from '@feathersjs/feathers';

import assert from 'assert';
import gravatar from '../../../../src/services/users/hooks/gravatar';

describe('Test users/hooks/gravatar.unit.test.ts', () => {
  // tslint:disable-next-line:no-unused-variable
  let contextBefore: HookContext, contextAfterPaginated: HookContext,
    // tslint:disable-next-line:no-unused-variable
    contextAfter: HookContext, contextAfterMultiple: HookContext;

  beforeEach(() => {
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
  });

  it('Hook exists', () => {
    assert(typeof gravatar === 'function', 'Hook is not a function.');
  });

  it('???', () => {
    contextBefore.method = 'create';
    assert(true);

    /*
    gravatar()(contextBefore);

    assert.deepEqual(contextBefore.data, {

    });
    */
  });
});
