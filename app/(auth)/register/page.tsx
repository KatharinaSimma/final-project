import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ApolloClientProvider from '../../ApolloClientProvider';
import RegisterForm from './registerForm';

type Props = { searchParams: { returnTo?: string | string[] } };
export default function RegistrationPage(props: Props) {
  const nextCookies = cookies();

  const fakeSessionToken = nextCookies.get('fakeSessionToken');

  if (fakeSessionToken?.value) {
    redirect('/');
  }
  return (
    <ApolloClientProvider initialApolloState={JSON.stringify([])}>
      <RegisterForm returnTo={props.searchParams.returnTo} />
    </ApolloClientProvider>
  );
}
