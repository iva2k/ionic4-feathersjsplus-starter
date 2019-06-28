
// tslint:disable:no-trailing-whitespace
// Define the combined GraphQL schema. (Can be re-generated.)
// !code: imports // !end
// !code: init // !end

let moduleExports = `
type Todo {
  id: ID
  title: String!
  notes: String
  userId: ID
  user: [User!]
}
 
type User {
  _id: ID
  email: String!
  isVerified: Boolean
  verifyToken: String
  verifyExpires: Int
  verifyChanges: JSON
  resetToken: String
  resetExpires: Int
  todos: [Todo!]
}
 

type Query {
  getTodo(key: JSON, query: JSON, params: JSON): Todo
  findTodo(query: JSON, params: JSON): [Todo]!
  getUser(key: JSON, query: JSON, params: JSON): User
  findUser(query: JSON, params: JSON): [User]!
}
`;

// !code: exports // !end
export default moduleExports;

// !code: funcs // !end
// !code: end // !end
