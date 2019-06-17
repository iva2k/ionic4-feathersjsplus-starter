
// Initializes the `authManagement` service on path `/auth-management`. (Can be re-generated.)
import { App } from '../../app.interface';

import createService from './auth-management.class';
import hooks from './auth-management.hooks';
// !code: imports
import authManagement from 'feathers-authentication-management';
// !end
// !code: init // !end

let moduleExports = function (app: App) {

  let paginate = app.get('paginate');
  // !code: func_init // !end

  let options = {
    paginate,
    // !code: options_more
    service: '/users', // default: '/users'
    path: 'authManagement', // The path to associate with this service. Default authManagement.
    // Note: Client lib is hardcoded to 'authManagement'.
    //  notifier: function(type, user, notifierOptions) /* : Promise => */ { return Promise.resolve(user); }
    //  type: type of notification:
    //    - 'resendVerifySignup' From resendVerifySignup API call
    //    - 'verifySignup' From verifySignupLong and verifySignupShort API calls
    //    - 'sendResetPwd' From sendResetPwd API call
    //    - 'resetPwd' From resetPwdLong and resetPwdShort API calls
    //    - 'passwordChange' From passwordChange API call
    //    - 'identityChange' From identityChange API call
    //  user: user's item, minus password.
    //  notifierOptions: notifierOptions option from resendVerifySignup and sendResetPwd API calls
    //
    skipIsVerifiedCheck: true, // We are not using email verification. Besides, until email is verified,
    // cannot reset own password, even though it verifies the email by sending reset message to it.
    // See https://github.com/feathers-plus/feathers-authentication-management/issues/41
    longTokenLen: 15, // Half the length of the long token. Default is 15, giving 30-char tokens.
    shortTokenLen: 6, // Length of short token. Default is 6.
    shortTokenDigits: true, // Short token is digits if true, else alphanumeric. Default is true.
    delay: 5 * 24 * 60 * 60 * 1000, // Duration for sign up email verification token in ms. Default is 5 days.
    resetDelay: 2 * 60 * 60 * 1000, // Duration for password reset token in ms. Default is 2 hours.
    identifyUserProps: ['email'], // Prop names in user item which uniquely identify the user,
    // e.g. ['username', 'email', 'cellphone']. The default is ['email']. The prop values must be strings.
    // Only these props may be changed with verification by the service. At least one of these props must
    // be provided whenever a short token is used, as the short token alone is too susceptible to brute
    // force attack.

    // sanitizeUserForClient: function(user) {},

    // !end
  };
  // !code: options_change // !end

  // Initialize our service with any options it requires
  // !code: extend
  app.configure(authManagement(options));
  // https://github.com/feathers-plus/feathers-authentication-management/blob/master/docs.md
  // The authManagement service creates and maintains the following properties in the user item:
  //   - isVerified: If the user's email addr has been verified (boolean)
  //   - verifyToken: The 30-char token generated for email addr verification (string)
  //   - verifyShortToken: The 6-digit token generated for cellphone addr verification (string)
  //   - verifyExpires: When the email addr token expire (Date)
  //   - verifyChanges New values to apply on verification to some identifyUserProps (string array)
  //   - resetToken: The 30-char token generated for forgotten password reset (string)
  //   - resetShortToken: The 6-digit token generated for forgotten password reset (string)
  //   - resetExpires: When the forgotten password token expire (Date)
  // The following user item might also contain the following props:
  //   - preferredComm The preferred way to notify the user. One of identifyUserProps.

  // !end

  // Get our initialized service so that we can register hooks
  const service = app.service('authManagement');

  service.hooks(hooks);
  // !code: func_return // !end
};

// !code: exports // !end
export default moduleExports;

// !code: funcs // !end
// !code: end // !end
