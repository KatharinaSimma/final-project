import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { initializeApollo } from '../../../util/graphql';
import ApolloClientProvider from '../../ApolloClientProvider';
import LoginForm from './loginForm';

export const metadata = {
  title: 'Login',
  description: 'Login to Taskology, a wunderlist-style task list app.',
};

export default async function LoginPage() {
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

  if (data.userBySessionToken) {
    redirect('/');
  }

  return (
    <main className="min-h-screen">
      <ApolloClientProvider
        initialApolloState={JSON.stringify(client.cache.extract())}
      >
        <LoginForm />
      </ApolloClientProvider>
    </main>
  );
}
