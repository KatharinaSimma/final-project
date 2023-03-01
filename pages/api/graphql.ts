import { gql } from '@apollo/client';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLError } from 'graphql';
import {
  createList,
  getListById,
  getLists,
  getTaskByListId,
} from '../../database/lists';

// import { isUserAdminBySessionToken } from '../../database/users';

type Args = {
  id: string;
};

type ListInput = {
  id: string;
  title: string;
  description: string;
};

// type FakeAdminAnimalContext = {
//   isAdmin: boolean;
//   req: { cookies: { fakeSessionToken: string } };
// };

const typeDefs = gql`
  type List {
    id: ID!
    title: String!
    description: String
  }

  type Task {
    id: ID!
    title: String!
    description: String
  }

  type Query {
    lists: [List]
    list(id: ID!): List
    tasksByListId(listId: ID!): [Task]
  }

  type Mutation {
    createList(title: String!, description: String!): List
    # deleteListById(id: ID): List
    # updateListById(id: ID!, title: String!, description: String!): List
  }
`;

// Create fake serializedCookie for authentication
// function createFakeSerializedCookie(firstName: string) {
//   return `fakeSessionToken=${firstName}; HttpOnly; SameSite=lax; Path=/; Max-Age=3600`;
// }

const resolvers = {
  Query: {
    lists: async () => {
      return await getLists();
    },

    list: (parent: string, args: Args) => {
      return getListById(parseInt(args.id));
    },

    tasksByListId: async (parent: string, args: { listId: string }) => {
      return await getTaskByListId(parseInt(args.listId));
    },

    // getLoggedInAnimalByFirstName: async (
    //   parent: string,
    //   args: { firstName: string },
    // ) => {
    //   if (!args.firstName) {
    //     throw new GraphQLError('User must be logged in');
    //   }
    //   return await getAnimalByFirstName(args.firstName);
    // },
  },

  Mutation: {
    createList: async (parent: string, args: ListInput) => {
      if (
        typeof args.title !== 'string' ||
        (args.description && typeof args.description !== 'string') ||
        !args.title
      ) {
        throw new GraphQLError('Required field is missing');
      }
      return await createList(args.title, args.description);
    },

    // deleteAnimalById: async (
    //   parent: string,
    //   args: Args,
    //   context: FakeAdminAnimalContext,
    // ) => {
    //   if (!context.isAdmin) {
    //     throw new GraphQLError('Unauthorized operation');
    //   }

    //   return await deleteAnimalById(parseInt(args.id));
    // },

    // updateAnimalById: async (parent: string, args: AnimalInput) => {
    //   if (
    //     typeof args.firstName !== 'string' ||
    //     typeof args.type !== 'string' ||
    //     (args.accessory && typeof args.type !== 'string') ||
    //     !args.firstName ||
    //     !args.type
    //   ) {
    //     throw new GraphQLError('Required field missing');
    //   }

    //   return await updateAnimalById(
    //     parseInt(args.id),
    //     args.firstName,
    //     args.type,
    //     args.accessory,
    //   );
    // },

    // login: async (
    //   parent: string,
    //   args: LoginArgument,
    //   context: AnimalAuthenticationContext,
    // ) => {
    //   // FIXME: Implement secure authentication
    //   if (
    //     typeof args.username !== 'string' ||
    //     typeof args.password !== 'string' ||
    //     !args.username ||
    //     !args.password
    //   ) {
    //     throw new GraphQLError('Required field missing');
    //   }

    //   if (args.username !== 'Mayo' || args.password !== 'asdf') {
    //     throw new GraphQLError('Invalid username or password');
    //   }

    //   const fakeSerializedCookie = createFakeSerializedCookie(args.username);
    //   context.res.setHeader('Set-Cookie', fakeSerializedCookie);

    //   return await getAnimalByFirstName(args.username);
    // },
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer({
  schema,
});

export default startServerAndCreateNextHandler(server);
