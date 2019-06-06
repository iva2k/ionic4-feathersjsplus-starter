import { User } from './../users/users.interface';

// Define TypeScript interface for service `todos`. (Can be re-generated.)
// !code: imports // !end
// !code: init // !end

// tslint:disable-next-line:no-empty-interface
export interface TodoBase {
  // !<DEFAULT> code: interface
  title: string;
  notes: string;
  userId: string;
  // !end
}

// tslint:disable-next-line:no-empty-interface
export interface Todo extends TodoBase {
  // !code: more
  user: User;
  // !end
}

// !code: funcs // !end
// !code: end // !end
