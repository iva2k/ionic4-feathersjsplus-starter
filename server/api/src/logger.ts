
// Logger. (Can be re-generated.)
import { createLogger, format, transports } from 'winston';
// !code: imports // !end
// !code: init
function getLogLevel() {
  // To see more detailed errors, change this to 'debug' // TODO: (soon) move to config/env.
  let level = 'info'; // production, dev, test
  if (process.env.NODE_ENV === 'staging') {
    level = 'debug'; // staging.
  }
  return level;
}
// !end

// Configure the Winston logger. For the complete documentation seee https://github.com/winstonjs/winston
const moduleExports = createLogger({
  // !code: level
  level: getLogLevel(),
  // !end
  // !<DEFAULT> code: format
  format: format.combine(
    format.splat(),
    format.simple()
  ),
  // !end
  // !<DEFAULT> code: transport
  transports: [
    new transports.Console()
  ],
  // !end
  // !code: moduleExports // !end
});

// !code: exports // !end
export default moduleExports;

// !code: funcs // !end
// !code: end // !end
