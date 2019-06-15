// @feathersjs/configuration pulls in default and <env> settings files using Node's `require()`.
// Node require() looks first for <filename>.js, and if not found, it will check for <filename>.json
// This configuration file has `.js` suffix, and must provide a `module.exports` containing the configuration properties.

module.exports = {
  from             : 'default.js',
  host             : 'localhost',
  port             : 3030,
  public           : '../public/',
  www              : [
    // Folder(s) to where copy server.json file (from which the client app can read it).
    // IONIC4 uses Angular 7, and since Angular 6 the /www directory is not used for 'ionic serve'
    // Copy server.json to src/assets, so it is available for the app running via 'ionic serve'
    '../../../client/ionic4-feathersjsplus-starter/www/assets', // ionic build
    '../../../client/ionic4-feathersjsplus-starter/src/assets', // ionic serve
    '../../../client/ionic4-feathersjsplus-starter/platforms/browser/www/assets', // ionic build --cordova --platform=browser
  ],
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
  nedb             : '../data',
  autocompaction   : 10 * (60 * 1000), // Perisitent DB autocompaction interval (in ms, min 5s for NeDB)
  gravatar_only    : true,
  gravatar_ext     : 'jpg',
  gravatar_size    : 60,
  gravatar_default : 'robohash',
  gravatar_rating  : 'g',

  authentication: {
    secret: 'a8e12ddd2cf8c81192a0e54d133bf35e66f466605969da04ab0b234f7bcf09dad76ae4d18850db7b0d220325c9556954879e68f4070dea15a15b87ed01a88adad282f4b8124c99675e40dbae95479ed6e7d755b4d3535aa6b69045b8d9ee8cb2f3dfa8aee377d39c8c3ee7f0c81832b3f825e6c64d8f07e7110d01a51d3a77a69c57a3b046f49b7c27609e002fb8f49c6185e79f8d18b3d5d41a319f1ef2743e9073b41ee3aabaa04875b5637a8528c0b779aa392f579c9a4f1eac0fd92258b1cf7bceba8d0a8a142cb34a4287fa9e7e6755322a7714a3da719310a174eac5db9be564e97ea014b7ae4b5518706c22fe85f346f15f319c77c1a13d38d59de32b',
    strategies: [
      'jwt',
      'local'
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
    postGeneration: data => data,
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
};
