import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { initializeApollo } from '../../util/graphql';

export default async function UserProfilePage() {
  const client = initializeApollo(null);
  const sessionToken = cookies().get('sessionToken');

  const { data } = await client.query({
    query: gql`
    query userBySessionToken($token: String! = "${sessionToken?.value}") {
      userBySessionToken(token: $token) {
        id
        username
      }
    }
  `,
  });

  if (!data.userBySessionToken) {
    redirect('/login');
  }

  return (
    <>
      <h1>Profile</h1>
      <h2>name: {data.userBySessionToken.username}</h2>
      <p>id:{data.userBySessionToken.id}</p>
      <Link className="border rounded-md" href="/logout">
        Logout
      </Link>
    </>
  );
}
