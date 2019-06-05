
/// <reference types="mocha"/>
import feathers, { Params, Service, Application } from '@feathersjs/feathers';
import assert from 'assert';
import feathers from '@feathersjs/feathers';
import { join } from 'path';
import { readJsonFileSync } from '@feathers-plus/test-utils';
import processTodo from '../../../../src/services/todos/hooks/process-todo';

// Get generated fake data
// tslint:disable-next-line:no-unused-variable
const fakeData = readJsonFileSync(join(__dirname, '../../../../seeds/fake-data.json')) || {};

describe('Test todos/hooks/process-todo.integ.test.ts', () => {
  let app: Application, params: Params;
  // tslint:disable-next-line:no-unused-variable
  let service: Service<any>;

  beforeEach(() => {
    app = feathers();

    app.use('/test-service', {
      async create(data: any) {
        return data;
      }
    });

    app.service('/test-service').hooks({
      before: {
        create: processTodo()
      }
    });

    service = app.service('/test-service');
    params = {

    };
  });


  it('Hook exists', () => {
    assert(typeof processTodo === 'function', 'Hook is not a function.');
  });

  it('???', async () => {
    params.provider = undefined;
    assert(true);

    /*
    const result = await service.create({

    }, params);

    assert.deepEqual(user, {

    }, result);
    */
  });
});
