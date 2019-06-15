
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
// !code: init // !end

logger.info('NODE_ENV: %s', process.env.NODE_ENV);
logger.info('app.get(\'env\'): %s', app.get('env'));
logger.info('from: %s', app.get('from'));
logger.info('host: %s', app.get('host'));
logger.info('port: %s', app.get('port'));

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
  serverJson();
  // !end
});

// !code: funcs
function serverJson() {
  if (process.env.NODE_ENV === 'development') {
    // Save local IP address and port to JSON file that client app can read. Simplify development config a bit.
    // const outfile = path.join(app.get('www'), 'server.json');
    let targets = app.get('www') || [];
    if (!Array.isArray(targets)) targets = [targets];

    let ip4: string, ip6: string;
    internalIp.v6().then((ip: string) => {
      ip6 = ip;
      return internalIp.v4();
    }).then((ip: string) => {
      ip4 = ip;
      logger.info('Internal IP ipv4: ' + ip4 + ' ipv6: ' + ip6);
      let data = {
        ip4,
        ip6,
        port
      };
      for (let target of targets) {
        let outfile = path.join(target, 'server.json');
        fs.readdir(path.dirname(outfile), {}, (err, files) => {
          if (err) logger.error(err);
          else {
            fs.writeFile(outfile, JSON.stringify(data), function(err) {
              if (err) logger.error(err);
              else logger.info('Saved file %s', outfile);
            });
          }
        });
      }
    }).catch((reason: any) => {
      logger.error('Error saving IP address for client: %o', reason);
    });
  }
}
// !end
// !code: end // !end
