import { cookies } from 'next/headers';
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
    <ApolloClientProvider initialApolloState={JSON.stringify([])}>
      <LoginForm returnTo={props.searchParams.returnTo} />
    </ApolloClientProvider>
  );
}
