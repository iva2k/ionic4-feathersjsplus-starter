
module.exports = {
  from               : 'production.js',
  protocol           :             process.env.PROD_APP_PROTOCOL       || 'https',
  host               :             process.env.PROD_APP_HOST           || 'api-app.feathersjs.com',
  port               :    parseInt(process.env.PROD_APP_PORT)          || 8080,
  clientapp_protocol :             process.env.PROD_CLIENTAPP_PROTOCOL || 'https',
  clientapp_host     :             process.env.PROD_CLIENTAPP_HOST     || 'localhost',
  clientapp_port     :    parseInt(process.env.PROD_CLIENTAPP_PORT)    || 8100,
  public             :             process.env.PROD_PUBLIC             || '../public/',
  // ? nedb               :                                                '../data',
  email_service      :             process.env.PROD_EMAIL_SERVICE,
  email_login        :             process.env.PROD_EMAIL_LOGIN,
  email_pass         :             process.env.PROD_EMAIL_PASSWORD,
  email_reports      :             process.env.PROD_EMAIL_REPORTS,
  email_support      :             process.env.PROD_EMAIL_SUPPORT,
  email_from_auth    :             process.env.PROD_EMAIL_FROM_AUTH,
  gravatar_only      : !!(parseInt(process.env.PROD_GRAVATAR_ONLY)     || 1),
  gravatar_ext       :             process.env.PROD_GRAVATAR_EXT,
  gravatar_size      :    parseInt(process.env.PROD_GRAVATAR_SIZE)     || 80,
  gravatar_default   :             process.env.PROD_GRAVATAR_DEFAULT,
  gravatar_rating    :             process.env.PROD_GRAVATAR_RATING,
};

