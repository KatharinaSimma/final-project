import { gql } from '@apollo/client';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import {
  createList,
  createTask,
  deleteListById,
  deleteTaskById,
  getListById,
  getLists,
  getListWithTask,
  getTaskByListId,
  updateTaskById,
} from '../../database/lists';
import {
  createUser,
  getUserByUsername,
  getUserByUsernameWithPasswordHash,
  isUserAdminBySessionToken,
} from '../../database/users';

type Args = {
  id: string;
};

type RegisterUserInput = {
  username: string;
  password: string;
};

type LoginArgument = {
  username: string;
  password: string;
};

type UserAuthenticationContext = {
  res: {
    setHeader: (setCookie: string, cookieValue: string) => void;
  };
};

type UserContext = {
  isAdmin: boolean;
  req: { cookies: { fakeSessionToken: string } };
};

type ListInput = {
  id: string;
  title: string;
  description: string;
};

type TaskInput = {
  listId: string;
  title: string;
  id: string;
  done: boolean;
};

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
    listId: ID!
    done: Boolean
  }

  type ListWithTasks {
    id: ID!
    title: String!
    description: String
    tasks: [Task]
  }

  type User {
    id: ID!
    username: String!
    password: String
  }

  type Query {
    lists: [List]
    list(id: ID!): List
    tasksByListId(listId: ID!): [Task]
    listWithTasks: [ListWithTasks]
    singleListWithTasks(id: ID!): ListWithTasks
  }

  type Mutation {
    createList(title: String!): List
    createTask(title: String!, listId: String!): Task
    createUser(username: String!, password: String!): User

    deleteListById(id: ID): List
    deleteTaskById(id: ID!): Task

    updateTaskById(id: ID!, title: String, done: Boolean): Task
    login(username: String!, password: String!): User
  }
`;

// Create fake serializedCookie for authentication
// FIX WITH JOSÈ
function createFakeSerializedCookie(firstName: string) {
  return `fakeSessionToken=${firstName}; HttpOnly; SameSite=lax; Path=/; Max-Age=3600`;
}

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

    listWithTasks: async () => {
      // return value: type [ListWithTask]
      return await getLists();
    },

    singleListWithTasks: async (parent: any, args: Args) => {
      return await getListById(parseInt(args.id));
    },

    // getLoggedInAnimalByFirstName: async (
    //   parent: string,
    //   args: { firstName: string },
    // ) => {
    //   if (!args.firstName) {
    //     throw new GraphQLError('User must be logged in');
    //   }
    //   return await getUserByUserName(args.firstName);
    // },
  },

  ListWithTasks: {
    tasks: async (parent: any) => {
      return await getListWithTask(parent.id);
    },
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
      return await createList(args.title);
    },

    createTask: async (parent: string, args: TaskInput) => {
      if (
        !args.title ||
        !args.listId ||
        typeof args.title !== 'string' ||
        typeof args.listId !== 'string'
      ) {
        throw new GraphQLError('Required field is missing');
      }
      return await createTask(args.title, parseInt(args.listId));
    },

    createUser: async (parent: string, args: RegisterUserInput) => {
      // validate input
      // FIXME: Add zod types???
      if (
        !args.username ||
        !args.password ||
        typeof args.username !== 'string' ||
        typeof args.password !== 'string'
      ) {
        throw new GraphQLError('Required field is missing');
      }

      const user = await getUserByUsername(args.username);
      if (user) {
        throw new GraphQLError('User already exists');
      }

      // FIXME: bcrypt breaks application
      const passwordHash = await bcrypt.hash(args.password, 12);

      const newUser = await createUser(args.username, passwordHash);

      if (!newUser) {
        throw new GraphQLError(
          'Internal server error (500): User creation failed',
        );
      }
      return newUser;
    },

    login: async (
      parent: string,
      args: LoginArgument,
      context: UserContext,
    ) => {
      if (
        !args.username ||
        !args.password ||
        typeof args.username !== 'string' ||
        typeof args.password !== 'string'
      ) {
        throw new GraphQLError('Required field missing');
      }
      // FIXME: Implement secure authentication

      const userWithPasswordHash = await getUserByUsernameWithPasswordHash(
        args.username,
      );

      if (!userWithPasswordHash) {
        throw new GraphQLError("Credentials don't match");
      }

      const isPasswordValid = await bcrypt.compare(
        args.password,
        userWithPasswordHash.passwordHash,
      );

      if (!isPasswordValid) {
        throw new GraphQLError("Credentials don't match");
      }

      // const fakeSerializedCookie = createFakeSerializedCookie(args.username);
      // context.res.setHeader('Set-Cookie', fakeSerializedCookie);

      // return userWithPasswordHash.username;

      return await getUserByUsername(args.username);
    },

    deleteListById: async (
      parent: string,
      args: Args,
      // context: FakeAdminAnimalContext,
    ) => {
      // if (!context.isAdmin) {
      // throw new GraphQLError('Unauthorized operation');
      // }

      return await deleteListById(parseInt(args.id));
    },

    deleteTaskById: async (
      parent: string,
      args: Args,
      // context: FakeAdminAnimalContext,
    ) => {
      // if (!context.isAdmin) {
      // throw new GraphQLError('Unauthorized operation');
      // }

      return await deleteTaskById(parseInt(args.id));
    },

    updateTaskById: async (parent: string, args: TaskInput) => {
      if (
        !args.id ||
        (args.id && typeof args.id !== 'string') ||
        typeof args.title !== 'string' ||
        typeof args.done !== 'boolean'
      ) {
        throw new GraphQLError('Required field missing');
      }

      return await updateTaskById(parseInt(args.id), args.title, args.done);
    },
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer({
  schema,
});

export default startServerAndCreateNextHandler(server, {
  context: async (req, res) => {
    // FIXME: Implement secure authentication
    const isAdmin = await isUserAdminBySessionToken(
      req.cookies.fakeSessionToken!,
    );
    return { req, res, isAdmin };
  },
});
