
module.exports = {
  from: 'production.js',
  testEnvironment: 'NODE_ENV',

  host:          process.env.PROD_APP_HOST  || 'api-app.feathersjs.com',
  port: parseInt(process.env.PROD_APP_PORT) || 8080,
  public:        process.env.PROD_PUBLIC    || '../public/',
};

