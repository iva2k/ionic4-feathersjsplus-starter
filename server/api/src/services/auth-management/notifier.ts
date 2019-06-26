/*  tslint:disable no-console  */ // TODO: (now) Remove console.log after DEBUG is done.
// import logger from '../../logger';

import { App } from '../../app.interface';
import { User } from './../users/users.interface';

import path from 'path';
import fs from 'fs';
import * as crypto from 'crypto';
import juice from 'juice';

import * as pug from 'pug';
const ext = 'pug';
const eng = pug;

let moduleExports = function(app: App) {

  const logo = path.join(app.get('public'), app.get('logo')) || '';
  const supportEmail = app.get('email_support') || '';  // Support address to include for transaction emails
  const fromEmail = app.get('email_from_auth') || '';  // "From" address for transaction emails
  const replyEmail = // "Response" address for transaction emails
    // Choose one of the options: TODO: Implement config parameter for transaction emails
    // fromEmail
    supportEmail
    // '' // empty field TODO: check if it produces output 'Reply-To' header.. No "Reply-To" in header.
    // '"" : ' // special string, provides empty list of emails using group notation. Shows up as "Reply-To: undefined:;"
    // TODO: (soon) check how clients fill in reply & reply-all addresses: Gmail: ?, Yahoo: from/from, Hotmail: ?, Outlook: ?.
  ;
  const emailAccountTemplatesPath = path.join(app.get('src'), 'email-templates', 'account');

  /**
   * Format URL for action link
   * @param {string} type
   * @param {string} token
   * @returns {string}
   */
  function getLink(type: string, token: any): string {
    const protocol = (app.get('clientapp_protocol') || 'http') + '://';
    const host = app.get('clientapp_host') || 'localhost';
    const port = ':' + app.get('clientapp_port');
    const fragment = ''; // On hash-style links should be: '#!/';
    return `${protocol}${host}${port}/${fragment}${type}/${token}`;
  }

  /**
   * Generate md5 hash for given value
   * @param {string} value
   * @returns {string}
   */
  function getHash(value: string): string {
    const md5sum = crypto.createHash('md5');
    md5sum.update(value);
    return md5sum.digest('hex');
  }

  /**
   * Format attachment object for given file
   * @param {string} cyd
   * @param {string} filepath
   * @param {striing} disposition
   * @returns {Object}
   */
  function formatAttachment(cid: string, filepath: string, disposition: string = 'inline') {
    let attachment = {
      filename: path.basename(filepath),
      path: filepath,
      encoding: 'base64',
      cid: cid.toString(),
      contentDisposition: disposition,
    };
    return attachment;
  }

  function sendEmail(email: any) {
    return app.service('emails').create(email).then(function (result) {
      console.log('Sent email', result);
    }).catch(err => {
      console.log('Error sending email', err);
    });
  }

  return {
    /**
     * @param {string} type
     * @param {User} user
     * @param {Object} notifierOptions
     * @returns {Promise}
     */
    // tslint:disable next-line no-unused-vars
    notifier(type: string, user: User, notifierOptions: any) {
      console.log(`-- Preparing ${type} email to ${user.email}`);
      const userName = user.name || user.email; // TODO: (now) Implement user.name / use firstName/lastName
      let subject, template, hash, hashLink, changes;

      // Insert attachment inline images (URL-based data is blocked by certain clients, e.g. Gmail)
      const cidLogo = getHash('logo@cid');
      const attachments = [formatAttachment(cidLogo, logo)];

      switch (type) {
      case 'resendVerifySignup': // From resendVerifySignup API call: send another email with link for verifying user's email addr
        subject = 'Confirm Signup';
        template = 'verify-email';
        hash = user.verifyToken;
        hashLink = getLink('verify-account', hash);
        break;

      case 'verifySignup': // From verifySignupLong and verifySignupShort API calls: inform that user's email is now confirmed
        subject = 'Thank you, your email has been verified';
        template = 'email-verified';
        hash = user.verifyToken;
        hashLink = getLink('verify-account', hash);
        break;

      case 'sendResetPwd': // From sendResetPwd API call: send email with password reset link and token
        subject = 'Reset Password';
        template = 'reset-password';
        hash = user.resetToken;
        hashLink = getLink('reset-password', hash);
        break;

      case 'resetPwd': // From resetPwdLong and resetPwdShort API calls: inform that user's password was reset
        subject = 'Your password was changed';
        template = 'password-change';
        // hash = user.resetToken; // hash & hashLink are not used.
        // hashLink = getLink('reset-password', hash);
        break;

      case 'passwordChange': // From passwordChange API call
        subject = 'Your password was changed';
        template = 'password-change';
        break;

      case 'identityChange': // From identityChange API call
        subject = 'Your account was changed. Please verify the changes';
        template = 'identity-change';
        hash = user.verifyToken; // TODO: (when needed) hash & hashLink used in the template. Where do they send the user?
        hashLink = getLink('verify-account-changes', hash);
        changes = user.verifyChanges;
        break;

      default:
        return Promise.reject(new Error(`Unknown command ${type}`));
      }

      let templatePath = path.join(emailAccountTemplatesPath, template + '.' + ext);
      let fields = {
        logo: 'cid:' + cidLogo,
        from: fromEmail,
        name: userName,
        supportEmail, // For support email link
        hash,
        hashLink,
        changes
      };
      // if (hashLink) fields.hashLink = hashLink;
      // if (changes) fields.changes = changes;
      let compiledHTML = eng.compileFile(templatePath)(fields);
      let styledHTML = juice(compiledHTML);
      let email = {
        envelope: {
          // Special trick: sets 'Return-Path' header to replyEmail by sending MAIL FROM command to SMTP server.
          // Unfortunately, Gmail server ignores it.
          // TODO: (soon) Some settings in GMail account should be set to include other "from" addresses explicitly.
          from: replyEmail,
          to: user.email
        },
        from: fromEmail,
        replyTo: replyEmail,
        to: user.email,
        subject,
        // html: compiledHTML,
        html: styledHTML,
        attachments,
      };
      if (process.env.NODE_ENV === 'development') { // Writing to 'public' is a security issue. Could be done only in dev, never in production!
        // Allow inspecting intermediate and end HTML results.
        // js: var fs = require('fs');
        const outfile = path.join(app.get('public'), template);
        fs.writeFile(outfile + '.compiled.html', compiledHTML, function(err) {
          if (err) console.log(err);
          else console.log('Saved file %s', outfile + '.compiled.html');
        });
        fs.writeFile(outfile + '.styled.html', styledHTML, function(err) {
          if (err) console.log(err);
          console.log('Saved file %s', outfile + '.styled.html');
        });
      }
      return sendEmail(email);
    }
  };
};

export default moduleExports;

