// @feathersjs/configuration pulls in default and <env> settings files using Node's `require()`.
// Node require() looks first for <filename>.js, and if not found, it will check for <filename>.json
// This configuration file has `.js` suffix, and must provide a `module.exports` containing the configuration properties.

const _configs = {
  production : { prefix: 'PROD_', },
  development: { prefix: 'DEV_' , },
  test       : { prefix: 'TEST_', },
  // Any new configs should be defined here, `key` is what NODE_ENV can be set to, `prefix` - for defines in `private.env` file.
};
const _config = _configs[process.env.NODE_ENV] || _configs['production']; // Always default to production.
const _envs = Object.keys(_configs);
if (!_configs[process.env.NODE_ENV]) {
  console.error('Unknown NODE_ENV: ' + process.env.NODE_ENV + ', should be one of [' + _envs.join(',') + ']');
} else {
  console.log('NODE_ENV: ' + process.env.NODE_ENV + ' (possible configs: ' + _envs.join(', ') + ')');
}
// console.log('config: '+ JSON.stringify(_config));
function getEnv(name, default_val) {
  const key = _config.prefix + name;
  return process.env[key] || process.env[name] || default_val;
}

module.exports = {
  from               : 'default.js',
  protocol           :             getEnv('APP_PROTOCOL'       , 'https'          ),
  host               :             getEnv('APP_HOST'           , 'localhost'      ),
  port               :             getEnv('APP_PORT'           , 3030             ),
  clientapp_protocol :             getEnv('CLIENTAPP_PROTOCOL' , 'http'           ),
  clientapp_host     :             getEnv('CLIENTAPP_HOST'     , 'localhost'      ),
  clientapp_port     :             getEnv('CLIENTAPP_PORT'     , 8100             ),

  public             :             getEnv('PUBLIC_DIR'         , '../public/'     ),
  www                : [
    // Folder(s) to where copy server.json file (from which the client app can read it).
    // IONIC4 uses Angular 7, and since Angular 6 the /www directory is not used for 'ionic serve'
    // Copy server.json to src/assets, so it is available for the app running via 'ionic serve'
    '../../../client/ionic4-feathersjsplus-starter/www/assets', // ionic build
    '../../../client/ionic4-feathersjsplus-starter/src/assets', // ionic serve
    '../../../client/ionic4-feathersjsplus-starter/platforms/android/assets/www',
    '../../../client/ionic4-feathersjsplus-starter/platforms/browser/www/assets', // ionic build --cordova --platform=browser
  ],
  logo               :             getEnv('LOGO'               , 'logo-white.png' ), // Must be a file in `public` folder

  paginate: {
    default: 10,
    max: 50
  },
  tests: {
    environmentsAllowingSeedData: [
      'development',
      'test'
    ]
  },
  nedb               : '../data',
  autocompaction     : 10 * (60 * 1000), // Perisitent DB autocompaction interval (in ms, min 5s for NeDB)

  email_service      :             getEnv('EMAIL_SERVICE'      , ''               ),
  email_login        :             getEnv('EMAIL_LOGIN'        , ''               ),
  email_pass         :             getEnv('EMAIL_PASSWORD'     , ''               ),
  email_reports      :             getEnv('EMAIL_REPORTS'      , ''               ),
  email_support      :             getEnv('EMAIL_SUPPORT'      , ''               ),
  email_from_auth    :             getEnv('EMAIL_FROM_AUTH'    , ''               ),
  gravatar_only      :  !!parseInt(getEnv('GRAVATAR_ONLY'      , 1                )),
  gravatar_ext       :             getEnv('GRAVATAR_EXT'       , 'jpg'            ),
  gravatar_size      :    parseInt(getEnv('GRAVATAR_SIZE'      , 60               )),
  gravatar_default   :             getEnv('GRAVATAR_DEFAULT'   , 'robohash'       ),
  gravatar_rating    :             getEnv('GRAVATAR_RATING'    , 'g'              ),

  authentication: {
    secret: getEnv('AUTH_SECRET', ''),
    strategies: [
      'jwt',
      'local',
      'social_token'
    ],
    path: '/authentication',
    service: 'users',
    jwt: {
      header: {
        typ: 'access'
      },
      audience: 'https://yourdomain.com',
      subject: 'anonymous',
      issuer: 'feathers',
      algorithm: 'HS256',
      expiresIn: '1d'
    },
    local: {
      entity: 'user',
      usernameField: 'email',
      passwordField: 'password'
    },
    google: {
      clientID: 'your google client id',
      clientSecret: 'your google client secret',
      successRedirect: '/',
      scope: [
        'profile openid email'
      ]
    },
    facebook: {
      clientID: 'your facebook client id',
      clientSecret: 'your facebook client secret',
      successRedirect: '/',
      scope: [
        'public_profile',
        'email'
      ],
      'profileFields': [
        'id',
        'displayName',
        'first_name',
        'last_name',
        'email',
        'gender',
        'profileUrl',
        'birthday',
        'picture',
        'permissions'
      ]
    },
    cookie: {
      enabled: true,
      name: 'feathers-jwt',
      httpOnly: false,
      secure: false
    }
  },

  // Configuration for faking service data
  fakeData: {
    // Number of records to generate if JSON-schema does not have a fakeRecords property.
    defaultFakeRecords: 5,
    // Don't generate fake data with "feathers-plus generate all" when true.
    noFakesOnAll: false,
    // Additional context passed to expressions
    expContext: {
      // Invoked with: faker: { exp: 'foo(...)'}
      // foo: (bar, baz) => { return ... }
    },
    // Mutate fake data after its generated.
    // postGeneration: data => data,
    // https://github.com/json-schema-faker/json-schema-faker#custom-options
    jsf: {
      // Configure a maximum amount of items to generate in an array.
      // This will override the maximum items found inside a JSON Schema.
      maxItems: 15,
      // Configure a maximum length to allow generating strings for.
      // This will override the maximum length found inside a JSON Schema.
      maxLength: 40,
      // A replacement for Math.random to support pseudorandom number generation.
      // random: () => (),
      // A number from 0 to 1 indicating the probability to fake a non-required object property.
      // When 0.0, only required properties are generated; when 1.0, all properties are generated.
      optionalsProbability: 1.0,
      // Support  JSONPath expressions such as jsonPath: '$..book[?(@.price<30 && @.category=="fiction")]'
      // https://github.com/dchester/jsonpath
      resolveJsonPath: true,
      // Custom seeders.
      extend: {
        // Invoked with: format: 'foo'
        // foo: () => jsf.random.randexp('\\d\\.\\d\\.[1-9]\\d?');,
      },

    },
    // https://github.com/Marak/Faker.js#localization
    faker: {
      // If you want consistent results, you can set your own seed.
      seed: undefined,
      // Language to generate for.
      locale: 'en',
      // Fallback language for missing definitions.
      localeFallback: 'en',
      // Custom seeders.
      // faz: {
           // Invoked with: faker: 'faz.foo', faker: { 'faz.foo': 'bar' } or faker: { 'faz.foo': ['bar', 'baz'] }
           // foo: (p1 = 'hello', p2 = 'world') => `${p1} ${p2}`,
      // },
    },
    // http://chancejs.com/usage/seed.html
    chance: {
      // If you want consistent results, you can set your own seed.
      seed: undefined,
      // Custom seeders.
      // Invoked with: chance: 'foo', chance: { foo: 'bar' } or chance: { foo: ['bar', 'baz'] }
      // foo: (p1 = 'hello', p2 = 'world') => `${p1} ${p2}`,
    },
  },

  social_token: {
    dummy: 'some data',
  },

};
