// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

import { Hook } from '@feathersjs/feathers';
import { checkContext, getItems, replaceItems } from 'feathers-hooks-common';

// We need this to create the MD5 hash
import * as crypto from "crypto";

// The Gravatar image service
const gravatarUrl = 'https://s.gravatar.com/avatar/'; // Note trailing slash.

function processRecord(app: any, record: any) {
  if (app.get('gravatar_only') || !record.avatar) {
    let ext = app.get('gravatar_ext') || 'jpg'; // Image type
    if (ext) ext = '.' + ext; // Feathers config automatically converts strings starting with dot to absolute paths. As it can't start with dot, insert one.

    // The query.
    const query = 's=' + (app.get('gravatar_size') || 80) + '&d=' + (app.get('gravatar_default') || 'robohash') + '&r=' + (app.get('gravatar_rating') || 'g');
    // Gravatar URL query parameters
    // s= size, 1px up to 2048px
    // d= default image
    //  - <url>    : URL-encoded URL of default image
    //  - 404      : do not load any image if none is associated with the email hash, instead return an HTTP 404 (File Not Found) response
    //  - mp       : (mystery-person) a simple, cartoon-style silhouetted outline of a person (does not vary by email hash)
    //  - identicon: a geometric pattern based on an email hash
    //  - monsterid: a generated 'monster' with different colors, faces, etc
    //  - wavatar  : generated faces with differing features and backgrounds
    //  - retro    : awesome generated, 8-bit arcade-style pixelated faces
    //  - robohash : a generated robot with different colors, faces, etc
    //  - blank    : a transparent PNG image
    // r= rating
    //  - g : suitable for display on all websites with any audience type.
    //  - pg: may contain rude gestures, provocatively dressed individuals, the lesser swear words, or mild violence.
    //  - r : may contain such things as harsh profanity, intense violence, nudity, or hard drug use.
    //  - x : may contain hardcore sexual imagery or extremely disturbing violence.

    // The user email
    const { email } = record;
    if (email) {
      // Gravatar uses MD5 hashes from an email address (all lowercase) to get the image
      const hash = crypto.createHash('md5').update(email.toLowerCase().trim()).digest('hex');

      record.avatar = `${gravatarUrl}${hash}${ext}?${query}`;
    } else {
      // If no email given, skip hash. Gravatar will still return default image
      record.avatar = `${gravatarUrl}?${query}`;
    }
  }

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
        records[index] = processRecord(context.app, record);
      });
    } else {
      // throw new Error('getItems() returned non-Array'); // Somehow it is not an Array for single record.
      records = processRecord(context.app, records);
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
