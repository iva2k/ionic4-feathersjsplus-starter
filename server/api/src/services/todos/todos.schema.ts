
// Define the Feathers schema for service `todos`. (Can be re-generated.)
// !code: imports // !end
// !code: init // !end

// Define the model using JSON-schema
let schema = {
  // !<DEFAULT> code: schema_header
  title: 'Todos',
  description: 'Todos database.',
  // !end
  // !code: schema_definitions
  fakeRecords: 3,
  // !end

  // Required fields.
  required: [
    // !code: schema_required
    'title',
    // !end
  ],
  // Fields with unique values.
  uniqueItemProperties: [
    // !code: schema_unique // !end
  ],

  // Fields in the model.
  properties: {
    // !code: schema_properties
    _id: { type: 'ID' },
    title: { faker: 'commerce.productName'},
    // notes: { faker: 'company.catchPhrase' },
    notes: { faker: {fake: 'Perform {{company.catchPhrase}}, then {{hacker.verb}}.'} },
    userId: { type: 'ID', faker: { fk: 'users:random' } }, // Foreign key from `users`
    createdAt: { type: 'integer' /* Date */, faker: { exp: 'Date.now() - 60*60*1000' /* 1hr */} },
    // !end
  },
  // !code: schema_more // !end
};

// Define optional, non-JSON-schema extensions.
let extensions = {
  // GraphQL generation.
  graphql: {
    // !code: graphql_header
    name: 'Todo',
    service: {
      sort: { _id: 1 },
    },
    // sql: {
    //   sqlTable: 'Todos',
    //   uniqueKey: '_id',
    //   sqlColumn: {
    //     __authorId__: '__author_id__',
    //   },
    // },
    // !end
    discard: [
      // !code: graphql_discard // !end
    ],
    add: {
      // !code: graphql_add
      // __author__: { type: '__User__!', args: false, relation: { ourTable: '__authorId__', otherTable: '_id' } },
      user: { type: '[User!]', args: false, relation: { ourTable: 'userId', otherTable: '_id' } },
      // !end
    },
    // !code: graphql_more // !end
  },
};

// !code: more // !end

let moduleExports = {
  schema,
  extensions,
  // !code: moduleExports // !end
};

// !code: exports // !end
export default moduleExports;

// !code: funcs // !end
// !code: end // !end
