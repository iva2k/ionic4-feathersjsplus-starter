
/* tslint:disable:quotemark */
// Defines Mongoose model for service `users`. (Can be re-generated.)
import merge from 'lodash.merge';
// tslint:disable-next-line:no-unused-variable
import mongoose from 'mongoose';
// !code: imports // !end
// !code: init // !end

let moduleExports = merge({},
  // !<DEFAULT> code: model
  {
    email: {
      type: String,
      required: true
    },
    password: String,
    isVerified: Boolean,
    verifyToken: String,
    verifyExpires: Number,
    verifyChanges: {},
    resetToken: String,
    resetExpires: Number
  },
  // !end
  // !code: moduleExports // !end
);

// !code: exports // !end
export default moduleExports;

// !code: funcs // !end
// !code: end // !end
