
/// <reference types="mocha"/>
import feathers, { Params, Service, Application } from '@feathersjs/feathers';
import assert from 'assert';
import { join } from 'path';
import { readJsonFileSync } from '@feathers-plus/test-utils';
import hooks from '../../../../src/services/users/users.hooks';
// import gravatar from '../../../../src/services/users/hooks/gravatar';

// Get generated fake data
// tslint:disable-next-line:no-unused-variable
const fakeData = readJsonFileSync(join(__dirname, '../../../../seeds/fake-data.json')) || {};

describe('Test users/hooks/gravatar.integ.test.ts', () => {
  let app: Application, params: Params;
  // tslint:disable-next-line:no-unused-variable
  let service: Service<any>;

  beforeEach((done) => {
    app = feathers();

    // A dummy users service for testing
    app.use('/users', {
      async create(data: any) {
        return data;
      }
    });

    service = app.service('users');

    service.hooks(hooks);

    params = {
      user: (fakeData.users || [])[0] || {
        email: 'test@example.com'
      }

    };
    done();
  });


  it('creates a gravatar link from the users email',  () => {
    params.provider = undefined;
    return service.create({
      email: 'test@example.com'
    })
      .then(user => {

        assert.deepEqual(user, {
          email: 'test@example.com',
          avatar: 'https://s.gravatar.com/avatar/55502f40dc8b7c769880b10874abc9d0.jpg?s=80&d=robohash&r=g'
        });
      });
  });
});
