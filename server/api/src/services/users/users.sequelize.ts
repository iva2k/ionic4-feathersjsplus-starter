
/* tslint:disable:quotemark */
// Defines Sequelize model for service `users`. (Can be re-generated.)
import merge from 'lodash.merge';
import Sequelize, { DefineAttributes } from 'sequelize';
// tslint:disable-next-line:no-unused-variable
const DataTypes = (Sequelize as any).DataTypes as Sequelize.DataTypes;
// !code: imports // !end
// !code: init // !end

// Your model may need the following fields:
//   email:      { type: DataTypes.STRING, allowNull: false, unique: true },
//   password:   { type: DataTypes.STRING, allowNull: false },
//   googleId:   { type: DataTypes.STRING },
//   facebookId: { type: DataTypes.STRING },
let moduleExports = merge({},
  // !<DEFAULT> code: sequelize_model
  {
    email: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    password: {
      type: DataTypes.TEXT
    },
    isVerified: {
      type: DataTypes.BOOLEAN
    },
    verifyToken: {
      type: DataTypes.TEXT
    },
    verifyExpires: {
      type: DataTypes.INTEGER
    },
    verifyChanges: {
      type: DataTypes.JSONB
    },
    resetToken: {
      type: DataTypes.TEXT
    },
    resetExpires: {
      type: DataTypes.INTEGER
    }
  } as DefineAttributes,
  // !end
  // !code: moduleExports // !end
);

// !code: exports // !end
export default moduleExports;

// !code: funcs // !end
// !code: end // !end
