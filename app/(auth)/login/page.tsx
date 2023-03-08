import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getValidSessionByToken } from '../../../database/sessions';
import ApolloClientProvider from '../../ApolloClientProvider';
import LoginForm from './loginForm';

type Props = { searchParams: { returnTo?: string | string[] } };

export default async function LoginPage(props: Props) {
  // check if we have a valid session
  const sessionTokenCookie = cookies().get('sessionToken');

  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));

  // if yes redirect to home
  if (session) {
    redirect('/');
  }

  return (
    <>
      <h1>Login</h1>
      <ApolloClientProvider initialApolloState={JSON.stringify([])}>
        <LoginForm returnTo={props.searchParams.returnTo} />
      </ApolloClientProvider>
      <div>
        <h2>No Account?</h2>
        <Link className="border rounded-md" href="/register">
          Register
        </Link>
      </div>
    </>
  );
}
