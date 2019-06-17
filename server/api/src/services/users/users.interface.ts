
// Define TypeScript interface for service `users`. (Can be re-generated.)
// !code: imports // !end
// !code: init // !end

// tslint:disable-next-line:no-empty-interface
export interface UserBase {
  // !<DEFAULT> code: interface
  email: string;
  password: string;
  // !end
}

// tslint:disable-next-line:no-empty-interface
export interface User extends UserBase {
  name: string;
  verifyToken?: any;
  resetToken?: any;
  verifyChanges?: any;

  // !code: more // !end
}

// !code: funcs // !end
// !code: end // !end
