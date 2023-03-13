import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { initializeApollo } from '../../util/graphql';
import ApolloClientProvider from '../ApolloClientProvider';
import DeleteUser from './DeleteUser';
import ThemeChooser from './ThemeChooser';
import UserInfoBox from './UserInfoBox';

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

        <ApolloClientProvider
          initialApolloState={JSON.stringify(client.cache.extract())}
        >
          <UserInfoBox data={data.userBySessionToken.username} />
          <ThemeChooser />
          <div className="my-7 divider"> DANGER ZONE</div>
          <DeleteUser userId={data.userBySessionToken.id} />
        </ApolloClientProvider>
      </div>
    </div>
  );
}
