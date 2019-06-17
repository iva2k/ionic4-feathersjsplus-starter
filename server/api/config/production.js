
module.exports = {
  from             : 'production.js',
  host             :             process.env.PROD_APP_HOST       || 'api-app.feathersjs.com',
  port             :    parseInt(process.env.PROD_APP_PORT)      || 8080,
  public           :             process.env.PROD_PUBLIC         || '../public/',
  email_service    :             process.env.PROD_EMAIL_SERVICE,
  email_login      :             process.env.PROD_EMAIL_LOGIN,
  email_pass       :             process.env.PROD_EMAIL_PASSWORD,
  email_reports    :             process.env.PROD_EMAIL_REPORTS,
  gravatar_only    : !!(parseInt(process.env.PROD_GRAVATAR_ONLY) || 1),
  gravatar_ext     :             process.env.PROD_GRAVATAR_EXT,
  gravatar_size    :    parseInt(process.env.PROD_GRAVATAR_SIZE) || 80,
  gravatar_default :             process.env.PROD_GRAVATAR_DEFAULT,
  gravatar_rating  :             process.env.PROD_GRAVATAR_RATING,
};

