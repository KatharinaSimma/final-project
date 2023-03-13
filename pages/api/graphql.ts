import crypto from 'node:crypto';
import { gql } from '@apollo/client';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import {
  createList,
  createTask,
  createUserListRelation,
  deleteListById,
  deleteTaskById,
  getListById,
  getLists,
  getListWithTask,
  getTaskByListId,
  updateTaskById,
} from '../../database/lists';
import { createSession, deleteSessionByToken } from '../../database/sessions';
import {
  createUser,
  deleteUserById,
  getListUserRelations,
  getUserById,
  getUserBySessionToken,
  getUserByUsername,
  getUserByUsernameWithPasswordHash,
  getUsers,
  getUserWithList,
} from '../../database/users';
import { createSerializedRegisterSessionTokenCookie } from '../../util/cookies';

type Args = {
  id: string;
};

type Token = {
  token: string;
};

type RegisterUserInput = {
  username: string;
  password: string;
};

type LoginArgument = {
  username: string;
  password: string;
};

type UserContext = {
  isUserLoggedIn: boolean;
  req: { cookies: { sessionToken: string } };
  user: {
    id: number;
    username: string;
  };
  res: {
    setHeader: (setCookie: string, cookieValue: string) => void;
  };
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
  type UserContext {
    isUserLoggedIn: Boolean
    username: String
    userId: String
  }

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

  type UserListWithTasks {
    lists: [ListWithTasks]
  }

  type User {
    id: ID!
    username: String!
    listWithTasks: [ListWithTasks]
  }

  type Token {
    token: String
  }

  type Query {
    lists: [List]
    list(id: ID!): List
    tasksByListId(listId: ID!): [Task]
    listWithTasks: [ListWithTasks]
    singleListWithTasks(id: ID!): ListWithTasks
    userBySessionToken(token: String!): User
    user: User
    users: [User]
    userListWithTasks: [ListWithTasks]
  }

  type Mutation {
    createList(title: String!): List
    createTask(title: String!, listId: String!): Task
    createUser(username: String!, password: String!): User

    deleteListById(id: ID): List
    deleteTaskById(id: ID!): Task
    updateTaskById(id: ID!, title: String, done: Boolean): Task
    deleteUserById(id: ID!): User

    login(username: String!, password: String!): User
    logout(token: String!): Token
  }
`;

const resolvers = {
  Query: {
    lists: async () => {
      return await getLists();
    },

    list: (parent: string, args: Args) => {
      return getListById(parseInt(args.id));
    },

    users: async () => {
      return await getUsers();
    },

    user: (parent: string, args: Args) => {
      return getUserById(parseInt(args.id));
    },

    tasksByListId: async (parent: string, args: { listId: string }) => {
      return await getTaskByListId(parseInt(args.listId));
    },

    listWithTasks: async (parent: any, args: any, context: UserContext) => {
      const allLists = await getUserWithList(context.user.id);
      return allLists;
    },

    singleListWithTasks: async (parent: any, args: Args) => {
      return await getListById(parseInt(args.id));
    },

    userBySessionToken: async (parent: any, args: { token: string }) => {
      return await getUserBySessionToken(args.token);
    },
  },

  ListWithTasks: {
    tasks: async (parent: any) => {
      return await getListWithTask(parseInt(parent.id));
    },
  },

  User: {
    listWithTasks: async (parent: any, args: any, context: UserContext) => {
      const user = await getUserWithList(context.user.id);
      return user;
    },
  },

  Mutation: {
    createList: async (
      parent: string,
      args: ListInput,
      context: UserContext,
    ) => {
      if (!context.isUserLoggedIn) {
        throw new GraphQLError('Unauthorized operation');
      }
      if (
        typeof args.title !== 'string' ||
        (args.description && typeof args.description !== 'string') ||
        !args.title
      ) {
        throw new GraphQLError('Required field is missing');
      }
      const newList = await createList(args.title);
      if (!newList || !newList.id) {
        throw new GraphQLError('Could not create new List');
      }
      await createUserListRelation(context.user.id, newList.id);
      return newList;
    },

    createTask: async (
      parent: string,
      args: TaskInput,
      context: UserContext,
    ) => {
      if (!context.isUserLoggedIn) {
        throw new GraphQLError('Unauthorized operation');
      }
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

    createUser: async (
      parent: string,
      args: RegisterUserInput,
      context: UserContext,
    ) => {
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

      const passwordHash = await bcrypt.hash(args.password, 12);

      const newUser = await createUser(args.username, passwordHash);

      if (!newUser) {
        throw new GraphQLError(
          'Internal server error (500): User creation failed',
        );
      }

      // create a session for the new user
      const token = crypto.randomBytes(80).toString('base64');
      // const csrfSecret = createCsrfSecret();

      // create the session
      const session = await createSession(
        token,
        newUser.id,
        // csrfSecret,
      );

      if (!session) {
        throw new GraphQLError('Creating session failed');
      }

      const serializedCookie = createSerializedRegisterSessionTokenCookie(
        session.token,
      );
      context.res.setHeader('Set-Cookie', serializedCookie);

      return newUser;
    },

    login: async (
      parent: string,
      args: LoginArgument,
      context: UserContext,
    ) => {
      // check input type
      if (
        !args.username ||
        !args.password ||
        typeof args.username !== 'string' ||
        typeof args.password !== 'string'
      ) {
        throw new GraphQLError('Required field missing');
      }

      // check if username exists
      const userWithPasswordHash = await getUserByUsernameWithPasswordHash(
        args.username,
      );
      if (!userWithPasswordHash) {
        throw new GraphQLError("Credentials don't match");
      }

      // check if password is valid
      const isPasswordValid = await bcrypt.compare(
        args.password,
        userWithPasswordHash.passwordHash,
      );
      if (!isPasswordValid) {
        throw new GraphQLError("Credentials don't match");
      }

      // create the token
      const token = crypto.randomBytes(80).toString('base64');
      // const csrfSecret = createCsrfSecret();

      // create the session
      const session = await createSession(
        token,
        userWithPasswordHash.id,
        // csrfSecret,
      );

      if (!session) {
        throw new GraphQLError('Creating session failed');
      }

      const serializedCookie = createSerializedRegisterSessionTokenCookie(
        session.token,
      );
      context.res.setHeader('Set-Cookie', serializedCookie);

      return getUserByUsername(args.username);
    },

    deleteListById: async (
      parent: string,
      args: Args,
      context: UserContext,
    ) => {
      if (!context.isUserLoggedIn) {
        throw new GraphQLError('Unauthorized operation');
      }

      return await deleteListById(parseInt(args.id));
    },

    deleteTaskById: async (
      parent: string,
      args: Args,
      context: UserContext,
    ) => {
      if (!context.isUserLoggedIn) {
        throw new GraphQLError('Unauthorized operation');
      }

      return await deleteTaskById(parseInt(args.id));
    },

    updateTaskById: async (
      parent: string,
      args: TaskInput,
      context: UserContext,
    ) => {
      if (!context.isUserLoggedIn) {
        throw new GraphQLError('Unauthorized operation');
      }
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

    logout: async (parent: string, args: Token) => {
      return await deleteSessionByToken(args.token);
    },

    deleteUserById: async (parent: string, args: Args) => {
      await deleteUserById(parseInt(args.id));
      // clean up orphaned lists
      const lists = await getLists();
      const listRelations = await getListUserRelations();
      lists.forEach(async (list) => {
        const foundId = listRelations.find((relation) => {
          return list.id === relation.listId;
        });
        if (!foundId) {
          await deleteListById(list.id);
        }
      });
      return;
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
    const user = await getUserBySessionToken(req.cookies.sessionToken!);
    const isUserLoggedIn = user ? true : false;
    return { req, res, isUserLoggedIn, user };
  },
});
