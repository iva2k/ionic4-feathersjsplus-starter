
// Define TypeScript interface for service `users`. (Can be re-generated.)
// !code: imports // !end
// !code: init // !end

// tslint:disable-next-line:no-empty-interface
export interface UserBase {
  // !<DEFAULT> code: interface
  _id: unknown;
  email: string;
  password: string;
  isVerified: boolean;
  verifyToken: string;
  verifyExpires: number;
  verifyChanges: {

};
  resetToken: string;
  resetExpires: number;
  // !end
}

// tslint:disable-next-line:no-empty-interface
export interface User extends UserBase {
  // !<DEFAULT> code: more
  _id: any; // change if needed
  // !end
}

// !code: funcs // !end
// !code: end // !end
