import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import { initializeApollo } from '../util/graphql';
import Navigation from './Navigation';

export default async function Header() {
  const client = initializeApollo(null);
  const sessionToken = cookies().get('sessionToken');

  const { data } = await client.query({
    query: gql`
      query userBySessionToken($token: String! = "${sessionToken?.value}") {
        userBySessionToken(token: $token) {
          username
        }
      }
  `,
  });
  return (
    <header className="hidden sm:block sm:p-5 sm:h-16">
      <Navigation username={data.userBySessionToken?.username} />
    </header>
  );
}
