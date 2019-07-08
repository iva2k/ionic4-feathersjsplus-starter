
// fgraphql populate hook for service `users`. (Can be re-generated.)
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
      todos: {},
    }
  },
  // All resolver fields 2 levels deep.
  twoLevels: {
    query: {
      todos: {
        user: {},
      },
    }
  },
  // !code: queries
  /* custom queries examples from <https://github.com/feathers-plus/hooks-graphql-example/blob/master/src/services/users/users.populate.js>
  ex2: {
    query: {
      posts: {},
    },
  },
  ex3: {
    query: {
      posts: {},
      comments: {},
      followed_by: {},
      following: {},
      likes: {},
    },
  },
  ex4: {
    query: {
      email: 1,
      posts: {
        body: 1,
        draft: 1,
      },
    },
  },
  ex5: {
    query: {
      email: 1,
      posts: {
        body: 1,
        author: {
          email: 1,
        }
      },
      likes: {
        author: {
          email: 1,
        },
        comment: {
          body: 1,
        },
      },
    },
    options: {
      inclAllFieldsServer: false
    },
  },
  ex6: {
    query: {
      fullName: {},
      following: {
        follower: {
          fullName: {},
        }
      },
      followed_by: {
        followee: {
          fullName: {},
        },
      },
      likes: {
        comment: {
          body: 1,
          post: {
            body: 1,
          },
        },
      },
      posts: {
        _args: {query:{$sort:{body:1}}},
        body: 1,
        comments: {
          body: 1,
          author: {
            fullName: {},
          },
        },
        author: {
          fullName: {},
          following: {
            follower: {
              fullName: {},
            }
          },
          followed_by: {
            followee: {
              fullName: {},
            },
          },
        }
      },
    },
    options: {
      inclAllFieldsServer: false,
    },
  },
  */
  // !end
};

async function usersPopulate (context: HookContext) {
  // tslint:disable-next-line:no-unused-variable
  const params = context.params;
  let query, options, serializer;

  if (params.$populate) { return context; } // another populate is calling this service

  // !code: populate
  // Example: always the same query
  // ({ query, options, serializer } = queries.twoLevels);

  // Example: select query based on user being authenticated or not
  ({ query, options, serializer } = params.user ? queries.twoLevels : queries.none);

  /*
  // Example: select query based on the user role
  if (params.user && params.user.roles.includes('foo')) {
    ({ query, options, serializer } = queries.foo);
  }

  // Example: allow client to provide the query
  if (params.$populateQuery) {
    ({ query, options, serializer } = params.$populateQuery);
  }
  */

  let newContext: any;
  if (query) {
    // Populate the data.
    newContext = await fgraphql({
      parse,
      runTime,
      schema,
      resolvers,
      recordType: 'User',
      query,
      options,
    } as FGraphQLHookOptions)(context);
  } else {
    newContext = context;
  }

  // Prune and sanitize the data.
  if (serializer) {
    newContext = serialize(serializer)(newContext);
  }

  // End the hook.
  return newContext;
  // !end
}

// !code: more // !end
let moduleExports = usersPopulate;

// !code: exports // !end
export default moduleExports;

// !code: funcs // !end
// !code: end // !end

/* For your information: all record and resolver fields 2 levels deep.
const twoLevelsFields = {
  query: {
    _id: 1,
    email: 1,
    password: 1,
    isVerified: 1,
    verifyToken: 1,
    verifyExpires: 1,
    verifyChanges: 1,
    resetToken: 1,
    resetExpires: 1,
    todos: {
      _args: {},
      id: 1,
      title: 1,
      notes: 1,
      userId: 1,
      user: {},
    },
  }
};
*/
