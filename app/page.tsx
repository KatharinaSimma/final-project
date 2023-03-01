import { gql } from '@apollo/client';
import { initializeApollo } from '../util/graphql';
import ApolloClientProvider from './ApolloClientProvider';
import ListContainer from './ListContainer';

export default async function Home() {
  const client = initializeApollo(null);
  await client.query({
    query: gql`
      query getLists {
        lists {
          id
          title
          description
        }
      }
    `,
  });
  return (
    <main className="min-h-[calc(100vh-7rem)] mb-12  p-2">
      <h1 className="py-5 text-3xl text-center">Your Lists</h1>
      <div className="max-w-5xl m-auto ">
        <ApolloClientProvider
          initialApolloState={JSON.stringify(client.cache.extract())}
        >
          <ListContainer />
        </ApolloClientProvider>
      </div>
    </main>
  );
}
