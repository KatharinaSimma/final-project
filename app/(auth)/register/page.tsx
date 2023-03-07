import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getValidSessionByToken } from '../../../database/sessions';
import ApolloClientProvider from '../../ApolloClientProvider';
import RegisterForm from './registerForm';

type Props = { searchParams: { returnTo?: string | string[] } };
export default async function RegistrationPage(props: Props) {
  // check if i have a valid session
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
      <RegisterForm returnTo={props.searchParams.returnTo} />
    </ApolloClientProvider>
  );
}
