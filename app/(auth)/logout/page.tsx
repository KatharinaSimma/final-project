import { gql } from '@apollo/client';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { initializeApollo } from '../../../util/graphql';

export default async function LogoutPage() {
  const client = initializeApollo(null);
  const sessionToken = await headers().get('x-sessionToken-to-delete');

  if (sessionToken) {
    await client.mutate({
      mutation: gql`
      mutation logout($token: String! = "${sessionToken}") {
        logout(token: $token) {
          id
        }
      }
    `,
    });
  }

  redirect('/login');
}
