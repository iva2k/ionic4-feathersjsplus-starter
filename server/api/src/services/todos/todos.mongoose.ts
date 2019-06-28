
/* tslint:disable:quotemark */
// Defines Mongoose model for service `todos`. (Can be re-generated.)
import merge from 'lodash.merge';
// tslint:disable-next-line:no-unused-variable
import mongoose from 'mongoose';
// !code: imports // !end
// !code: init // !end

let moduleExports = merge({},
  // !<DEFAULT> code: model
  {
    title: {
      type: String,
      required: true
    },
    notes: String,
    userId: mongoose.Schema.Types.ObjectId
  },
  // !end
  // !code: moduleExports // !end
);

// !code: exports // !end
export default moduleExports;

// !code: funcs // !end
// !code: end // !end
