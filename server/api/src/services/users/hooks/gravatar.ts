
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

import { Hook } from '@feathersjs/feathers';
import { checkContext, getItems, replaceItems } from 'feathers-hooks-common';

// We need this to create the MD5 hash
import * as crypto from "crypto";

// The Gravatar image service
const gravatarUrl = 'https://s.gravatar.com/avatar';
// The size query. Our chat needs 60px images
const query = 's=60';

function processRecord(record: any) {
  // Our data model:
  //  email: string

  // The user email
  const { email } = record;
  // Gravatar uses MD5 hashes from an email address (all lowercase) to get the image
  const hash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');

  record.avatar = `${gravatarUrl}/${hash}?${query}`;

  return record;
}

// tslint:disable-next-line:no-unused-variable
export default function (options: any = {}): Hook {

  // Return the actual hook.
  return async (context) => {
    // Throw if the hook is being called from an unexpected location.
    checkContext(context, null, ['find', 'get', 'create', 'update', 'patch', 'remove']);

    // Get the authenticated user.
    // tslint:disable-next-line:no-unused-variable
    const { user } = context.params!;
    // Get the record(s) from context.data (before), context.result.data or context.result (after).
    // getItems always returns an array to simplify your processing.
    let records = getItems(context);

    // Inspect and Modify records.
    if (Array.isArray(records)) {
      records.forEach((record, index) => {
        records[index] = processRecord(record);
      });
    } else {
      // throw new Error('getItems() returned non-Array'); // Somehow it is not an Array for single record.
      records = processRecord(records);
    }

    // Place the modified records back in the context.
    replaceItems(context, records);
    // Best practice: hooks should always return the context.
    return context;
  };
}

// Throw on unrecoverable error.
// tslint:disable-next-line:no-unused-variable
function error(msg: string) {
  throw new Error(msg);
}
