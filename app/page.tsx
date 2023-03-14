import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { initializeApollo } from '../util/graphql';
import ApolloClientProvider from './ApolloClientProvider';
import ListContainer from './components/ListContainer';

export default async function HomePage() {
  const client = initializeApollo(null);
  const sessionToken = cookies().get('sessionToken');

  const { data, loading } = await client.query({
    query: gql`
    query userBySessionToken($token: String! = "${sessionToken?.value}") {
      userBySessionToken(token: $token) {
        id
        username
      }
    }
  `,
  });

  if (loading) return <button className="btn loading">loading</button>;

  if (!data.userBySessionToken) {
    redirect('/login');
  }

  return (
    <main className="min-h-[calc(100vh-7rem)] mb-12 p-2">
      <h1 className="py-5 text-3xl text-center">Your Lists</h1>
      <div className="max-w-5xl m-auto">
        <ApolloClientProvider
          initialApolloState={JSON.stringify(client.cache.extract())}
        >
          <ListContainer />
        </ApolloClientProvider>
      </div>
    </main>
  );
}
