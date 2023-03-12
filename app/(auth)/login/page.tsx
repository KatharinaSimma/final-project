import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { initializeApollo } from '../../../util/graphql';
import ApolloClientProvider from '../../ApolloClientProvider';
import LoginForm from './loginForm';

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
    <ApolloClientProvider
      initialApolloState={JSON.stringify(client.cache.extract())}
    >
      <LoginForm />
    </ApolloClientProvider>
  );
}
