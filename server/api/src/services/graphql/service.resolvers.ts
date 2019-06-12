
/* tslint:disable no-unused-variable, indent */
// Define GraphQL resolvers using only Feathers services. (Can be re-generated.)
import { App } from '../../app.interface';
import { Paginated } from '@feathersjs/feathers';
import { FGraphQLResolverMap } from 'feathers-hooks-common';
// !code: imports
import { Service } from '@feathersjs/feathers';
// !end
// !code: init // !end

export interface ServiceResolverOptions {
  convertArgsToFeathers: any;
  extractAllItems: any;
  extractFirstItem: any;
}

let moduleExports = function serviceResolvers(app: App, options: ServiceResolverOptions) {
  const {convertArgsToFeathers, extractAllItems, extractFirstItem} = options;
  // !<DEFAULT> code: extra_auth_props
  const convertArgs = convertArgsToFeathers([]);
  // !end

  // !code: services
  let todos: Service<any> = app.service('/todos');
  let users: Service<any> = app.service('/users');
  // !end

  let returns: FGraphQLResolverMap = {

    Todo: {

      // user: [User!]
      user:
        // !<DEFAULT> code: resolver-Todo-user
        (parent, args, content, ast) => {
          const feathersParams = convertArgs(args, content, ast, {
            query: { _id: parent.userId, $sort: undefined }, paginate: false
          });
          return users.find(feathersParams).then(extractAllItems);
        },
        // !end
    },

    User: {

      // todos: [Todo!]
      todos:
        // !<DEFAULT> code: resolver-User-todos
        (parent, args, content, ast) => {
          const feathersParams = convertArgs(args, content, ast, {
            query: { userId: parent._id, $sort: undefined }, paginate: false
          });
          return todos.find(feathersParams).then(extractAllItems);
        },
        // !end
    },

    // !code: resolver_field_more // !end

    Query: {

      // !<DEFAULT> code: query-Todo
      // getTodo(query: JSON, params: JSON, key: JSON): Todo
      getTodo(parent, args, content, ast) {
        const feathersParams = convertArgs(args, content, ast);
        return todos.get(args.key, feathersParams).then(extractFirstItem);
      },

      // findTodo(query: JSON, params: JSON): [Todo!]
      findTodo(parent, args, content, ast) {
        const feathersParams = convertArgs(args, content, ast, { query: { $sort: {   _id: 1 } } });
        return todos.find(feathersParams).then(paginate(content)).then(extractAllItems);
      },
      // !end

      // !<DEFAULT> code: query-User
      // getUser(query: JSON, params: JSON, key: JSON): User
      getUser(parent, args, content, ast) {
        const feathersParams = convertArgs(args, content, ast);
        return users.get(args.key, feathersParams).then(extractFirstItem);
      },

      // findUser(query: JSON, params: JSON): [User!]
      findUser(parent, args, content, ast) {
        const feathersParams = convertArgs(args, content, ast, { query: { $sort: {   _id: 1 } } });
        return users.find(feathersParams).then(paginate(content)).then(extractAllItems);
      },
      // !end
      // !code: resolver_query_more // !end
    },
  };

  // !code: func_return // !end
  return returns;
};

// !code: more // !end

// !code: exports // !end
export default moduleExports;

function paginate(content: any) {
  return (result: any[] | Paginated<any>) => {
    content.pagination = !isPaginated(result) ? undefined : {
      total: result.total,
      limit: result.limit,
      skip: result.skip,
    };

    return result;
  };
}

function isPaginated<T>(it: T[] | Paginated<T>): it is Paginated<T> {
  return !!(it as any).data;
}
// !code: funcs // !end
// !code: end // !end
