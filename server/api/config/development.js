
module.exports = {
  from: 'development.js',

  host:          process.env.DEV_APP_HOST  || 'localhost',
  port: parseInt(process.env.DEV_APP_PORT) || 3030,
  public:        process.env.DEV_PUBLIC    || '../public/',

  mongodb: 'mongodb://no-connection-string-config-dev',
  mysql: 'mysql://root:@no-connection-string-config-dev',
  nedb: '../data',
  postgres: 'postgres://postgres:@no-connection-string-config-dev',
  rethinkdb: 'rethinkdb://no-connection-string-config-dev',
  sqlite: 'sqlite://no-connection-string-config-dev',
  mssql: 'mssql://root:password@no-connection-string-config-dev',
};

