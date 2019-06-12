
module.exports = {
  from             : 'test.js',
  mongodb          : 'mongodb://no-connection-string-config-test',
  mysql            : 'mysql://root:@no-connection-string-config-test',
  nedb             :             '../test/data',
  postgres         : 'postgres://postgres:@no-connection-string-config-test',
  rethinkdb        : 'rethinkdb://no-connection-string-config-test',
  sqlite           : 'sqlite://no-connection-string-config-test',
  mssql            : 'mssql://root:password@no-connection-string-config-test',
  gravatar_only    : !!(parseInt(process.env.TEST_GRAVATAR_ONLY) || 1),
  gravatar_ext     :             process.env.TEST_GRAVATAR_EXT,
  gravatar_size    :    parseInt(process.env.TEST_GRAVATAR_SIZE),
  gravatar_default :             process.env.TEST_GRAVATAR_DEFAULT,
  gravatar_rating  :             process.env.TEST_GRAVATAR_RATING,
};
