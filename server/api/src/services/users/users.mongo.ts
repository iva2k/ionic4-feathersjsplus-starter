
/* tslint:disable:quotemark */
// Defines the MongoDB $jsonSchema for service `users`. (Can be re-generated.)
import merge from 'lodash.merge';
// !code: imports // !end
// !code: init // !end

let moduleExports = merge({},
  // !<DEFAULT> code: model
  {
    bsonType: "object",
    additionalProperties: false,
    properties: {
      _id: {
        bsonType: "objectId"
      },
      email: {
        faker: "internet.email",
        bsonType: "string"
      },
      password: {
        faker: "internet.password",
        bsonType: "string"
      },
      isVerified: {
        bsonType: "boolean"
      },
      verifyToken: {
        bsonType: "string"
      },
      verifyExpires: {
        bsonType: "int"
      },
      verifyChanges: {
        bsonType: "object",
        additionalProperties: false,
        properties: {
          _id: {
            bsonType: "objectId"
          }
        }
      },
      resetToken: {
        bsonType: "string"
      },
      resetExpires: {
        bsonType: "int"
      }
    },
    required: [
      "email"
    ]
  },
  // !end
  // !code: moduleExports // !end
);

// !code: exports // !end
export default moduleExports;

// !code: funcs // !end
// !code: end // !end
