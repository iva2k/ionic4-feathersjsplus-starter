
/* tslint:disable no-console */
// Start the server. (Can be re-generated.)
// !code: preface // !end
import logger from './logger';
import app from './app';
import seedData from './seed-data';
// !code: imports
import * as internalIp from 'internal-ip';
import path from 'path';
import fs from 'fs';
// !end
// !code: init
logger.info('NODE_ENV: %s', process.env.NODE_ENV);
logger.info('app.get(\'env\'): %s', app.get('env'));
logger.info('from: %s', app.get('from'));
logger.info('host: %s', app.get('host'));
logger.info('port: %s', app.get('port'));
// !end

const port = app.get('port');
const server = app.listen(port);
// !code: init2 // !end

process.on('unhandledRejection', (reason, p) => {
  // !<DEFAULT> code: unhandled_rejection_log
  logger.error('Unhandled Rejection at: Promise ', p, reason);
  // !end
  // !code: unhandled_rejection // !end
});

server.on('listening', async () => {
  // !<DEFAULT> code: listening_log
  logger.info('Feathers application started on http://%s:%d', app.get('host'), port);
  // !end
  // !code: listening // !end
  await seedData(app);
  // !code: listening1
  serverIP().then(ips => {

    return Promise.all([
      serverJson(ips),
      sendStartedEmail(ips)
    ]);
  });
  // !end
});

// !code: funcs
interface Ips {ip4: string; ip6: string; }
function serverIP(): Promise<Ips> {
  let ip4: string, ip6: string;
  return internalIp.v6().then((ip: string) => {
    ip6 = ip;
    return internalIp.v4();
  }).then((ip: string) => {
    ip4 = ip;
    logger.info('Internal IP ipv4: ' + ip4 + ' ipv6: ' + ip6);
    return { ip4, ip6 };
  }).catch(err => {
    logger.error('Error saving IP address for client: %o', err);
    throw err;
  });
}
function serverJson(ips: Ips): Promise<any[]> {
  if (process.env.NODE_ENV !== 'development') { // TODO: remove hard-coded NODE_ENV, use targets 'www' parameter per config.
    return Promise.resolve([]);
  } // else ...

  // Save local IP address and port to JSON file that client app can read. Simplify development config a bit.
  // const outfile = path.join(app.get('www'), 'server.json');
  let targets = app.get('www') || [];
  if (!Array.isArray(targets)) targets = [targets];
  let data = {
    ip4: ips.ip4,
    ip6: ips.ip6,
    port
  };
  let tasks: Array<Promise<void>> = [];
  for (let target of targets) {
    let outfile = path.join(target, 'server.json');
    let task = new Promise<void>(function(resolve, reject) {
      fs.readdir(path.dirname(outfile), {}, (err, files) => {
        if (err) {
          logger.error(err);
          resolve(); // Ignore errors
        } else {
          fs.writeFile(outfile, JSON.stringify(data), function(error) {
            if (error) logger.error(error);
            else logger.info('Saved file %s', outfile);
            resolve(); // Ignore errors
          });
        }
      });
    });
    // tslint:disable-next-line: no-unused-expression
    tasks.push(task);
  }
  return Promise.all(tasks);
}

async function sendStartedEmail(ips: Ips): Promise<void> {
  // Use the /emails service
  const crlf = '\r\n';
  const emailHead = ''
    + '<!DOCTYPE html>' + crlf
    + '<html lang=\"en-US\">' + crlf
    + '  <head>' + crlf
    + '    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />' + crlf
    + '  </head>' + crlf
    + '  <body>' + crlf;
  const emailTail = '' + crlf
    + '  </body>' + crlf
    + '</html>';
  const url = 'http://' + app.get('host') + ':' + app.get('port') + '/';
  const appName = app.get('appName') || 'ionic4-feathers+';
  const email = {
    from:    app.get('email_login'),
    to:      app.get('email_reports'),
    subject: '[' + appName + '] ' + app.get('env') + ' server started',
    html:    ''
      + emailHead
      + 'This is just to let you know that Feathers ' + app.get('env')
      + ' server has started for ' + appName + ' app on <a href="' + url + '">' + url + '</a>'
      + ' (Server IPv4: ' + ips.ip4 + ' IPv6: ' + ips.ip6 + ')'
      + emailTail
  };
  logger.info('Email composed: %o', email);
  return app.service('emails').create(email).then(function (result) {
    logger.info('Sent email', result);
  }).catch(err => {
    logger.error(err);
    throw err;
  });
}

// !end
// !code: end // !end
