import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { initializeApollo } from '../../util/graphql';
import ThemeChooser from './ThemeChooser';

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
    <div className="min-h-screen text-center pt-9 bg-base-200">
      <div className="flex-col">
        <h1 className="mx-auto my-5 text-3xl font-bold">User Profile</h1>
        <div className="flex-shrink-0 w-full max-w-md mx-auto shadow-2xl card bg-base-100">
          <div className="card-body">
            <p>You are logged in as</p>
            <span className="my-5 text-4xl text-primary ">
              <em>{data.userBySessionToken.username}</em>
            </span>

            <Link
              className="btn btn-outline btn-primary"
              href="/logout"
              prefetch={false}
            >
              Logout
            </Link>
          </div>
        </div>
      </div>
      <ThemeChooser />
    </div>
  );
}
