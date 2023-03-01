import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// ts type
type Args = {
  id: string;
};

// gql type
const typeDefs = `#graphql
  type List {
    id: ID!
    title: String
    description: String
  }

  type Query {
    lists: [List]
    list(id: ID!): List
  }
`;

const lists = [
  {
    id: 1,
    title: 'Billa',
    description: 'Einkaufsliste',
  },
  {
    id: 2,
    title: 'Reading',
    description:
      'Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro. De carne lumbering animata corpora quaeritis. Sum',
  },
  {
    id: 3,
    title: 'Habits',
    description: 'Stuff!',
  },
  {
    id: 4,
    title: 'Penny',
    description: 'Summus brains s morbo vel maleficia? De apocalypsi.',
  },
  {
    id: 5,
    title: 'Obi',
    description: 'Zombie ipsum reversus ab viral inferno.',
  },
  {
    id: 6,
    title: 'Books',
    description: 'Zombie ipsum reversus ab viral inferno.',
  },
];

const resolvers = {
  Query: {
    lists: () => lists,
    list: (parent: string, args: Args) => {
      return lists.find((list) => list.id === parseInt(args.id));
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startApolloServer() {
  const { url } = await startStandaloneServer(server, {
    listen: {
      port: 8000,
    },
  });
  console.log(`Server is running at: ${url}`);
}

startApolloServer().catch((error) => {
  console.log(error);
});
