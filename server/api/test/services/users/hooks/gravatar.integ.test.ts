
/// <reference types="mocha"/>
import feathers, { Params, Service, Application } from '@feathersjs/feathers';
import assert from 'assert';
import { join } from 'path';
import { readJsonFileSync } from '@feathers-plus/test-utils';
import hooks from '../../../../src/services/users/users.hooks';
// import gravatar from '../../../../src/services/users/hooks/gravatar';

import fullApp from '../../../../src/app';

// Get generated fake data
// tslint:disable-next-line:no-unused-variable
const fakeData = readJsonFileSync(join(__dirname, '../../../../seeds/fake-data.json')) || {};

describe('Test users/hooks/gravatar.integ.test.ts', () => {
  let app: Application, params: Params;
  // tslint:disable-next-line:no-unused-variable
  let service: Service<any>;

  beforeEach((done) => {
    if (false) {
      // Use a mock-up app
      app = feathers();

      // A dummy users service for testing
      app.use('/users', {
        async create(data: any) {
          return data;
        }
      });

      service = app.service('users');
      service.hooks(hooks);
      // TODO: (when needed) configure authManagement service (users.hooks depends on it)
    } else {
      // Use complete app
      app = fullApp;
      service = app.service('users');
    }

    params = {
      user: (fakeData.users || [])[0] || {
        email: 'test_gravatar@example.com'
      }

    };
    done();
  });


  it('creates a gravatar link from the users email',  () => {
    params.provider = undefined;
    return service.create({
      email: 'test_gravatar@example.com'
    })
      .then(user => {

        assert.strictEqual(user.email, 'test_gravatar@example.com');
        assert.strictEqual(user.avatar, 'https://s.gravatar.com/avatar/27fd0591698758a7fb0b86bdf1a5e17e.jpg?s=60&d=robohash&r=g');
      });
  });
});
