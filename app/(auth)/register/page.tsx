import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { initializeApollo } from '../../../util/graphql';
import ApolloClientProvider from '../../ApolloClientProvider';
import RegisterForm from './registerForm';

export const metadata = {
  title: 'Register',
  description: 'Register for Taskology, a wunderlist-style task list app.',
};

type Props = { searchParams: { returnTo?: string | string[] } };
export default async function RegistrationPage(props: Props) {
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
    <ApolloClientProvider initialApolloState={JSON.stringify([])}>
      <RegisterForm returnTo={props.searchParams.returnTo} />
    </ApolloClientProvider>
  );
}
