
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

import { Hook } from '@feathersjs/feathers';
import { checkContext, getItems, replaceItems } from 'feathers-hooks-common';

function processRecord(record: any, userId: string) {
  // Our data model:
  //  _id: string;
  //  title: string;
  //  notes: string;
  // userId: string
  // TODO: (soon) implement data-driven approach (based on schema?)
  // Throw an error if we didn't get all fields
  if (!record.title) {
    throw new Error('A todo must have a title');
  }
  if (!record.notes) {
    record.notes = '';
  }
  let userIdFinal = record.userId || userId; // Can use userId supplied in the record (by data seeder) // TODO: (soon) is it a security concern?
  if (userIdFinal === undefined) {
    throw new Error('A todo must have a userId');
  }
  const title = record.title
    // Titles can't be longer than 400 characters
    .substring(0, 400);
  const notes = record.notes
    // Notes can't be longer than 4096 characters
    .substring(0, 4096);
  // Override the original data (so that people can't submit additional stuff)
  record = {
    title,
    notes,
    userId: userIdFinal,
    createdAt: new Date().getTime() // Add the current date
  };
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

    // If no user, it is important for the seeder to pass given userId.
    const userId: string = user ? user._id : context.data.userId;

    // Get the record(s) from context.data (before), context.result.data or context.result (after).
    // getItems always returns an array to simplify your processing.
    let records = getItems(context);

    // Inspect and Modify records.
    if (Array.isArray(records)) {
      records.forEach((record, index) => {
        records[index] = processRecord(record, userId);
      });
    } else {
      // throw new Error('getItems() returned non-Array'); // Somehow it is not an Array for single record.
      records = processRecord(records, userId);
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
