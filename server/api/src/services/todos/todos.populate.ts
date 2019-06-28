
// fgraphql populate hook for service `todos`. (Can be re-generated.)
import runTime from '@feathers-plus/graphql/lib/run-time';
import { fgraphql, serialize, FGraphQLHookOptions, SyncContextFunction, SerializeSchema } from 'feathers-hooks-common';
import { Query, HookContext } from '@feathersjs/feathers';
import { parse } from 'graphql';
// !<DEFAULT> code: graphql
import schema from '../../services/graphql/graphql.schemas';
import resolvers from '../../services/graphql/service.resolvers';
// !end
// !code: imports // !end
// !code: init // !end

const queries: {[s: string]: { query?: Query | SyncContextFunction<Query>, options?: FGraphQLHookOptions, serializer?: SerializeSchema | SyncContextFunction<SerializeSchema>}} = {
  // No populate
  none: {},
  // All resolver fields 1 level deep.
  oneLevel: {
    query: {
      user: {},
    }
  },
  // All resolver fields 2 levels deep.
  twoLevels: {
    query: {
      user: {
        todos: {},
      },
    }
  },
  // !code: queries // !end
};

async function todosPopulate (context: HookContext) {
  // tslint:disable-next-line:no-unused-variable
  const params = context.params;
  let query, options, serializer;

  if (params.$populate) { return context; } // another populate is calling this service

  // !code: populate
  // Example: always the same query
  ({ query, options, serializer } = queries.foo);

  /*
  // Example: select query based on user being authenticated or not
  ({ query, options, serializer } = queries[params.user ? queries.foo : queries.bar]);

  // Example: select query based on the user role
  if (params.user && params.user.roles.includes('foo')) {
    ({ query, options, serializer } = queries.foo);
  }

  // Example: allow client to provide the query
  if (params.$populateQuery) {
    ({ query, options, serializer } = params.$populateQuery);
  }
  */

  // Populate the data.
  let newContext: any = await fgraphql({
    parse,
    runTime,
    schema,
    resolvers,
    recordType: 'Todo',
    query,
    options,
  } as FGraphQLHookOptions)(context);

  // Prune and sanitize the data.
  if (serializer) {
    newContext = serialize(serializer)(newContext);
  }

  // End the hook.
  return newContext;
  // !end
}

// !code: more // !end
let moduleExports = todosPopulate;

// !code: exports // !end
export default moduleExports;

// !code: funcs // !end
// !code: end // !end

/* For your information: all record and resolver fields 2 levels deep.
const twoLevelsFields = {
  query: {
    id: 1,
    title: 1,
    notes: 1,
    userId: 1,
    user: {
      _args: {},
      _id: 1,
      email: 1,
      password: 1,
      isVerified: 1,
      verifyToken: 1,
      verifyExpires: 1,
      verifyChanges: 1,
      resetToken: 1,
      resetExpires: 1,
      todos: {},
    },
  }
};
*/
